import { inject, Injectable, signal } from '@angular/core';
import * as XLSX from 'xlsx-js-style';
import { wnpzReadyRecord, pznReadyRecord, mapzReadyRecord, csvReadyRecord } from '../jpk/jpk.types';
import { ExcelStylesService } from './excel-styles.service';
import { FileSystemService } from '@ardium-ui/devkit';

// deklaracje typów do przeniesienia do pliku types
type CellValue = string | number | { f: string };
type ErrorCheckRow = CellValue[];
type HeadersType = {
  MAPZ: string[];
  WNPZ: string[];
  PZN: string[];
  RejZ: string[];
  WeryfikacjaVAT: string[];
  DaneJpkZakupy: string[];
};

@Injectable({
  providedIn: 'root'
})
export class GenerateExcelService {
  private readonly excelStylesService = inject(ExcelStylesService);
  private readonly fileSystemService = inject(FileSystemService);

  constructor() { }

  // nagłówki poszczególnych arkuszy w Excelu
  private headers: HeadersType = {
    MAPZ: [
      'Lp', 'Referencja', 'Paczka', 'Typ', 'Numer VAT', 'Dostawca', 'Kw opodatk', 'VAT',
      '%VAT', 'Kwota VAT', 'Faktura', 'Data fak', 'Data pod', 'Na dzień', 'Data wpływu',
      'Kod PZ', 'Data dostawy', 'Ilość PZ', 'Ilość Faktura', 'check ilość'
    ],
    WNPZ: [
      'Lp', 'Referencja', 'Paczka', 'Typ', 'Numer VAT', 'Dostawca', 'Kw opodatk', 'VAT',
      '%VAT', 'Kwota VAT', 'Faktura', 'Data fak', 'Data pod', 'Na dzień', 'Data wpływu',
      'Kod PZ', 'Data dostawy', 'Ilość PZ', 'Ilość Faktura', 'check ilość'
    ],
    PZN: [
      'Lp', 'Zlecenie', 'Numer dostawcy', 'Nazwa dostawcy', 'Numer spec', 'Opcja ERS',
      'Data wys', 'Data przyjęcia', 'Dok dost', 'Wyl koszt KG', 'Zewn podatek ZZ', 'Odch KG-ZZ/Partia dostawcy'
    ],
    RejZ: [
      'Lp', 'Referencja', 'Paczka', 'Numer VAT', 'Dostawca', 'Kwota opodatkowania',
      'VAT', '%VAT', 'Kwota VAT', 'Faktura', 'Data faktury'
    ],
    WeryfikacjaVAT: [
      'NIP i numer', 'Lp', 'Numer faktury', 'Kontrahent', 'NIP', 'Numer wewnętrzny', 'Numer referencyjny',
      'Rejestr', 'Waluta', 'Typ faktury', 'Opis (dekretacja)', 'Status płatności', 'Data płatności',
      'Termin płatności', 'Data płatności ze skontem', 'Wartość skonta', 'Skonto', 'Kompensaty',
      'Przedpłaty', 'Numer faktury korygowanej', 'Opis', 'Numer własny', 'ZalacznikiTest'
    ],
    DaneJpkZakupy: [
      'Lp Zakupu', 'Kod Kraju Nadania TIN4', 'Nazwa Dostawcy', 'Numer Dostawcy',
      'Dowod Zakupu', 'Data Zakupu', 'Data Wplywu', 'K40', 'K41',
      'K42', 'K43', 'K44', 'K45', 'K46', 'K47', 'Dokument Zakupu', 'NIP i Numer',
      'Numer Wewnętrzny', 'Ref', 'Rejestr', 'Netto w wal', 'Waluta', 'kurs', 'Typ faktury', 'Opis dekretacja',
      'Status platnosci', 'Data platnosci', 'Termin platnosci', 'Data platnosci ze skontem', 'Wartosc skonta', 'Skonto', 'Kompensaty', 'Przedplaty',
      'Ma ilosc', 'roznica FA_PZ', 'WN ilosc', 'Roznica FA_PZ2', 'Komentarz'
    ],
  };

