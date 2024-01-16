import { Injectable } from '@angular/core';
import { MergerObject, TakAlboNie } from '../merger/merger.types';

@Injectable({
    providedIn: 'root',
})
export class FaktoringService {
    async processFaktoringData(rawData: string) {
        if (!rawData) return null;
        const smallerStrings = rawData.split('\n');
        const formatedArray = smallerStrings.map(line => convertDataToJSON(line));

        await new Promise(res => {
            setTimeout(() => {
                res(null);
            }, Math.random()*10_000+5_000);
        })

        return formatedArray;
    }
}

function convertDataToJSON(data: string): MergerObject {
    // Splitting the string into an array of phrases by spaces. Like this:
    //|JL231004000027|1|264|26403|0000|jza|23/10/03|23/10/04|eur|108,315.58|
    //|499,237.34|499,237.34|0.00|Nie|JL|JL231004000027|23j20097|faktoring|
    const parts = data.split(/\s+/);

    const referencjaKG = parts[0];
    const naDzien = parts[6];
    const kwotaWWalucie = Number(parts[9]?.replace(',', '') ?? 0);
    const kwotaWZł = Number(parts[10]?.replace(',', '') ?? 0);
    const korekta = parts[13]?.toLowerCase() as TakAlboNie;

    const jsonObject = {
        referencjaKG,
        naDzien,
        kwotaWWalucie,
        kwotaWZł,
        korekta,
    };
    return jsonObject;
}
