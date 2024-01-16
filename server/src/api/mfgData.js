

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
        //można prościej:
        var formatedArray = smallerStrings.map(line => convertDataToJSON(line));

        res.status(200).json(JSON.stringify(formatedArray));
    } catch (error) {
        console.error('Error', error.message);
        res.status(500).send("Internal Server Error. Contact administrator at mikolaj.wolny@euvic.com");
    }
};