  // z wyparsowanych danych w jpk.service po naciśnięciu generuj tworzy plik Excel
  public generateExcel(data: { RejZ: any[], PZN: pznReadyRecord[], WNPZ: wnpzReadyRecord[], MAPZ: mapzReadyRecord[], WeryfikacjaVAT: csvReadyRecord[], DaneJPKZakupy: any[] }): void {
    if (!data) {
      console.error('Data is undefined or null');
      return;
    }

    // utworzenie skoroszytu
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    // Iteruje tylko po arkuszach MAPZ, WNPZ, PZN i RejZ
    ['MAPZ', 'WNPZ', 'PZN', 'RejZ'].forEach(sheetName => {
      const records = data[sheetName as keyof typeof data];
      if (!records || !this.headers[sheetName as keyof HeadersType]) {
        console.error(`Records or headers for sheet ${sheetName} are undefined`);
        return;
      }

      const recordsWithCheckAmount = this.addCheckAmount(records, sheetName);
      const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([]);

      XLSX.utils.sheet_add_aoa(ws, [this.headers[sheetName as keyof HeadersType]], { origin: 'A1' });
      this.excelStylesService.applyHeaderStyles(ws, this.headers[sheetName as keyof HeadersType].length, sheetName);
      XLSX.utils.sheet_add_json(ws, recordsWithCheckAmount, { skipHeader: true, origin: 'A2' });

      ws['!cols'] = this.excelStylesService.calculateColumnWidths(recordsWithCheckAmount);

      this.excelStylesService.applyRowStyles(ws, recordsWithCheckAmount.length, sheetName);

      const headerLength = this.headers[sheetName as keyof HeadersType].length;
      ws['!autofilter'] = { ref: `A1:${XLSX.utils.encode_col(headerLength - 1)}1` };
      this.excelStylesService.applyConditionalFormatting(ws, recordsWithCheckAmount.length, sheetName);

      XLSX.utils.book_append_sheet(wb, ws, sheetName);
    });

    // Stworzenie arkusza ErrorCheck
    const errorCheckSheet = this.createErrorCheckSheet(data);
    XLSX.utils.book_append_sheet(wb, errorCheckSheet, 'ErrorCheck');

    // Dodanie arkusza WeryfikacjaVAT
    const vatVerificationData = data.WeryfikacjaVAT;
    if (vatVerificationData && vatVerificationData.length > 0) {
      const vatVerificationSheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([]);
      XLSX.utils.sheet_add_aoa(vatVerificationSheet, [this.headers.WeryfikacjaVAT], { origin: 'A1' });
      this.excelStylesService.applyHeaderStyles(vatVerificationSheet, this.headers.WeryfikacjaVAT.length, 'WeryfikacjaVAT');
      XLSX.utils.sheet_add_json(vatVerificationSheet, vatVerificationData, { skipHeader: true, origin: 'A2' });
      vatVerificationSheet['!cols'] = this.excelStylesService.calculateColumnWidths(vatVerificationData);
      this.excelStylesService.applyRowStyles(vatVerificationSheet, vatVerificationData.length, 'WeryfikacjaVAT');
      vatVerificationSheet['!autofilter'] = { ref: `A1:${XLSX.utils.encode_col(this.headers.WeryfikacjaVAT.length - 1)}1` };
      XLSX.utils.book_append_sheet(wb, vatVerificationSheet, 'Weryfikacja VAT');
    } else {
      console.warn('No VAT verification data available');
    }

    // Dodanie arkusza DaneJpkZakupy
    const xmlData = this.addFormulasToXmlData(data.DaneJPKZakupy); // Dodanie formuł do danych XML
    if (xmlData && xmlData.length > 0) {
      const xmlSheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([]);
      XLSX.utils.sheet_add_aoa(xmlSheet, [this.headers.DaneJpkZakupy], { origin: 'A1' });
      this.excelStylesService.applyHeaderStyles(xmlSheet, this.headers.DaneJpkZakupy.length, 'DaneJpkZakupy');
      XLSX.utils.sheet_add_json(xmlSheet, xmlData, { skipHeader: true, origin: 'A2' });
      xmlSheet['!cols'] = this.excelStylesService.calculateColumnWidths(xmlData);
      this.excelStylesService.applyRowStyles(xmlSheet, xmlData.length, 'DaneJpkZakupy');
      xmlSheet['!autofilter'] = { ref: `A1:${XLSX.utils.encode_col(this.headers.DaneJpkZakupy.length - 1)}1` };
      XLSX.utils.book_append_sheet(wb, xmlSheet, 'Dane JPK zakupy');
    } else {
      console.warn('No XML data available');
    }

    // Dodanie pustego arkusza 'kursy'
    const kursySheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([]);
    XLSX.utils.book_append_sheet(wb, kursySheet, 'kursy');

    // zapis pliku Excel
    const wbout: ArrayBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    this.saveExcelFile(wbout);
  }

