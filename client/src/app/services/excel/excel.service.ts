import { Injectable } from '@angular/core';

export type CsvObject<T extends string> = Partial<{ [key in T]: string }>;

@Injectable({
  providedIn: 'root',
})
export class ExcelService {
  readAsCsv<T extends string>(csvData: string): CsvObject<T>[] {
    const lines = this._getLines(csvData);
    const separator = this._detectSeparator(lines);

    const headers = lines[0].trim().split(separator) as T[];
    const result: CsvObject<T>[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim().split(separator);
      const obj: CsvObject<T> = {};

      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = line[j] || '';
      }

      result.push(obj);
    }

    return result;
  }
  readHeaderAsCsv(csvData: string): string[] {
    const newlineIndex = csvData.indexOf('\n');
    csvData = csvData.slice(0, newlineIndex).trim();
    const lines = this._getLines(csvData);
    const separator = this._detectSeparator(lines);
    return lines[0].trim().split(separator);
  }
  private _getLines(csvData: string): string[] {
    const lines =
      csvData.indexOf('\r\n') != -1
        ? csvData
            .trim()
            .split(/\r\n/)
            .filter(v => v)
        : csvData
            .trim()
            .split(/\n/)
            .filter(v => v);
    if (lines.length === 0) {
      throw 'EMPTY_CSV_ERR';
    }
    return lines;
  }

  private readonly _POSSIBLE_SEPARATORS = [',', ';', '\t']; // most common separators
  private _detectSeparator(lines: string[]): string {
    // check each separator
    for (const separator of this._POSSIBLE_SEPARATORS) {
      // count the occurences of the separator in each line
      const counts = lines.map(line => line.match(new RegExp(separator, 'g'))?.length);
      // check if the number of occurences is the same in every line
      // and if it is, we have found the separator
      if (counts.every(count => count && count === counts[0])) {
        return separator;
      }
    }

    throw 'SEPARATOR_ERR';
  }

  jsonToCsv(jsonData: Record<string, any>[]): string {
    if (!Array.isArray(jsonData) || jsonData.length === 0) {
      return '';
    }
    const headers = Object.keys(jsonData[0]);
    const csvData = [];
    csvData.push(headers.join(';'));
    csvData.push(
      ...jsonData.map(row =>
        headers
          .map(fieldName => {
            return JSON.stringify(row[fieldName], (_, value) => {
              if (typeof value === 'string') return value.replace(/"/g, '');
              if (typeof value === 'number') return value.toFixed(2);
              return value;
            });
          })
          .join(';')
          .replace(/"/g, '')
      )
    );

    return csvData.join('\r\n');
  }
}
