import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { wnpzObject, pznObject, mapzObject, readyVerifRecord } from '../jpk/jpk.types';

// deklaracje typów do przeniesienia do pliku types
type CellValue = string | number | { f: string };
type ErrorCheckRow = CellValue[];
type HeadersType = {
  mapz: string[];
  wnpz: string[];
  pzn: string[];
  rejz: string[];
  weryfikacjaVat: string[];
};

@Injectable({
  providedIn: 'root'
})
export class GenerateExcelService {

  constructor() { }

  // nagłówki poszczególnych arkuszy w excellu
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
    ],
    weryfikacjaVat: [
      'NIP i numer', 'Lp', 'Numer faktury', 'Kontrahent', 'NIP', 'Numer wewnętrzny', 'Numer referencyjny', 
      'Rejestr', 'Waluta', 'Typ faktury', 'Opis (dekretacja)', 'Status płatności', 'Data płatności', 
      'Termin płatności', 'Data płatności ze skontem', 'Wartość skonta', 'Skonto', 'Kompensaty', 
      'Przedpłaty', 'Numer faktury korygowanej', 'Opis', 'Numer własny', 'ZalacznikiTest'
    ]
  };

  // z wyparsowanych danych w jpk.service po naciśniciu generuj tworzy plik excell
  public generateExcel(data: { rejz: any[], pzn: pznObject[], wnpz: wnpzObject[], mapz: mapzObject[], vatVerification: readyVerifRecord[] }): void {
    if (!data) {
      console.error('Data is undefined or null');
      return;
    }

    // utworzenie skoroszytu
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    // iteruje po parach nazwa,dane tworząc arkusze i uzupełniając je recordami
    Object.entries(data).forEach(([sheetName, records]) => {
      if (!records || !this.headers[sheetName as keyof HeadersType]) {
        console.error(`Records or headers for sheet ${sheetName} are undefined`);
        return;
      }

      // const cleanedRecords = this.cleanData(records);
      const recordsWithCheckAmount = this.addCheckAmount(records, sheetName);
      const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([]);

      XLSX.utils.sheet_add_aoa(ws, [this.headers[sheetName as keyof HeadersType]], { origin: 'A1' });
      XLSX.utils.sheet_add_json(ws, recordsWithCheckAmount, { skipHeader: true, origin: 'A2' });

      ws['!cols'] = this.calculateColumnWidths(recordsWithCheckAmount);

      XLSX.utils.book_append_sheet(wb, ws, sheetName);
    });

    // Stworzenie arkusza ErrorCheck
    const errorCheckSheet = this.createErrorCheckSheet(data);
    XLSX.utils.book_append_sheet(wb, errorCheckSheet, 'ErrorCheck');

    // Dodanie arkusza weryfikacjaVat
    const vatVerificationData = data.vatVerification;
    if (vatVerificationData && vatVerificationData.length > 0) {
      const vatVerificationSheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([]);
      XLSX.utils.sheet_add_aoa(vatVerificationSheet, [this.headers.weryfikacjaVat], { origin: 'A1' });
      XLSX.utils.sheet_add_json(vatVerificationSheet, vatVerificationData, { skipHeader: true, origin: 'A2' });
      vatVerificationSheet['!cols'] = this.calculateColumnWidths(vatVerificationData);
      XLSX.utils.book_append_sheet(wb, vatVerificationSheet, 'weryfikacjaVat');
    } else {
      console.warn('No VAT verification data available');
    }

    // zapis pliku excell
    const wbout: ArrayBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    this.saveExcelFile(wbout, 'jpk_data.xlsx');
  }

  // Do poprawy
  // warunek przed wywołaniem metody
  private addCheckAmount(records: any[], sheetName: string): any[] {
    if (sheetName === 'mapz' || sheetName === 'wnpz') {
      return records.map((record, index) => {
        record['check ilość'] = { f: `S${index + 2}=R${index + 2}` };
        return record;
      });
    }
    return records;
  }

  private calculateColumnWidths(records: any[]): { wch: number }[] {
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

  private createErrorCheckSheet(data: { rejz: any[], pzn: pznObject[], wnpz: wnpzObject[], mapz: mapzObject[] }): XLSX.WorkSheet {
    const transactionCodes = new Set<string>();
    data.pzn.forEach(record => transactionCodes.add(record.specNum.split('/')[0]));
    data.wnpz.forEach(record => transactionCodes.add(record.code.split('/')[0]));
    data.mapz.forEach(record => transactionCodes.add(record.code.split('/')[0]));
  
    const errorCheckData: ErrorCheckRow[] = [
      [
        'Unikalne Kody Transakcji',
        'Suma dok dost (PZN)',
        'Suma PZAmount (WNPZ)',
        'Suma PZAmount (MAPZ)',
        'Dostawy niefakturowane',
        'MAPZ-PZN',
        'MAPZ-niefakturowane',
        'WNPZ-PZN',
        'WNPZ-niefakturowane',
        'Tabela 11',
        'Tabela 12',
        'Tabela 13'
      ]
    ];
  
    Array.from(transactionCodes).forEach(code => {
      const rowIndex = errorCheckData.length + 1;  // Because headers take up the first 4 rows
      const pznSum = data.pzn.filter(record => record.specNum.split('/')[0] === code).reduce((sum, record) => sum + record.dokDost, 0);
      const wnpzSum = data.wnpz.filter(record => record.code.split('/')[0] === code).reduce((sum, record) => sum + record.PZAmount, 0);
      const mapzSum = data.mapz.filter(record => record.code.split('/')[0] === code).reduce((sum, record) => sum + record.PZAmount, 0);
  
      errorCheckData.push([
        code,
        pznSum,
        wnpzSum,
        mapzSum,
        { f: `IF(B${rowIndex}=0,0,B${rowIndex}-C${rowIndex}-D${rowIndex})` },
        { f: `IF(B${rowIndex}=0,"Brak dostawy",D${rowIndex}-B${rowIndex})` },
        { f: `D${rowIndex}-E${rowIndex}` },
        { f: `IF(B${rowIndex}=0,"Brak dostawy",C${rowIndex}-B${rowIndex})` },
        { f: `C${rowIndex}-E${rowIndex}` },
        { f: `IF(D${rowIndex}=0,"Nie ma MAPZ",IF(F${rowIndex}<0,"dostawy niefakturowane",IF(F${rowIndex}=0,0,IF(G${rowIndex}=0,"dostawa z poprzedniego m-ca","różnica w ilości sprawdź"))))` },
        { f: `IF(C${rowIndex}=0,"Nie ma WNPZ",IF(H${rowIndex}<0,"dostawy niefakturowane",IF(H${rowIndex}=0,0,IF(I${rowIndex}=0,"dostawa z poprzedniego m-ca","brak dostawy sprawdź"))))` },
        { f: `B${rowIndex}-D${rowIndex}-C${rowIndex}` }
      ]);
    });
  
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(errorCheckData);
    ws['!cols'] = Array(errorCheckData[0].length).fill({ wch: 20 }); // Ustawienie szerokości kolumn
  
    return ws;
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
