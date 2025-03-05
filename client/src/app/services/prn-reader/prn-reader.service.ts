import { Injectable } from '@angular/core';
import { PrnObject } from './prn-reader.types';

@Injectable({
    providedIn: 'root',
})
export class PrnReaderService {
    constructor() {}

    readPrn(data: string): PrnObject[] {
        const lines = this._filterOnlyDataRows(data);
        const noHeaders = this._filterOutHeadersAndReverse(lines);
        return this._linesToPrnObjects(noHeaders);
    }

    readPrnHeaders(data: string): string[] {
        const lines = this._filterOnlyDataRows(data);
        lines.reverse();
        const headersLine = lines.pop()!;
        const widths = this._getWidths(lines);
        return this._splitSingleLine(headersLine, widths);
    }

    private _filterOnlyDataRows(data: string): string[] {
        const lines = data.split('\n');
        const filtered = lines
            .filter((l) => /^  [a-z0-9./-]/i.test(l))
            .map((v) => v.trimStart());
        return filtered;
    }

    private _filterOutHeadersAndReverse(lines: string[]): string[] {
        let wasLastLineHeaderDivider = false;
        return [...lines].reverse().filter((line, i) => {
            if (i >= lines.length - 1 - 2) return true;
            if (/^-+/.test(line)) {
                wasLastLineHeaderDivider = true;
                return false;
            }
            if (wasLastLineHeaderDivider) {
                wasLastLineHeaderDivider = false;
                return false;
            }
            return true;
        });
    }

    private _getWidths(lines: string[]): number[] {
        return lines
            .pop()!
            .split(/\s/)
            .map(v => v.length);
    }

    private _linesToPrnObjects(lines: string[]): PrnObject[] {
        const headersLine = lines.pop()!;
        const widths = this._getWidths(lines);
        const headers = this._splitSingleLine(headersLine, widths).map((v) =>
            this._mapHeaderName(v)
        );

        const unreversedLines = [...lines].reverse();

        const splitLines = unreversedLines.map((line) =>
            this._splitSingleLine(line, widths)
        );

        const objects = splitLines.map((line) => {
            const resultObject: PrnObject = {};

            for (let i = 0; i < line.length; i++) {
                let header = headers[i];
                while (header in resultObject) header = header + '_2';
                
                // Swap dots and commas in the data before assigning it
                const data = this._swapDotAndComma(line[i]);
                resultObject[header] = data;
            }
            return resultObject;
        });

        return objects;
    }

    private _splitSingleLine(line: string, widths: number[]): string[] {
        const items: string[] = [];

        let cumulativeWidth = 0;
        for (const width of widths) {
            let item = line.substring(cumulativeWidth, cumulativeWidth + width).trim();
            item = this._swapDotAndComma(item); // Swap dots and commas
            items.push(item);
            cumulativeWidth += width + 1;
        }

        return items;
    }

    private _mapHeaderName(name: string): string {
        return name
            .split(' ')
            .map((v) => v.charAt(0).toUpperCase() + v.slice(1))
            .join('')
            .replace(/[^a-ząćęłńóśżź_]/gi, '');
    }

    private _swapDotAndComma(value: string): string {
        return value.replace(/[.,]/g, (match) => (match === '.' ? ',' : '.'));
    }
}
