const express = require("express");
const fs = require("fs");
const axios = require("axios");
const path = require("path");
const router = express.Router();

router.post("/send-mfg-data-for-faktoring", async (req, res) => {
    const mfgRawData = req.body.mfgRawData;

    if (!mfgRawData) {
        return res.status(400).send("Missing mfgRawData");
    }

    try {
        const filePath = path.join(__dirname, 'faktoring_system_message.txt'); 
        const systemMessage = fs.readFileSync(filePath, 'utf8');

        const apiKey = process.env.OPEN_AI_KEY; 
        const url = 'https://api.openai.com/v1/chat/completions';

        const response = await axios.post(url, {
            model: 'gpt-4-1106-preview',
            messages: [
                { role: 'system', content: systemMessage },
                { role: 'user', content: mfgRawData }
            ],
            response_format: { type: 'json_object' }
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            timeout: 180000
        });

        const assistantResponse = response.data.choices[0].message.content;
        res.status(201).json({ assistantResponse });
    } catch (error) {
        if (error.response) {
            console.error(error.response.data);
            res.status(500).send("Error with OpenAI response");
        } else if (error.request) {
            console.error(error.request);
            res.status(500).send("No response from OpenAI");
        } else {
            console.error('Error', error.message);
            res.status(500).send("Internal Server Error");
        }
    }
});

module.exports = router;
