import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class GenerateExcelService {

  constructor() { }

  // Metoda publiczna do generowania pliku Excel
  public generateExcel(data: { rejz: any[], pzn: any[], wnpz: any[], mapz: any[] }): void {
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    Object.entries(data).forEach(([sheetName, records]) => {
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(records);
      const colWidths = this.calculateColumnWidths(records);
      ws['!cols'] = colWidths.map(width => ({ wch: width }));
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
    });

    const wbout: ArrayBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    this.saveExcelFile(wbout, 'jpk_data.xlsx');
  }

  // Prywatna metoda do zapisywania pliku Excel
  private saveExcelFile(buffer: ArrayBuffer, filename: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/octet-stream' });
    const url: string = window.URL.createObjectURL(data);
    const link: HTMLAnchorElement = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  // Prywatna metoda do obliczania szerokości kolumn na podstawie danych
  private calculateColumnWidths(records: any[]): number[] {
    let maxColWidths: number[] = [];

    records.forEach(record => {
      Object.keys(record).forEach((key, index) => {
        let contentLength = record[key] ? record[key].toString().length + 2 : 2;
        maxColWidths[index] = Math.max(maxColWidths[index] || 0, contentLength);
      });
    });

    return maxColWidths;
  }
}
