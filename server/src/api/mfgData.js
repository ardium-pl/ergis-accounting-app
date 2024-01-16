import fs from "fs";
import axios from "axios";
import path from "path";

export default async (req, res) => {
    const { mfgRawData } = req.body;

    if (!mfgRawData) {
        return res.status(400).send("Missing mfgRawData");
    }

    try {
        const smallerStrings = mfgRawData.split('\n');
        
        var formatedArray = [];
        smallerStrings.forEach((line) =>
            formatedArray.push(convertDataToJSON(line)));
        
        var formatedArray = smallerStrings.map(line => convertDataToJSON(line));

        res.status(201).json(JSON.stringify(formatedArray));
    } catch (error) {
        console.error('Error', error.message);
        res.status(500).send("Internal Server Error. Contact administrator at mikolaj.wolny@euvic.com");
    }
};

function convertDataToJSON(dataString) {
    // Splitting the string into an array of phrases by spaces. Like this:
    //|JL231004000027|1|264|26403|0000|jza|23/10/03|23/10/04|eur|108,315.58|
    //|499,237.34|499,237.34|0.00|Nie|JL|JL231004000027|23j20097|faktoring|
    const parts = dataString.split(/\s+/);

    const referencjaKG = parts[0];
    const naDzien = parts[6];
    const kwotaWWalucie = parts[9];
    const kwotaWZł = parts[10];
    const korekta = parts[13];

    const jsonObject = {
        referencjaKG,
        naDzien,
        kwotaWWalucie,
        kwotaWZł,
        korekta
    };
    return jsonObject;
}
