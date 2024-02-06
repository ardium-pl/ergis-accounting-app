import OpenAI from 'openai';
import fs from 'fs';
import { PdfReader } from "pdfreader";

const PHRASES = ['European LDPE', 'European polypropylene','Platts European and Turkish PVC'];

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

    const messagePrefix = `As a business analyst with 10 years of experience based on the attached document 
    make a note up to 400 words regarding changes in`;

    // Prompts
    const messageLDPE = `${messagePrefix} LDPE. In the note, divide the answer
    into regions: Europe, North America, Asia, Rest of the World. The recipients of the
    summary will be salespeople. In the note, provide the values for raw materials if they
    appear in the attached document. Values may be given in $/MT. LDPE report: \n${polymerScanRawData[0].textContent}\n`;

    const messagePP = `${messagePrefix} PP. In the note, divide the answer
    into regions: Europe, North America, Asia, Rest of the World. The recipients of the
    summary will be salespeople. In the note, provide the values for raw materials if they
    appear in the attached document. Values may be given in $/MT. PP report: \n${polymerScanRawData[1].textContent}\n`;

    const messagePVC = `${messagePrefix} PVC. In the note, divide the answer
    into regions: Europe, North America, Asia, Rest of the World. The recipients of the
    summary will be salespeople. In the note, provide the values for raw materials if they
    appear in the attached document. Values may be given in $/MT. PVC report: \n${polymerScanRawData[2].textContent}\n`;

    try {
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
            timeout: 180 * 1000, // 3min
        });

        const promises = [messageLDPE, messagePP, messagePVC].map(message => 
            openai.chat.completions.create({
                model: 'gpt-4-0125-preview',
                messages: [{ role: 'user', content: message }],
                temperature: 0.2
            })
        );

        const startDate = new Date();

        const results = await Promise.all(promises);

        console.info(`Polymerscan OpenAI requests successful. Completed in ${Date.now() - startDate.valueOf()}ms`);

        const combinedResponseText = results.reduce((acc, result) => {
            if (result && result.choices && result.choices.length > 0) {
                return acc + result.choices[0].message.content + "\n\n"; 
            } else {
                return acc + 'NO_AI_RESPONSE\n\n';
            }
        }, '');

        res.status(200).json({ success: true, response: combinedResponseText });
    } catch (error) {
        console.error('Error occurred:', error.message);
        console.error('Stack Trace:', error.stack);

        res.status(500).send({ success: false, error: 'INTERNAL_ERR' });
    }
};