import { HttpClient } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { isDefined } from 'simple-bool';
import { FileStorageService } from '../file-storage/file-storage.service';
import { PolymerscanMatch } from './polymerscan.types';
import { GptResponse } from '../types';
import { PdfReader } from "pdfreader";

type _ResponseType = Record<string, unknown>;

@Injectable({
    providedIn: 'root',
})
export class PolymerscanService {
    constructor(private _fileStorage: FileStorageService, private http: HttpClient) {}

    private readonly PHRASES = ['European LDPE', 'European polypropylene'];

    private readonly _response = signal<string | null>(null);
    public readonly response = computed(() => this._response());
    public readonly jsonResponse = computed(() => {
        const rsp = this._response();
        if (!rsp) return null;
        try {
            const json = JSON.parse(rsp) as _ResponseType;
            console.log(json);
            return json;
        } catch (err) {
            alert('Wystąpił błąd w czasie próby odczytania danych pozyskanych od AI. Zgłoś ten błąd administratorom!');
            console.error('PS002: Cannot parse polymerscan API output', err);
            return null;
        }
    });

    async processPhraseExtractionFromBuffer(pdfBuffer: Buffer, phrases: string[]): Promise<PolymerscanMatch[]> {
        return new Promise((resolve, reject) => {
            let results: PolymerscanMatch[] = [];
            let currentPageText = "";
            let previousPageText = "";
            const remainingPhrases = new Set(phrases);

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
                                textContent: trimmedPrevPageText + "\n\n--- Next Page ---\n\n" + currentPageText
                            });
                            remainingPhrases.delete(phrase);
                        }
                    });

                    previousPageText = currentPageText;
                    currentPageText = "";
                } else if (item.text) {
                    currentPageText += item.text + " ";
                }
            });
        });
    }


    // TODO: build a server API call to contact chat gpt
}
