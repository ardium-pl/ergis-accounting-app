const TakAlboNie = {
    Tak: 'Tak',
    Nie: 'Nie',
} as const;
export type TakAlboNie = (typeof TakAlboNie)[keyof typeof TakAlboNie];

type MergerObject = {
    referencjaKG: string;
    naDzien: string;
    kwotaWWalucie: number;
    kwotaWZł: number;
    korekta: TakAlboNie;
};

type MergerObjectArray = {
    positives: Array<MergerObject>;
    negatives: Array<MergerObject>;
    corrections: Array<MergerObject>;
};

export class FaktoringService {
    async processFaktoringData(rawData: string) {
        if (!rawData) return null;

        let positivesArray: MergerObject[] = [];
        let negativesArray: MergerObject[] = [];
        let correctionsArray: MergerObject[] = [];

        const smallerStrings = rawData.split('\n');

        smallerStrings.map(line => {
            let jsonObject = convertDataToJSON(line);

            if (jsonObject.korekta == 'Tak') {
                correctionsArray.push(jsonObject);
            } else {
                if (jsonObject.kwotaWZł > 0) {
                    negativesArray.push(jsonObject);
                } else if (jsonObject.kwotaWZł < 0) {
                    positivesArray.push(jsonObject);
                } else {
                    console.log('OBJECT KWOTAWZŁ: ' + jsonObject.kwotaWZł);
                    console.log('OBJECT KWOTAWZŁ TYPE : ' + typeof jsonObject.kwotaWZł);

                    console.error('Invalid data type');
                    return null;
                }
            }
        });

        let mergerObjectArray: MergerObjectArray = {
            positives: positivesArray,
            negatives: negativesArray,
            corrections: correctionsArray,
        };

        return mergerObjectArray;
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
    const korekta = parts[13] as TakAlboNie; // removed .toLower because it was't compatable with TakAlboNie type

    const jsonObject = {
        referencjaKG,
        naDzien,
        kwotaWWalucie,
        kwotaWZł,
        korekta,
    };
    return jsonObject;
}
