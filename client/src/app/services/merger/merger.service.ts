import { Injectable, computed, signal } from '@angular/core';
import { FinalMergerObject, MergerObject, FaktoringMode } from './merger.types';

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
            const pastEntries = JSON.parse(this.negativesData()) ?? [] as MergerObject[];

            let negatives:MergerObject[] = [];
            let positives:MergerObject[] = [];

            if(pastEntries[0].kwotaWWalucie < 0){
                negatives = [...pastEntries, ...(addedNegatives ?? [])];
                positives = addedPositives;

            }
            else if(pastEntries[0].kwotaWWalucie > 0){
                negatives = addedNegatives;
                positives  = [...pastEntries, ...(addedPositives ?? [])];
            }

            return this._processData(addedPositives ?? [], negatives, faktoringMode);
        } catch (err) {
            return null;
        }
    }

    private _processData(positives: MergerObject[], negatives: MergerObject[], faktoringMode: FaktoringMode): [FinalMergerObject[], MergerObject[]] {
        if (negatives.length == 0) return [[], []];
        negatives = negatives.map(v => ({
            ...v,
            kwotaWWalucie: -v.kwotaWWalucie,
            kwotaWZł: -v.kwotaWZł,
        }));

        let positiveObject: MergerObject = positives.shift()!;
        let negativeObject: MergerObject = negatives.shift()!;

        let positiveAmount: number = positiveObject?.kwotaWWalucie;
        let negativeAmount: number = negativeObject.kwotaWWalucie;

        if (positives.length == 0) {
            const negativeExchangeRate = negativeObject.kwotaWZł / negativeObject.kwotaWWalucie;
            negatives = this._retrieveUnusedElement(negativeAmount, negatives, negativeExchangeRate,negativeObject.referencjaKG,negativeObject.naDzien);
            return [[], negatives];
        }

        const allCurrencyCorrections: FinalMergerObject[] = [];
        let leftOversFlag:string = "nothingLeft";


        while ((positives.length > 0 || !isNaN(positiveAmount)) && negatives.length > 0) {
            const negativeExchangeRate = negativeObject.kwotaWZł / negativeObject.kwotaWWalucie;
            const positiveExchangeRate = positiveObject.kwotaWZł / positiveObject.kwotaWWalucie;

            
            let referencjaKG;
            if(faktoringMode == "positiveAsBase"){
                referencjaKG = positiveObject.referencjaKG; 
            }
            else if(faktoringMode == "negativeAsBase"){
                referencjaKG = negativeObject.referencjaKG; 
            }
            else break;

            let correctionAmount: number;
            if (positiveAmount > negativeAmount) {
                correctionAmount = negativeAmount;
                positiveAmount -= negativeAmount;

                negativeObject = negatives.shift()!;
                negativeAmount = negativeObject?.kwotaWWalucie ?? NaN;

                leftOversFlag = "positive";
            }
            else if (positiveAmount < negativeAmount) {
                correctionAmount = positiveAmount;
                negativeAmount -= positiveAmount;

                positiveObject = positives.shift()!;
                positiveAmount = positiveObject?.kwotaWWalucie ?? NaN;

                leftOversFlag = "negative";
            }
            else if (positiveAmount == negativeAmount){
                correctionAmount = positiveAmount;

                positiveObject = positives.shift()!;
                positiveAmount = positiveObject?.kwotaWWalucie ?? NaN;

                negativeObject = negatives.shift()!;
                negativeAmount = negativeObject?.kwotaWWalucie ?? NaN;

                leftOversFlag = "nothingLeft";
            }
            const currencyCorrection = correctionAmount! * (negativeExchangeRate - positiveExchangeRate);

            allCurrencyCorrections.push({
                referencjaKG,
                currencyCorrection,
            });
        }

        if(leftOversFlag == "negative"){

            negatives = negatives.map(v => ({
                ...v,
                kwotaWWalucie: -v.kwotaWWalucie,
                kwotaWZł: -v.kwotaWZł,
            }));
    
            const negativeExchangeRate = negativeObject.kwotaWZł / negativeObject.kwotaWWalucie;
            negatives = this._retrieveUnusedElement(-negativeAmount, negatives, negativeExchangeRate,negativeObject.referencjaKG,negativeObject.naDzien);
    
            return [allCurrencyCorrections, negatives];
        }
        else if(leftOversFlag == "positive"){
            const positiveExchangeRate = positiveObject.kwotaWZł / positiveObject.kwotaWWalucie;
            positives = this._retrieveUnusedElement(positiveAmount, positives, positiveExchangeRate, positiveObject.referencjaKG, positiveObject.naDzien);

            return [allCurrencyCorrections, positives];
            
        }
        else{
            return [allCurrencyCorrections, []];

        };
    }

    private _retrieveUnusedElement(currencyAmount: number, leftoverArray: MergerObject[], exchangeRate: number, referencjaKG: string, date: string) { // TODO: dodać możliwość oddawania nie wykorzystanych plusów
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
