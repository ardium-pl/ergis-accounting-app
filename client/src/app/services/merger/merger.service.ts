import { Injectable, computed, signal } from '@angular/core';
import { FinalMergerObject, MergerObject, FaktoringMode, LeftoversFlag } from './merger.types';

@Injectable({
    providedIn: 'root',
})
export class MergerService {
    private readonly _negativesData = signal<string>('');
    private readonly _negativesDataJson = computed<MergerObject[]>(() => {
        try {
            const json = JSON.parse(this._negativesData());
            return json;
        } catch (err) {
            return [];
        }
    });

    readonly negativesData = computed(() => this._negativesData());
    readonly isNegativeDataValid = computed(() => this._negativesDataJson()?.length > 0);

    setNegativesData(data: string): void {
        this._negativesData.set(data);
    }

    public processData(addedPositives: MergerObject[], addedNegatives: MergerObject[], faktoringMode: FaktoringMode) {
        if (!addedPositives) return null;
        try {
            const pastEntries = JSON.parse(this.negativesData()) ?? ([] as MergerObject[]);

            if (pastEntries[0].kwotaWWalucie < 0) {
                return this._processData([...pastEntries, ...addedNegatives], addedPositives, faktoringMode);
            }
            return this._processData(addedNegatives, [...pastEntries, ...addedPositives], faktoringMode);
        } catch (err) {
            return null;
        }
    }

    private _processData(
        positives: MergerObject[],
        negatives: MergerObject[],
        faktoringMode: FaktoringMode
    ): [FinalMergerObject[], MergerObject[]] {
        if (negatives.length == 0) return [[], []];
        // make negative entries positive for easier logic
        negatives = negatives.map(v => ({
            ...v,
            kwotaWWalucie: -v.kwotaWWalucie,
            kwotaWZł: -v.kwotaWZł,
        }));

        let positiveObject = positives.shift()!;
        let negativeObject = negatives.shift()!;

        let positiveAmount = positiveObject?.kwotaWWalucie;
        let negativeAmount = negativeObject.kwotaWWalucie;

        if (positives.length == 0) {
            const negativeExchangeRate = negativeObject.kwotaWZł / negativeObject.kwotaWWalucie;
            negatives = this._retrieveUnusedElement(
                negativeAmount,
                negatives,
                negativeExchangeRate,
                negativeObject.referencjaKG,
                negativeObject.naDzien
            );
            return [[], negatives];
        }

        const allCurrencyCorrections: FinalMergerObject[] = [];
        let leftoversFlag: LeftoversFlag = LeftoversFlag.NoneLeft;

        while ((positives.length > 0 || !isNaN(positiveAmount)) && negatives.length > 0) {
            const negativeExchangeRate = negativeObject.kwotaWZł / negativeObject.kwotaWWalucie;
            const positiveExchangeRate = positiveObject.kwotaWZł / positiveObject.kwotaWWalucie;

            // get the valid correction amount
            let correctionAmount: number;
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
            const currencyCorrection = correctionAmount * (negativeExchangeRate - positiveExchangeRate);

            allCurrencyCorrections.push({
                referencjaKG: faktoringMode == FaktoringMode.Positive ? positiveObject.referencjaKG : negativeObject.referencjaKG,
                currencyCorrection,
            });
        }

        // determine which type of objects to return
        if (leftoversFlag == LeftoversFlag.Negative) {
            // make all negative entries negative again
            negatives = negatives.map(v => ({
                ...v,
                kwotaWWalucie: -v.kwotaWWalucie,
                kwotaWZł: -v.kwotaWZł,
            }));

            const negativeExchangeRate = negativeObject.kwotaWZł / negativeObject.kwotaWWalucie;
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
            const positiveExchangeRate = positiveObject.kwotaWZł / positiveObject.kwotaWWalucie;
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
        leftoverArray: MergerObject[],
        exchangeRate: number,
        referencjaKG: string,
        date: string
    ) {
        // TODO: dodać możliwość oddawania nie wykorzystanych plusów
        const kwotaWZł = exchangeRate * currencyAmount;

        leftoverArray.unshift({
            referencjaKG: referencjaKG,
            naDzien: date,
            kwotaWWalucie: currencyAmount,
            kwotaWZł,
            korekta: 'Nie',
        });
        return leftoverArray;
    }
}
