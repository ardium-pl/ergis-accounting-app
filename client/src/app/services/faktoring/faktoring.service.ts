import { Injectable, computed, inject, signal } from '@angular/core';
import { PrnReaderService } from '../prn-reader/prn-reader.service';
import { PrnObject } from '../prn-reader/prn-reader.types';
import { parseNumber, parseYesNo } from './../../utils/helpers';
import { FaktoringMode, FaktoringObject, FinalFaktoringObject, LeftoversFlag } from './faktoring.types';

@Injectable({
    providedIn: 'root',
})
export class FaktoringService {
    private readonly prnReader = inject(PrnReaderService);

    private readonly _prnFile = signal<File | null>(null);
    public readonly prnFile = computed(() => this._prnFile());
    private readonly _prnArray = signal<PrnObject[]>([]);
    public readonly prnArray = computed(() => this._prnArray());
    private readonly _prnHeaders = signal<string[]>([]);
    public readonly prnHeaders = computed(() => this._prnHeaders());
    public readonly hasPrn = computed(() => this._prnArray().length > 0);

    public setPrnFile(file: File): void {
        const reader = new FileReader();
        reader.onload = e => {
            const content = e.target?.result as string;

            const prnObjects = this.prnReader.readPrn(content);
            this._prnArray.set(prnObjects);

            const headers = this.prnReader.readPrnHeaders(content);
            this._prnHeaders.set(headers);
        };
        reader.onerror = () => {
            throw new Error('Error reading file.');
        };
        reader.readAsText(file);
        this._prnFile.set(file);
    }
    public removePrnRow(index: number): void {
        const newArray = [...this._prnArray()];
        newArray.splice(index, 1);
        this._prnArray.set(newArray);
    }
    public updatePrnRow(index: number, key: string, value: string): void {
        const newArray = [...this._prnArray()];
        newArray[index][key] = value;
        this._prnArray.set(newArray);
    }

    public processData(pastEntries: FaktoringObject[], faktoringMode: FaktoringMode) {
        const rawPrnObjects = this._prnArray();

        if (pastEntries.some(v => v.kwotaWWalucie == 0)) {
            throw new Error(`Kwota w walucie musi być różna od zero.`);
        }

        pastEntries = pastEntries.map(obj => ({
            referencjaKG: obj.referencjaKG,
            naDzien: obj.naDzien,
            kwotaWWalucie: parseNumber(obj.kwotaWWalucie as unknown as string),
            kwotaWZl: parseNumber(obj.kwotaWZl as unknown as string),
            korekta: parseYesNo(obj.korekta),
        }));

        const positives: FaktoringObject[] = pastEntries[0].kwotaWWalucie > 0 ? [...pastEntries] : [];
        const negatives: FaktoringObject[] = pastEntries[0].kwotaWWalucie < 0 ? [...pastEntries] : [];

        // filter out corrections & sort entries into positives and negatives
        for (const obj of rawPrnObjects) {
            const mappedObj = this._mapRawPrnObject(obj);
            if (mappedObj.korekta) continue;
            if (mappedObj.kwotaWWalucie == 0) continue; // Removing correction positions, marked as Rkur WB
            if (mappedObj.kwotaWZl < 0) {
                negatives.push(mappedObj);
                continue;
            }
            if (mappedObj.kwotaWZl > 0) {
                positives.push(mappedObj);
                continue;
            }
        }

        // if there aren't any positives then there isn't data to process
        if (!positives) return null;
        // try processing the data
        try {
            return this._processData(positives, negatives, faktoringMode);
        } catch (err) {
            // return null if an error is encountered
            console.error(err);
            return null;
        }
    }

    private _mapRawPrnObject(rawObject: PrnObject): FaktoringObject {
        return {
            referencjaKG: rawObject['ReferencjaKG'],
            naDzien: rawObject['NaDzie'], //The polisch character ń can't fit into a key
            kwotaWWalucie: parseNumber(rawObject['KwotaWWalucie']),
            kwotaWZl: parseNumber(rawObject['Kwota']),
            korekta: parseYesNo(rawObject['Kor']),
        };
    }

