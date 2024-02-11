import { Injectable } from '@angular/core';
import { Workbook, Worksheet, Row, Cell } from 'exceljs';

type ExcelCellContent = string | number | boolean | null;

interface ExcelRowData {
    [header: string]: ExcelCellContent;
}

@Injectable({
    providedIn: 'root',
})
export class FileProcessingService {
    async readXlsx(
        file: File,
        worksheetName: string,
        headerRowIndex: number = 7,
        dataStartRowIndex: number = 8
    ): Promise<ExcelRowData[]> {
        try {
            const reader = new FileReader();
            const workbook = new Workbook();
            reader.readAsArrayBuffer(file);
            return await new Promise<ExcelRowData[]>((resolve, reject) => {
                reader.onload = async (e: any) => {
                    const buffer = e.target.result;
                    await workbook.xlsx.load(buffer);

                    const worksheet = workbook.getWorksheet(0);
                    if (!worksheet) {
                        throw new Error(`Worksheet named "${worksheetName}" not found in the Excel file.`);
                    }

                    const columnHeaders = this.extractHeadersFromRow(worksheet, headerRowIndex);
                    const data = this.extractDataRowsFromWorksheet(worksheet, columnHeaders, dataStartRowIndex);
                    resolve(data);
                };
                reader.onerror = error => reject(error);
            });
        } catch (error) {
            console.error('Error reading Excel file:', error);
            throw error; // or handle the error as needed
        }
    }

    private extractHeadersFromRow(worksheet: Worksheet, headerRowIndex: number): string[] {
        const headers: string[] = [];
        const headerRow = worksheet.getRow(headerRowIndex);
        headerRow.eachCell((cell: Cell, index: number) => {
            headers[index - 1] = cell.text.trim();
        });
        return headers;
    }

    private getCellTextValue(cell: Cell): ExcelCellContent {
        const cellValue = cell.text;
        return typeof cellValue === 'string' ? cellValue : 'null';
    }

    private isRowDataNotEmpty(rowData: ExcelRowData): boolean {
        return Object.values(rowData).some(value => value !== null);
    }

    private extractDataRowsFromWorksheet(worksheet: Worksheet, columnHeaders: string[], startingRow: number): ExcelRowData[] {
        const dataRows: ExcelRowData[] = [];

        worksheet.eachRow({ includeEmpty: false }, (row: Row, rowIndex: number) => {
            if (rowIndex >= startingRow) {
                const rowData = this.buildRowData(row, columnHeaders);
                if (this.isRowDataNotEmpty(rowData)) {
                    dataRows.push(rowData);
                }
            }
        });
        return dataRows;
    }

    private buildRowData(row: Row, columnHeaders: string[]): ExcelRowData {
        const rowData: ExcelRowData = {};

        row.eachCell({ includeEmpty: true }, (cell: Cell, columnIndex: number) => {
            const header = columnHeaders[columnIndex - 1];
            rowData[header] = this.getCellTextValue(cell);
        });
        return rowData;
    }
}
