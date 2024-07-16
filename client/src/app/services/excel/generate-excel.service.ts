import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

type HeadersType = {
  mapz: string[];
  wnpz: string[];
  pzn: string[];
  rejz: string[];
};

@Injectable({
  providedIn: 'root'
})
export class GenerateExcelService {

  constructor() { }

  // Definicja nagłówków dla każdego arkusza jako obiekt z typem
  private headers: HeadersType = {
    mapz: [
      'Lp', 'Referencja', 'Paczka', 'Typ', 'Numer VAT', 'Dostawca', 'Kw opodatk', 'VAT', 
      '%VAT', 'Kwota VAT', 'Faktura', 'Data fak', 'Data pod', 'Na dzień', 'Data wpływu',
      'Kod PZ', 'Data dostawy', 'Ilość PZ', 'Ilość Faktura', 'check ilość'
    ],
    wnpz: [
      'Lp', 'Referencja', 'Paczka', 'Typ', 'Numer VAT', 'Dostawca', 'Kw opodatk', 'VAT', 
      '%VAT', 'Kwota VAT', 'Faktura', 'Data fak', 'Data pod', 'Na dzień', 'Data wpływu',
      'Kod PZ', 'Data dostawy', 'Ilość PZ', 'Ilość Faktura', 'check ilość'
    ],
    pzn: [
      'Lp', 'Zlecenie', 'Numer dostawcy', 'Nazwa dostawcy', 'Numer spec', 'Opcja ERS',
      'Data wys', 'Data przyjęcia', 'Dok dost', 'Wyl koszt KG', 'Zewn podatek ZZ', 'Odch KG-ZZ/Partia dostawcy'
    ],
    rejz: [
      'Lp', 'Referencja', 'Paczka', 'Numer VAT', 'Dostawca', 'Kwota opodatkowania',
      'VAT', '%VAT', 'Kwota VAT', 'Faktura', 'Data faktury'
    ]
  };

  public generateExcel(data: { rejz: any[], pzn: any[], wnpz: any[], mapz: any[] }): void {
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    Object.entries(data).forEach(([sheetName, records]) => {
      const cleanedRecords = this.cleanData(records);
      const recordsWithFormulas = this.addFormulas(cleanedRecords, sheetName);
      const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([]);

      XLSX.utils.sheet_add_aoa(ws, [this.headers[sheetName as keyof HeadersType]], {origin: 'A1'});
      XLSX.utils.sheet_add_json(ws, recordsWithFormulas, {skipHeader: true, origin: 'A2'});

      // Uaktualnienie obliczania szerokości kolumn
      ws['!cols'] = this.calculateColumnWidths(recordsWithFormulas);

      XLSX.utils.book_append_sheet(wb, ws, sheetName);
    });

    const wbout: ArrayBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    this.saveExcelFile(wbout, 'jpk_data.xlsx');
  }

  private cleanData(records: any[]): any[] {
    return records.map(record => {
      Object.keys(record).forEach(key => {
        if (key === 'Wyl koszt KG' && isNaN(record[key])) {
          record[key] = 0;  // Zamiana NaN na 0
        }
      });
      return record;
    });
  }

  private addFormulas(records: any[], sheetName: string): any[] {
    if (sheetName === 'mapz' || sheetName === 'wnpz') {
      return records.map((record, index) => {
        // Dodajemy formułę do każdego rekordu, zakładając, że kolumny R i S to odpowiednie miejsca
        record['check ilość'] = { f: `S${index + 2}=R${index + 2}` };
        return record;
      });
    }
    return records;
  }

  private calculateColumnWidths(records: any[]): { wch: number }[] {
    if (!records || records.length === 0) return [];

    // Inicjalizacja tablicy do przechowywania maksymalnej szerokości każdej kolumny
    let maxWidths: number[] = [];

    // Iteracja przez każdy rekord
    records.forEach(record => {
      Object.keys(record).forEach((key, index) => {
        const value = record[key];
        let valueLength = value ? value.toString().length : 0;
        
        // Jeśli wartość jest datą, przypiszemy stałą szerokość
        if (this.isDate(value)) {
          valueLength = 10; // Przykład stałej szerokości dla daty w formacie 'yyyy-mm-dd'
        }

        maxWidths[index] = Math.max(maxWidths[index] || 0, valueLength);
      });
    });

    // Dodanie marginesu dla każdej kolumny i konwersja na odpowiedni format
    return maxWidths.map(width => ({ wch: width + 2 })); // Dodaje margines 2 znaki
  }

  private isDate(value: any): boolean {
    return !isNaN(Date.parse(value)) && !isNaN(new Date(value).getTime());
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
