import { Injectable } from '@angular/core';
import { PrnObject } from './prn-reader.types';

@Injectable({
    providedIn: 'root',
})
export class PrnReaderService {
    constructor() {}

    readPrn(data: string): any {
        const lines = this._filterOnlyDataRows(data);
        const noHeaders = this._filterOutHeadersAndReverse(lines);
        const objects = this._linesToPrnObjects(noHeaders);
        return objects;
    }

    private _filterOnlyDataRows(data: string): string[] {
        const lines = data.split('\n');
        const filtered = lines
            .filter((l) => /^  [a-z0-9-]/i.test(l))
            .map((v) => v.trimStart());
        return filtered;
    }
    private _filterOutHeadersAndReverse(lines: string[]): string[] {
        let wasLastLineHeaderDivider = false;
        return [...lines]
            .reverse()
            .filter((line, i) => {
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
    private _linesToPrnObjects(lines: string[]): PrnObject[] {
        const headersLine = lines.pop()!;
        const widths = lines.pop()!.split(/\s/).map(v => v.length);
        const headers = this._splitSingleLine(headersLine, widths);

        const splitLines = lines.map(line => this._splitSingleLine(line, widths));
        
        const objects = splitLines.map(line => {
            const resultObject: PrnObject = {}
            
            for (let i = 0; i < line.length; i++) {
                const header = headers[i];
                const data = line[i];
                resultObject[header] = data;
            }
            return resultObject;
        })
        
        return objects;
    }
    private _splitSingleLine(line: string, widths: number[]): string[] {
        const items: string[] = [];

        let cumulativeWidth = 0;
        for (const width of widths) {
            items.push(line.substring(cumulativeWidth, cumulativeWidth + width).trim());
            cumulativeWidth += width + 1;
        }

        return items;
    }
}
