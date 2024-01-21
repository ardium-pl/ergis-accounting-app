import { MergerObject, TakAlboNie } from '../merger/merger.types';

type MergerObjectArray = {
    positives: Array<MergerObject>;
    negatives: Array<MergerObject>;
    corrections: Array<MergerObject>;
};

export class FaktoringService {
    async processFaktoringData(rawData: string): Promise<MergerObjectArray | null> {
        if (!rawData) return null;

        const positivesArray: MergerObject[] = [];
        const negativesArray: MergerObject[] = [];
        const correctionsArray: MergerObject[] = [];

        const lines = rawData.split('\n');

        for (let i = 0; i < lines.length; i++) {
            const jsonObject = convertDataToJSON(lines[i]);

            if (jsonObject.korekta == 'Tak') {
                correctionsArray.push(jsonObject);
                continue;
            }
            if (jsonObject.kwotaWZł > 0) {
                negativesArray.push(jsonObject);
                continue;
            }
            if (jsonObject.kwotaWZł < 0) {
                positivesArray.push(jsonObject);
                continue;
            }
            console.error(`Invalid data type of "kwotaWZł" at index ${i}: expected type 'number', got "${jsonObject.kwotaWZł}" (type "${typeof jsonObject.kwotaWZł}")`);
        }

        return {
            positives: positivesArray,
            negatives: negativesArray,
            corrections: correctionsArray,
        };
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
    // make the first letter uppercase + make all other letters lowercase
    const korekta = (parts[13].charAt(0).toUpperCase() + parts[13].slice(1).toLowerCase()) as TakAlboNie;

    const jsonObject = {
        referencjaKG,
        naDzien,
        kwotaWWalucie,
        kwotaWZł,
        korekta,
    };
    return jsonObject;
}
