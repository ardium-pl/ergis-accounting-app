import { Injectable, computed, signal } from '@angular/core';
import { GptService } from '../gpt/gpt.service';
import { FinalMergerObject, MergerObject } from './merger.types';

@Injectable({
    providedIn: 'root'
})
export class MergerService {

    constructor(private gptService: GptService) { }

    private readonly _negativesData = signal<string>('');
    private readonly _negativesDataJson = computed<MergerObject[]>(() => {
        try {
            const json = JSON.parse(this._negativesData());
            return json;
        } catch (err) {
            return [];
        }
    })
    
    readonly negativesData = computed(() => this._negativesData());
    readonly isNegativeDataValid = computed(() => this._negativesDataJson()?.length > 0);

    setNegativesData(data: string): void {
        this._negativesData.set(data);
    }

    readonly processedData = computed(() => {
        try {
            const negatives = JSON.parse(this.negativesData()) as MergerObject[];
            const positives = this.gptService.jsonResponse();
            return this._processData(positives ?? [], negatives);
        } catch (err) {
            return null;
        }
    });

    private _processData(positives: MergerObject[], negatives: MergerObject[]): FinalMergerObject[] {
        if (negatives.length == 0) return [];

        let positiveObject: MergerObject = positives.shift()!;
        let negativeObject: MergerObject = negatives.shift()!;

        let positiveSilo: number = positiveObject?.kwotaWWalucie;
        let negativeSilo: number = negativeObject.kwotaWWalucie;

        let negativeExchangeRate: number = negativeObject.kwotaWZł / negativeObject.kwotaWWalucie;

        if (positives.length == 0) {
            this._retrieveUnusedNegatives(negativeSilo, negatives, negativeExchangeRate);
            return [];
        }

        const allCurrencyCorrections = [];

        while ((positives.length > 0 && negatives.length > 0) || (!isNaN(positiveSilo) && negatives.length > 0)) {
            negativeExchangeRate = negativeObject.kwotaWZł / negativeObject.kwotaWWalucie;
            const positiveExchangeRate = positiveObject.kwotaWZł / positiveObject.kwotaWWalucie;

            const correctionReference = positiveObject.referencjaKG;

            let correctionAmount: number;
            if (positiveSilo > -negativeSilo) {
                correctionAmount = -negativeSilo;
                positiveSilo += negativeSilo;

                if (negatives.length > 0) {
                    negativeObject = negatives.shift()!;
                    negativeSilo = negativeObject.kwotaWWalucie;
                }
                else negativeSilo = NaN;

            }
            else if (positiveSilo < -negativeSilo) {
                correctionAmount = positiveSilo;
                negativeSilo += positiveSilo;

                if (positives.length > 0) {
                    positiveObject = positives.shift()!;
                    positiveSilo = positiveObject.kwotaWWalucie;
                }
                else positiveSilo = NaN;

            }
            else {
                correctionAmount = positiveSilo;
                positiveObject = positives.shift()!;
                negativeObject = negatives.shift()!;
                positiveSilo = positiveObject.kwotaWWalucie;
                negativeSilo = negativeObject.kwotaWWalucie;
            }
            const currencyCorrection = correctionAmount * (negativeExchangeRate - positiveExchangeRate);

            allCurrencyCorrections.push({
                referencjaKG: correctionReference,
                currencyCorrection,
            });
        }
        this._retrieveUnusedNegatives(negativeSilo, negatives, negativeExchangeRate);
        return allCurrencyCorrections;
    }

    private _retrieveUnusedNegatives(negativeSilo: number, negativeArray: MergerObject[], negativeExchangeRate: number) {
        const kwotaWZł = negativeExchangeRate * negativeSilo;

        negativeArray.unshift({
            referencjaKG: "NieUżytyElement",
            naDzien: "NieUżytyElement",
            kwotaWWalucie: negativeSilo,
            kwotaWZł,
            korekta: "Nie"
        });
    }
}
