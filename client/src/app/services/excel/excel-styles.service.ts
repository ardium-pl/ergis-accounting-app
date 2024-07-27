import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx-js-style';

@Injectable({
  providedIn: 'root',
})
export class ExcelStylesService {
  constructor() {}
  // Kolory dla każdego arkusza
  private sheetColors: { [key: string]: { headerColor: string; rowColor: string; alternateRowColor: string } } = {
    MAPZ: { headerColor: 'FF4472C4', rowColor: 'FFFFFFFF', alternateRowColor: 'FFD9E1F2' },
    WNPZ: { headerColor: 'FF29B6F6', rowColor: 'FFFFFFFF', alternateRowColor: 'FFE1F5FE' },
    PZN: { headerColor: 'FFEC407A', rowColor: 'FFFFFFFF', alternateRowColor: 'FFFCE4EC' },
    RejZ: { headerColor: 'FF92D050', rowColor: 'FFFFFFFF', alternateRowColor: 'FFE2EFDA' },
    WeryfikacjaVAT: { headerColor: 'FF00B050', rowColor: 'FFFFFFFF', alternateRowColor: 'FFD9EAD3' },
    DaneJpkZakupy: { headerColor: 'FFFFC000', rowColor: 'FFFFFFFF', alternateRowColor: 'FFFFF2CC' },
    ErrorCheck: { headerColor: 'FF9E9E9E', rowColor: 'FFFFFFFF', alternateRowColor: 'FFEEEEEE' },
  };

  public applyConditionalFormatting(ws: XLSX.WorkSheet, numRows: number, sheetName: string): void {
    const lightRedColor = 'FFFFCCCC';
    const borderStyle = 'thin';
    const borderColor = 'FFCCA3A3';

    const applyCellStyle = (cell: XLSX.CellObject, fillColor: string) => {
      cell.s = {
        fill: {
          patternType: 'solid',
          fgColor: { rgb: fillColor },
        },
        border: {
          top: { style: borderStyle, color: { rgb: borderColor } },
          bottom: { style: borderStyle, color: { rgb: borderColor } },
          left: { style: borderStyle, color: { rgb: borderColor } },
          right: { style: borderStyle, color: { rgb: borderColor } },
        },
      };
    };

    for (let row = 1; row <= numRows; row++) {
      const columnBAddress = XLSX.utils.encode_cell({ c: 1, r: row }); // Column B
      const columnEAddress = XLSX.utils.encode_cell({ c: 4, r: row }); // Column E
      const columnSAddress = XLSX.utils.encode_cell({ c: 17, r: row }); // Column S
      const columnRAddress = XLSX.utils.encode_cell({ c: 18, r: row }); // Column R
      const columnTAddress = XLSX.utils.encode_cell({ c: 19, r: row }); // Column T

      const cellT = ws[columnTAddress];
      const cellB = ws[columnBAddress];
      const cellE = ws[columnEAddress];
      const cellS = ws[columnSAddress];
      const cellR = ws[columnRAddress];

      if (sheetName === 'MAPZ' || sheetName === 'WNPZ') {
        if (cellS && cellR && cellS.v !== cellR.v) {
          applyCellStyle(cellT, lightRedColor);
        }
      }

      if (sheetName === 'ErrorCheck') {
        if (cellB && cellE && cellB.v === 0) {
          applyCellStyle(cellE, lightRedColor);
        }
      }
    }
  }

  public saveExcelFile(buffer: ArrayBuffer, filename: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/octet-stream' });
    const url: string = window.URL.createObjectURL(data);
    const link: HTMLAnchorElement = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  public applyRowStyles(worksheet: XLSX.WorkSheet, numRows: number, sheetName: string): void {
    const columnCount = worksheet['!cols']?.length || 0; //liczba kolumn w danym arkuszu
    const borderColor = 'FFCCD7EE';
    const borderStyle = 'thin';
    const colors = this.sheetColors[sheetName] || this.sheetColors['default'];
    const rowColor = colors.rowColor;
    const alternateRowColor = colors.alternateRowColor;

    for (let row = 1; row <= numRows; row++) {
      const currentRowColor = row % 2 === 0 ? alternateRowColor : rowColor; // Alternate row color

      for (let col = 0; col < columnCount; col++) {
        const cellAddress = XLSX.utils.encode_cell({ c: col, r: row });
        if (!worksheet[cellAddress]) continue;

        worksheet[cellAddress].s = {
          fill: {
            patternType: 'solid',
            fgColor: { rgb: currentRowColor },
          },
          border: {
            top: { style: borderStyle, color: { rgb: borderColor } },
            bottom: { style: borderStyle, color: { rgb: borderColor } },
            left: { style: borderStyle, color: { rgb: borderColor } },
            right: { style: borderStyle, color: { rgb: borderColor } },
          },
        };
      }
    }
  }

  public applyHeaderStyles(worksheet: XLSX.WorkSheet, columnCount: number, sheetName: string): void {
    const colors = this.sheetColors[sheetName] || this.sheetColors['default'];
    const headerColor = colors.headerColor;
    const fontColor = 'FFFFFFFF';
    const borderColor = 'FFCCD7EE';
    const borderStyle = 'thin';

    for (let col = 0; col < columnCount; col++) {
      const cellAddress = XLSX.utils.encode_cell({ c: col, r: 0 });
      if (!worksheet[cellAddress]) continue;

      worksheet[cellAddress].s = {
        fill: {
          patternType: 'solid',
          fgColor: { rgb: headerColor },
        },
        font: {
          color: { rgb: fontColor },
          bold: true,
        },
        border: {
          top: { style: borderStyle, color: { rgb: borderColor } },
          bottom: { style: borderStyle, color: { rgb: borderColor } },
          left: { style: borderStyle, color: { rgb: borderColor } },
          right: { style: borderStyle, color: { rgb: borderColor } },
        },
      };
    }
  }
  public calculateColumnWidths(records: any[]): { wch: number }[] {
    if (!records || records.length === 0) return [];

    let maxWidths: number[] = [];

    records.forEach(record => {
      Object.keys(record).forEach((key, index) => {
        const value = record[key];
        let valueLength = value ? value.toString().length : 0;
        if (this.isDate(value)) {
          valueLength = 10; // Przykład stałej szerokości dla daty
        }
        maxWidths[index] = Math.max(maxWidths[index] || 0, valueLength);
      });
    });

    return maxWidths.map(width => ({ wch: width + 2 }));
  }
  private isDate(value: any): boolean {
    return !isNaN(Date.parse(value)) && !isNaN(new Date(value).getTime());
  }
}
