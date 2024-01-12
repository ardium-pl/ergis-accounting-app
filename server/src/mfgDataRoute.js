const express = require("express");
const router = express.Router();

router.post("/send-mfg-data-for-faktoring", async (req, res) => {
    const mfgRawData = req.body.mfgRawData;

    if (!mfgRawData) {
        return res.status(400).send("Missing mfgRawData");
    }

    try {
        let formatedArray = [];

        const smallerStrings = mfgRawData.split('\n');
        smallerStrings.forEach((line) => 
        formatedArray.push(convertDataToJSON(line)));

        res.status(201).json(JSON.stringify(formatedArray));
    } catch (error) {
            console.error('Error', error.message);
            res.status(500).send("Internal Server Error. Contact administrator at mikolaj.wolny@euvic.com");
        }
    }    
);

function convertDataToJSON(dataString) {
    // Splitting the string into an array of phrases by spaces. Like this:
    //|JL231004000027|1|264|26403|0000|jza|23/10/03|23/10/04|eur|108,315.58|
    //|499,237.34|499,237.34|0.00|Nie|JL|JL231004000027|23j20097|faktoring|
    const parts = dataString.split(/\s+/);
    
    const referencjaKGIndex = 0;
    const naDzienIndex = 6;
    const kwotaWWalucieIndex = 9;
    const kwotaWZłIndex = 10;
    const korektaIndex = 13;


    const referencjaKG = parts[referencjaKGIndex];
    const naDzien = parts[naDzienIndex];
    const kwotaWWalucie = parts[kwotaWWalucieIndex];
    const kwotaWZł = parts[kwotaWZłIndex];
    const korekta = parts[korektaIndex];

    const jsonObject = {
        referencjaKG,
        naDzien,
        kwotaWWalucie,
        kwotaWZł,
        korekta
    };
    return jsonObject;
}

module.exports = router;
