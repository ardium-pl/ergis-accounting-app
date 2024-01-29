import OpenAI from 'openai';
import fs from 'fs';
import { PdfReader } from "pdfreader";

const PHRASES = ['European LDPE', 'European polypropylene'];

export default async (req, res) => {
    const pdfFile = req.files[0];

    const pdfBuffer = fs.readFileSync(pdfFile.path);

    const polymerScanRawData = await new Promise((resolve, reject) => {
        const results = [];
        let currentPageText = '';
        let previousPageText = '';
        const remainingPhrases = new Set(PHRASES);

        new PdfReader(null).parseBuffer(pdfBuffer, (err, item) => {
            if (err) {
                reject(err);
            } else if (!item) {
                // End of buffer
                resolve(results);
            } else if (item.page) {
                // Handle page processing as in the original method
                remainingPhrases.forEach(phrase => {
                    const indexInPrevPage = previousPageText.indexOf(phrase);
                    if (indexInPrevPage !== -1) {
                        const trimmedPrevPageText = previousPageText.substring(indexInPrevPage);
                        results.push({
                            searchedPhrase: phrase,
                            textContent: trimmedPrevPageText + '\n\n--- Next Page ---\n\n' + currentPageText,
                        });
                        remainingPhrases.delete(phrase);
                    }
                });

                previousPageText = currentPageText;
                currentPageText = '';
            } else if (item.text) {
                currentPageText += item.text + ' ';
            }
        });
    });

    if (!polymerScanRawData || polymerScanRawData.length < 2) {
        return res.status(400).send({ success: false, error: 'NO_DATA_ERR' });
    }

    const polymerScan = `LDPE report: \n${polymerScanRawData[0].textContent}\n Polypropylene report: \n${polymerScanRawData[1].textContent}`;

    try {
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
            timeout: 180 * 1000, // 3min
        });

        const messages = [{
            role: 'user',
            content: `Please act and respond as an analyst. Please take a look at the report below and summarize the information
             about the European LDPE market and the European polypropylene market.Please format your answer in Polish. Report: ${polymerScan}`
        }];

        const startDate = new Date();

        const chatCompletion = await openai.chat.completions.create({
            model: 'gpt-4-0125-preview',
            messages: messages,
            temperature: 0.2
        });

        console.info(`Polymerscan OpenAI request successful. Completed it ${Date.now() - startDate.valueOf()}ms`)

        if (chatCompletion && chatCompletion.choices && chatCompletion.choices.length > 0) {
            const responseMessages = chatCompletion.choices[0].message;

            const formattedResponse = responseMessages.content;

            res.status(200).json({ success: true, response: formattedResponse });
        } else {
            res.status(204).send({ success: false, error: 'NO_AI_RESPONSE' });
        }
    } catch (error) {
        console.error('Error occurred:', error.message);
        console.error('Stack Trace:', error.stack);

        res.status(500).send({ success: false, error: 'INTERNAL_ERR' });
    }
};