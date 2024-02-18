import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class CsvParserService {
    constructor() {}
    /**
     * Parses a CSV string into an array of objects.
     *
     * Each object represents a row in the CSV, with keys derived from the first row (headers).
     *
     * @param csvData The CSV string to parse.
     * @returns An array of objects with the CSV data, or undefined if the header row is missing.
     */
    parseCsv(csvData: string): Record<string, string>[] | undefined {
        const rows = csvData.split('\n').filter(row => row.trim());

        const headersRow = rows.shift();

        if (!headersRow) {
            console.warn('CSV data is missing a header row.');
            return undefined;
        }

        const headers = headersRow.split(';');

        const dataObjects: Record<string, string>[] = rows.map(row => {
            const values = row.split(';');
            let rowData: Record<string, string> = {};
            headers.forEach((header, index) => {
                //Remove any leading/trailing whitespace.
                rowData[header.trim()] = values[index]?.trim() ?? '';
            });
            return rowData;
        });

        return dataObjects;
    }
}
