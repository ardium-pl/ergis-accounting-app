import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class GenerateExcelService {

  constructor() { }

  private headersMapz = [
    'Lp', 'Referencja', 'Paczka', 'Typ', 'Numer VAT', 'Dostawca', 'Kw opodatk', 'VAT', 
    '%VAT', 'Kwota VAT', 'Faktura', 'Data fak', 'Data pod', 'Na dzień', 'Data wpływu',
    'Kod PZ', 'Data dostawy', 'Ilość PZ', 'Ilość Faktura'
  ];

  private headersWnpz = [
    'Lp', 'Referencja', 'Paczka', 'Typ', 'Numer VAT', 'Dostawca', 'Kw opodatk', 'VAT', 
    '%VAT', 'Kwota VAT', 'Faktura', 'Data fak', 'Data pod', 'Na dzień', 'Data wpływu',
    'Kod PZ', 'Data dostawy', 'Ilość PZ', 'Ilość Faktura'
  ];

  private headersPzn = [
    'Lp', 'Zlecenie', 'Numer dostawcy', 'Nazwa dostawcy', 'Numer spec', 'Opcja ERS',
    'Data wys', 'Data przyjęcia', 'Dok dost', 'Wyl koszt KG', 'Zewn podatek ZZ', 'Odch KG-ZZ/Partia dostawcy'
  ];

  private headersRejz = [
    'Lp', 'Referencja', 'Paczka', 'Numer VAT', 'Dostawca', 'Kwota opodatkowania',
    'VAT', '%VAT', 'Kwota VAT', 'Faktura', 'Data faktury'
  ];

  public generateExcel(data: { rejz: any[], pzn: any[], wnpz: any[], mapz: any[] }): void {
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    Object.entries(data).forEach(([sheetName, records]) => {
        const cleanedRecords = this.cleanData(records);
        const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([]);

        if (sheetName === 'mapz') {
            XLSX.utils.sheet_add_aoa(ws, [this.headersMapz], {origin: 'A1'});
        } else if (sheetName === 'wnpz') {
            XLSX.utils.sheet_add_aoa(ws, [this.headersWnpz], {origin: 'A1'});
        } else if (sheetName === 'pzn') {
            XLSX.utils.sheet_add_aoa(ws, [this.headersPzn], {origin: 'A1'});
        } else if (sheetName === 'rejz') {
            XLSX.utils.sheet_add_aoa(ws, [this.headersRejz], {origin: 'A1'});
        }

        XLSX.utils.sheet_add_json(ws, cleanedRecords, {skipHeader: true, origin: 'A2'});

        const colWidths = this.calculateColumnWidths(cleanedRecords);
        ws['!cols'] = colWidths.map(width => ({ wch: width }));

        XLSX.utils.book_append_sheet(wb, ws, sheetName);
    });

    const wbout: ArrayBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    this.saveExcelFile(wbout, 'jpk_data.xlsx');
  }

  private cleanData(records: any[]): any[] {
    return records.map(record => {
        Object.keys(record).forEach(key => {
            if (key === 'Wyl koszt KG' && isNaN(record[key])) {
                record[key] = 0;
            }
        });
        return record;
    });
  }

  private calculateColumnWidths(records: any[]): number[] {
    return records.map(record => record.toString().length);
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