  private addFormulasToXmlData(xmlData: any[]): any[] {
    return xmlData.map((record, index) => {
      const rowIndex = index + 2;  // Zakładamy, że dane zaczynają się od drugiego wiersza (pierwszy wiersz to nagłówki)
      return [
        ...Object.values(record),
        { f: `CONCATENATE(IF(B${rowIndex}="",D${rowIndex},IF(B${rowIndex}="AT",RIGHT(D${rowIndex},8),IF(B${rowIndex}="CY",LEFT(D${rowIndex},8),IF(B${rowIndex}="FR",RIGHT(D${rowIndex},9),IF(B${rowIndex}="EL",RIGHT(D${rowIndex},8),IF(B${rowIndex}="ES",MID(D${rowIndex},2,7),IF(B${rowIndex}="IE",LEFT(D${rowIndex},7),IF(B${rowIndex}="NL",REPLACE(D${rowIndex},10,1,""),D${rowIndex})))))))),E${rowIndex})` },
        { f: `VLOOKUP(Q${rowIndex},'Weryfikacja VAT'!A:F,6,FALSE)` },
        { f: `VLOOKUP(Q${rowIndex},'Weryfikacja VAT'!A:G,7,FALSE)` },
        { f: `VLOOKUP(Q${rowIndex},'Weryfikacja VAT'!A:H,8,FALSE)` },
        { f: `IFERROR(( H${rowIndex} + J${rowIndex}) / W${rowIndex}, "-")` },
        { f: `VLOOKUP(Q${rowIndex},'Weryfikacja VAT'!A:I,9,FALSE)` },
        { f: `IFERROR(IF(R${rowIndex}="PLN",1,VLOOKUP(F${rowIndex}-1,kursy!E:F,2,TRUE)),"-")` },
        { f: `VLOOKUP(Q${rowIndex},'Weryfikacja VAT'!A:J,10,FALSE)` },
        { f: `VLOOKUP(Q${rowIndex},'Weryfikacja VAT'!A:K,11,FALSE)` },
        { f: `VLOOKUP(Q${rowIndex},'Weryfikacja VAT'!A:L,12,FALSE)` },
        { f: `VLOOKUP(Q${rowIndex},'Weryfikacja VAT'!A:M,13,FALSE)` },
        { f: `VLOOKUP(Q${rowIndex},'Weryfikacja VAT'!A:N,14,FALSE)` },
        { f: `VLOOKUP(Q${rowIndex},'Weryfikacja VAT'!A:O,15,FALSE)` },
        { f: `VLOOKUP(Q${rowIndex},'Weryfikacja VAT'!A:P,16,FALSE)` },
        { f: `VLOOKUP(Q${rowIndex},'Weryfikacja VAT'!A:Q,17,FALSE)` },
        { f: `VLOOKUP(Q${rowIndex},'Weryfikacja VAT'!A:R,18,FALSE)` },
        { f: `VLOOKUP(Q${rowIndex},'Weryfikacja VAT'!A:S,19,FALSE)` },
        { f: `IFERROR(VLOOKUP(R${rowIndex},MAPZ!C:T,17,FALSE),"Nie podane w MAPZ")` },
        { f: `IFERROR(VLOOKUP(R${rowIndex},MAPZ!C:T,18,FALSE),"Nie podane w MAPZ")` },
        { f: `IFERROR(VLOOKUP(R${rowIndex},WNPZ!C:T,17,FALSE),"Nie podane w WNPZ")` },
        { f: `IFERROR(VLOOKUP(R${rowIndex},WNPZ!C:T,18,FALSE),"Nie podane w WNPZ")` }
      ];
    });
  }

