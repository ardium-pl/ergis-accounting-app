// generate-excel.service.ts
import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class GenerateExcelService {

  constructor() { }

  public generateExcel(data: { rejz: any[], pzn: any[], wnpz: any[], mapz: any[] }): void {
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    Object.entries(data).forEach(([sheetName, records]) => {
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(records);
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
    });

    const wbout: ArrayBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    this.saveExcelFile(wbout, 'jpk_data.xlsx');
  }

  private saveExcelFile(buffer: ArrayBuffer, filename: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/octet-stream' });
    const url: string = window.URL.createObjectURL(data);
    const link: HTMLAnchorElement = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
