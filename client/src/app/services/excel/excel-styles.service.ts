import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx-js-style';
import { isDate } from 'simple-bool';

const LIGHT_RED_BORDER_COLOR = 'FFCCA3A3' as const;
const BLUE_BORDER_COLOR = 'FFCCD7EE' as const;
const WHITE_COLOR = 'FFFFFFFF' as const;
const BORDER_STYLE = 'thin' as const;
const LIGHT_RED_COLOR = 'FFFFCCCC' as const;

const SHEET_COLORS: { [key: string]: { headerColor: string; rowColor: string; alternateRowColor: string } } = {
  MAPZ: { headerColor: 'FF4472C4', rowColor: WHITE_COLOR, alternateRowColor: 'FFD9E1F2' }, // Regular blue 
  WNPZ: { headerColor: 'FF29B6F6', rowColor: WHITE_COLOR, alternateRowColor: 'FFE1F5FE' }, // Light blue 
  PZN: { headerColor: 'FFEC407A', rowColor: WHITE_COLOR, alternateRowColor: 'FFFCE4EC' }, // Pink 
  RejZ: { headerColor: 'FF92D050', rowColor: WHITE_COLOR, alternateRowColor: 'FFE2EFDA' }, // Light green
  WeryfikacjaVAT: { headerColor: 'FF00B050', rowColor: WHITE_COLOR, alternateRowColor: 'FFD9EAD3' }, // Green
  DaneJpkZakupy: { headerColor: 'FFFFC000', rowColor: WHITE_COLOR, alternateRowColor: 'FFFFF2CC' }, // Yellow
  ErrorCheck: { headerColor: 'FF9E9E9E', rowColor: WHITE_COLOR, alternateRowColor: 'FFEEEEEE' }, // Gray
} as const;

@Injectable({
  providedIn: 'root',
})
export class ExcelStylesService {

  public applyConditionalFormatting(ws: XLSX.WorkSheet, numRows: number, sheetName: string): void {
    const applyCellStyle = (cell: XLSX.CellObject, fillColor: string) => {
      cell.s = {
        fill: {
          patternType: 'solid',
          fgColor: { rgb: fillColor },
        },
        border: {
          top: { style: BORDER_STYLE, color: { rgb: LIGHT_RED_BORDER_COLOR } },
          bottom: { style: BORDER_STYLE, color: { rgb: LIGHT_RED_BORDER_COLOR } },
          left: { style: BORDER_STYLE, color: { rgb: LIGHT_RED_BORDER_COLOR } },
          right: { style: BORDER_STYLE, color: { rgb: LIGHT_RED_BORDER_COLOR } },
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
          applyCellStyle(cellT, LIGHT_RED_COLOR);
        }
      }

      if (sheetName === 'ErrorCheck') {
        if (cellB && cellE && cellB.v === 0) {
          applyCellStyle(cellE, LIGHT_RED_COLOR);
        }
      }
    }
  }

  public applyRowStyles(worksheet: XLSX.WorkSheet, numRows: number, sheetName: string): void {
    const columnCount = worksheet['!cols']?.length || 0; //number of columns in a given sheet
    const colors = SHEET_COLORS[sheetName] || WHITE_COLOR;
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
            top: { style: BORDER_STYLE, color: { rgb: BLUE_BORDER_COLOR } },
            bottom: { style: BORDER_STYLE, color: { rgb: BLUE_BORDER_COLOR } },
            left: { style: BORDER_STYLE, color: { rgb: BLUE_BORDER_COLOR } },
            right: { style: BORDER_STYLE, color: { rgb: BLUE_BORDER_COLOR } },
          },
        };
      }
    }
  }

  public applyHeaderStyles(worksheet: XLSX.WorkSheet, columnCount: number, sheetName: string): void {
    const colors = SHEET_COLORS[sheetName] || WHITE_COLOR;
    const headerColor = colors.headerColor;
    const fontColor = WHITE_COLOR;

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
          top: { style: BORDER_STYLE, color: { rgb: BLUE_BORDER_COLOR } },
          bottom: { style: BORDER_STYLE, color: { rgb: BLUE_BORDER_COLOR } },
          left: { style: BORDER_STYLE, color: { rgb: BLUE_BORDER_COLOR } },
          right: { style: BORDER_STYLE, color: { rgb: BLUE_BORDER_COLOR } },
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
        if (isDate(value)) {
          valueLength = 10; // 
        }
        maxWidths[index] = Math.max(maxWidths[index] || 0, valueLength);
      });
    });

    return maxWidths.map(width => ({ wch: width + 2 }));
  }
}