  private addCheckAmount(records: any[], sheetName: string): any[] {
    if (sheetName === 'MAPZ' || sheetName === 'WNPZ') {
      return records.map((record, index) => {
        record['check ilość'] = { f: `S${index + 2}=R${index + 2}` };
        return record;
      });
    }
    return records;
  }

  private createErrorCheckSheet(data: { RejZ: any[], PZN: pznReadyRecord[], WNPZ: wnpzReadyRecord[], MAPZ: mapzReadyRecord[] }): XLSX.WorkSheet {
    const transactionCodes = new Set<string>();
    data.PZN.forEach(record => transactionCodes.add(record.specNum.split('/')[0]));
    data.WNPZ.forEach(record => transactionCodes.add(record.code.split('/')[0]));
    data.MAPZ.forEach(record => transactionCodes.add(record.code.split('/')[0]));
  
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
      const rowIndex = errorCheckData.length + 1;  // Because headers take up the first row
      const pznSum = data.PZN.filter(record => record.specNum.split('/')[0] === code).reduce((sum, record) => sum + record.dokDost, 0);
      const wnpzSum = data.WNPZ.filter(record => record.code.split('/')[0] === code).reduce((sum, record) => sum + record.PZAmount, 0);
      const mapzSum = data.MAPZ.filter(record => record.code.split('/')[0] === code).reduce((sum, record) => sum + record.PZAmount, 0);
  
      const formula = { f: `IF(B${rowIndex}=0,IF(C${rowIndex}=0,D${rowIndex},0),B${rowIndex}-C${rowIndex}-D${rowIndex})` };
  
      const errorCheckRow: ErrorCheckRow = [
        code,
        pznSum,
        wnpzSum,
        mapzSum,
        formula,
        { f: `IF(B${rowIndex}=0,"Brak dostawy",D${rowIndex}-B${rowIndex})` },
        { f: `D${rowIndex}-E${rowIndex}` },
        { f: `IF(B${rowIndex}=0,"Brak dostawy",C${rowIndex}-B${rowIndex})` },
        { f: `C${rowIndex}-E${rowIndex}` },
        { f: `IF(D${rowIndex}=0,"Nie ma MAPZ",IF(F${rowIndex}<0,"dostawy niefakturowane",IF(F${rowIndex}=0,0,IF(G${rowIndex}=0,"dostawa z poprzedniego m-ca","różnica w ilości sprawdź"))))` },
        { f: `IF(C${rowIndex}=0,"Nie ma WNPZ",IF(H${rowIndex}<0,"dostawy niefakturowane",IF(H${rowIndex}=0,0,IF(I${rowIndex}=0,"dostawa z poprzedniego m-ca","brak dostawy sprawdź"))))` },
        { f: `B${rowIndex}-D${rowIndex}-C${rowIndex}` }
      ];
  
      errorCheckData.push(errorCheckRow);
    });
  
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(errorCheckData);
    this.excelStylesService.applyHeaderStyles(ws, errorCheckData[0].length, 'ErrorCheck');
    ws['!cols'] = Array(errorCheckData[0].length).fill({ wch: 20 }); // Ustawienie szerokości kolumn
    this.excelStylesService.applyRowStyles(ws, errorCheckData.length, 'ErrorCheck');
    ws['!autofilter'] = { ref: `A1:${XLSX.utils.encode_col(errorCheckData[0].length - 1)}1` };
  
    this.excelStylesService.applyConditionalFormatting(ws, errorCheckData.length, 'ErrorCheck');
  
    return ws;
  }
  
  private saveExcelFile(buffer: ArrayBuffer): void {
    const data: Blob = new Blob([buffer], { type: 'application/octet-stream' });
    this.fileSystemService.saveAs(data, {
      fileName: 'Sprawdzenie JPK',
      types: [{ description: 'Plik Excel', accept: { 'application/xlsx': ['.xlsx'] } }],
    });
  }

}