    private _processData(
        positives: FaktoringObject[],
        negatives: FaktoringObject[],
        faktoringMode: FaktoringMode
    ): [FinalFaktoringObject[], FaktoringObject[]] {
        if (negatives.length == 0) return [[], []];
        // make negative entries positive for easier logic
        negatives = negatives.map(v => ({
            ...v,
            kwotaWWalucie: -v.kwotaWWalucie,
            kwotaWZl: -v.kwotaWZl,
        }));
        // get the first
        let positiveObject = positives.shift()!;
        let negativeObject = negatives.shift()!;

        let positiveAmount = positiveObject?.kwotaWWalucie;
        let negativeAmount = negativeObject.kwotaWWalucie;

        if (positives.length == 0) {
            const negativeExchangeRate = negativeObject.kwotaWZl / negativeObject.kwotaWWalucie;
            negatives = this._retrieveUnusedElement(
                negativeAmount,
                negatives,
                negativeExchangeRate,
                negativeObject.referencjaKG,
                negativeObject.naDzien
            );
            return [[], negatives];
        }

        const allCurrencyCorrections: FinalFaktoringObject[] = [];
        let leftoversFlag: LeftoversFlag = LeftoversFlag.NoneLeft;

        while ((positives.length > 0 || !isNaN(positiveAmount)) && negatives.length > 0) {
            const negativeExchangeRate = negativeObject.kwotaWZl / negativeObject.kwotaWWalucie;
            const positiveExchangeRate = positiveObject.kwotaWZl / positiveObject.kwotaWWalucie;

            const referencjaKG = faktoringMode == FaktoringMode.Positive ? positiveObject.referencjaKG : negativeObject.referencjaKG;

            // get the valid correction amount
            let correctionAmount: number;

            // for validation purpase
            const lookUpPositiveAmount: number = positiveAmount;
            const lookUpNegativeAmount: number = -negativeAmount;
            const lookUpPositiveReference: string = positiveObject.referencjaKG;
            const lookUpNegativeReference: string = negativeObject.referencjaKG;

            if (positiveAmount > negativeAmount) {
                // negative is the valid correction amount - remove one entry and subtract from the positive total
                correctionAmount = negativeAmount;
                positiveAmount -= negativeAmount;

                negativeObject = negatives.shift()!;
                negativeAmount = negativeObject?.kwotaWWalucie ?? NaN;

                leftoversFlag = LeftoversFlag.Positive;
            } else if (positiveAmount < negativeAmount) {
                // positive is the valid correction amount - remove one entry and subtract from the negative total
                correctionAmount = positiveAmount;
                negativeAmount -= positiveAmount;

                positiveObject = positives.shift()!;
                positiveAmount = positiveObject?.kwotaWWalucie ?? NaN;

                leftoversFlag = LeftoversFlag.Negative;
            } else {
                // both types are the valid correction amounts - remove one entry from both and set new totals
                correctionAmount = positiveAmount;

                positiveObject = positives.shift()!;
                positiveAmount = positiveObject?.kwotaWWalucie ?? NaN;

                negativeObject = negatives.shift()!;
                negativeAmount = negativeObject?.kwotaWWalucie ?? NaN;

                leftoversFlag = LeftoversFlag.NoneLeft;
            }
            const rateDifference = negativeExchangeRate - positiveExchangeRate;
            const currencyCorrection = correctionAmount * rateDifference;

            const details = {
                positiveAmount: lookUpPositiveAmount,
                negativeAmount: lookUpNegativeAmount,
                positiveReference: lookUpPositiveReference,
                negativeReference: lookUpNegativeReference,
                positiveRate: positiveExchangeRate,
                negativeRate: negativeExchangeRate,
                rateDifference,
            };
            allCurrencyCorrections.push({
                referencjaKG,
                currencyCorrection,
                details,
            });
        }

        // determine which type of objects to return
        if (leftoversFlag == LeftoversFlag.Negative) {
            // make all negative entries negative again
            negatives = negatives.map(v => ({
                ...v,
                kwotaWWalucie: -v.kwotaWWalucie,
                kwotaWZl: -v.kwotaWZl,
            }));

            const negativeExchangeRate = negativeObject.kwotaWZl / negativeObject.kwotaWWalucie;
            negatives = this._retrieveUnusedElement(
                -negativeAmount,
                negatives,
                negativeExchangeRate,
                negativeObject.referencjaKG,
                negativeObject.naDzien
            );

            return [allCurrencyCorrections, negatives];
        }
        if (leftoversFlag == LeftoversFlag.Positive) {
            const positiveExchangeRate = positiveObject.kwotaWZl / positiveObject.kwotaWWalucie;
            positives = this._retrieveUnusedElement(
                positiveAmount,
                positives,
                positiveExchangeRate,
                positiveObject.referencjaKG,
                positiveObject.naDzien
            );

            return [allCurrencyCorrections, positives];
        }
        return [allCurrencyCorrections, []];
    }

    private _retrieveUnusedElement(
        currencyAmount: number,
        leftoverArray: FaktoringObject[],
        exchangeRate: number,
        referencjaKG: string,
        naDzien: string
    ) {
        // TODO: dodać możliwość oddawania nie wykorzystanych plusów
        const kwotaWZl = exchangeRate * currencyAmount;

        leftoverArray.unshift({
            referencjaKG,
            naDzien,
            kwotaWWalucie: currencyAmount,
            kwotaWZl: kwotaWZl,
            korekta: false,
        });
        return leftoverArray;
    }
}
