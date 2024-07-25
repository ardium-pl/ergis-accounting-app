import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx-js-style';
import { wnpzReadyRecord, pznReadyRecord, mapzReadyRecord, csvReadyRecord } from '../jpk/jpk.types';

// deklaracje typów do przeniesienia do pliku types
type CellValue = string | number | { f: string };
type ErrorCheckRow = CellValue[];
type HeadersType = {
  mapz: string[];
  wnpz: string[];
  pzn: string[];
  rejz: string[];
  weryfikacjaVat: string[];
  daneJpkZakupy: string[];
};

@Injectable({
  providedIn: 'root'
})
export class GenerateExcelService {

  constructor() { }

  // nagłówki poszczególnych arkuszy w Excelu
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
    ],
    daneJpkZakupy: [
      'Lp Zakupu', 'Kod Kraju Nadania TIN4', 'Nazwa Dostawcy', 'Numer Dostawcy',
      'Dowod Zakupu', 'Data Zakupu', 'Data Wplywu', 'K40', 'K41',
      'K42', 'K43', 'K44', 'K45', 'K46', 'K47', 'Dokument Zakupu', 'NIP i Numer',
      'Numer Wewnętrzny', 'Ref', 'Rejestr', 'Netto w wal', 'Waluta', 'kurs', 'Typ faktury', 'Opis dekretacja',
      'Status platnosci', 'Data platnosci', 'Termin platnosci', 'Data platnosci ze skontem', 'Wartosc skonta', 'Skonto', 'Kompensaty', 'Przedplaty',
      'Ma ilosc', 'roznica FA_PZ', 'WN ilosc', 'Roznica FA_PZ2', 'Komentarz'
    ],
  };

  // z wyparsowanych danych w jpk.service po naciśnięciu generuj tworzy plik Excel
  public generateExcel(data: { rejz: any[], pzn: pznReadyRecord[], wnpz: wnpzReadyRecord[], mapz: mapzReadyRecord[], vatVerification: csvReadyRecord[], xml: any[] }): void {
    if (!data) {
      console.error('Data is undefined or null');
      return;
    }

    // utworzenie skoroszytu
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    // iteruje po parach nazwa, dane tworząc arkusze i uzupełniając je recordami
    Object.entries(data).forEach(([sheetName, records]) => {
      if (!records || !this.headers[sheetName as keyof HeadersType]) {
        console.error(`Records or headers for sheet ${sheetName} are undefined`);
        return;
      }

      const recordsWithCheckAmount = this.addCheckAmount(records, sheetName);
      const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([]);

      XLSX.utils.sheet_add_aoa(ws, [this.headers[sheetName as keyof HeadersType]], { origin: 'A1' });
      this.applyHeaderStyles(ws, this.headers[sheetName as keyof HeadersType].length);
      XLSX.utils.sheet_add_json(ws, recordsWithCheckAmount, { skipHeader: true, origin: 'A2' });

      ws['!cols'] = this.calculateColumnWidths(recordsWithCheckAmount);

      this.applyRowStyles(ws, recordsWithCheckAmount.length);

      const headerLength = this.headers[sheetName as keyof HeadersType].length;
      ws['!autofilter'] = { ref: `A1:${XLSX.utils.encode_col(headerLength - 1)}1` };
      this.applyConditionalFormatting(ws, recordsWithCheckAmount.length, sheetName);

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
      this.applyHeaderStyles(vatVerificationSheet, this.headers.weryfikacjaVat.length);
      XLSX.utils.sheet_add_json(vatVerificationSheet, vatVerificationData, { skipHeader: true, origin: 'A2' });
      vatVerificationSheet['!cols'] = this.calculateColumnWidths(vatVerificationData);
      this.applyRowStyles(vatVerificationSheet, vatVerificationData.length);
      vatVerificationSheet['!autofilter'] = { ref: `A1:${XLSX.utils.encode_col(this.headers.weryfikacjaVat.length - 1)}1` };
      XLSX.utils.book_append_sheet(wb, vatVerificationSheet, 'weryfikacjaVat');
    } else {
      console.warn('No VAT verification data available');
    }

    // Dodanie arkusza dane jpk zakupy
    const xmlData = this.addFormulasToXmlData(data.xml); // Dodanie formuł do danych XML
    console.log(xmlData);
    if (xmlData && xmlData.length > 0) {
      const xmlSheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([]);
      XLSX.utils.sheet_add_aoa(xmlSheet, [this.headers.daneJpkZakupy], { origin: 'A1' });
      this.applyHeaderStyles(xmlSheet, this.headers.daneJpkZakupy.length);
      XLSX.utils.sheet_add_json(xmlSheet, xmlData, { skipHeader: true, origin: 'A2' });
      xmlSheet['!cols'] = this.calculateColumnWidths(xmlData);
      this.applyRowStyles(xmlSheet, xmlData.length);
      // Apply auto filter
      xmlSheet['!autofilter'] = { ref: `A1:${XLSX.utils.encode_col(this.headers.daneJpkZakupy.length - 1)}1` };
      XLSX.utils.book_append_sheet(wb, xmlSheet, 'dane jpk zakupy');
    } else {
      console.warn('No XML data available');
    }

    // Dodanie pustego arkusza 'kursy'
    const kursySheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([]);
    XLSX.utils.book_append_sheet(wb, kursySheet, 'kursy');

    // zapis pliku Excel
    const wbout: ArrayBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    this.saveExcelFile(wbout, 'jpk_data.xlsx');
  }

  private addFormulasToXmlData(xmlData: any[]): any[] {
    return xmlData.map((record, index) => {
      const rowIndex = index + 2;  // Zakładamy, że dane zaczynają się od drugiego wiersza (pierwszy wiersz to nagłówki)
      return [
        ...Object.values(record),
        '',
        { f: `CONCATENATE(IF(B${rowIndex}="",D${rowIndex},IF(B${rowIndex}="AT",RIGHT(D${rowIndex},8),IF(B${rowIndex}="CY",LEFT(D${rowIndex},8),IF(B${rowIndex}="FR",RIGHT(D${rowIndex},9),IF(B${rowIndex}="EL",RIGHT(D${rowIndex},8),IF(B${rowIndex}="ES",MID(D${rowIndex},2,7),IF(B${rowIndex}="IE",LEFT(D${rowIndex},7),IF(B${rowIndex}="NL",REPLACE(D${rowIndex},10,1,""),D${rowIndex})))))))),E${rowIndex})` },
        { f: `VLOOKUP(Q${rowIndex},WeryfikacjaVAT!A:F,6,FALSE)` },
        { f: `VLOOKUP(Q${rowIndex},WeryfikacjaVAT!A:G,7,FALSE)` },
        { f: `VLOOKUP(Q${rowIndex},WeryfikacjaVAT!A:H,8,FALSE)` },
        { f: `IFERROR(( H${rowIndex} + J${rowIndex}) / W${rowIndex}, "-")` },
        { f: `VLOOKUP(Q${rowIndex},WeryfikacjaVAT!A:I,9,FALSE)` },
        { f: `IFERROR(IF(R${rowIndex}="PLN",1,VLOOKUP(F${rowIndex}-1,kursy!E:F,2,TRUE)),"-")` },
        { f: `VLOOKUP(Q${rowIndex},WeryfikacjaVAT!A:J,10,FALSE)` },
        { f: `VLOOKUP(Q${rowIndex},WeryfikacjaVAT!A:K,11,FALSE)` },
        { f: `VLOOKUP(Q${rowIndex},WeryfikacjaVAT!A:L,12,FALSE)` },
        { f: `VLOOKUP(Q${rowIndex},WeryfikacjaVAT!A:M,13,FALSE)` },
        { f: `VLOOKUP(Q${rowIndex},WeryfikacjaVAT!A:N,14,FALSE)` },
        { f: `VLOOKUP(Q${rowIndex},WeryfikacjaVAT!A:O,15,FALSE)` },
        { f: `VLOOKUP(Q${rowIndex},WeryfikacjaVAT!A:P,16,FALSE)` },
        { f: `VLOOKUP(Q${rowIndex},WeryfikacjaVAT!A:Q,17,FALSE)` },
        { f: `VLOOKUP(Q${rowIndex},WeryfikacjaVAT!A:R,18,FALSE)` },
        { f: `VLOOKUP(Q${rowIndex},WeryfikacjaVAT!A:S,19,FALSE)` },
        { f: `IFERROR(VLOOKUP(R${rowIndex},MAPZ!C:T,17,FALSE),"Nie podane w MAPZ")` },
        { f: `IFERROR(VLOOKUP(R${rowIndex},MAPZ!C:T,18,FALSE),"Nie podane w MAPZ")` },
        { f: `IFERROR(VLOOKUP(R${rowIndex},WNPZ!C:T,17,FALSE),"Nie podane w WNPZ")` },
        { f: `IFERROR(VLOOKUP(R${rowIndex},WNPZ!C:T,18,FALSE),"Nie podane w WNPZ")` }
      ];
    });
  }

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

  private createErrorCheckSheet(data: { rejz: any[], pzn: pznReadyRecord[], wnpz: wnpzReadyRecord[], mapz: mapzReadyRecord[] }): XLSX.WorkSheet {
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
      const rowIndex = errorCheckData.length + 1;  // Because headers take up the first row
      const pznSum = data.pzn.filter(record => record.specNum.split('/')[0] === code).reduce((sum, record) => sum + record.dokDost, 0);
      const wnpzSum = data.wnpz.filter(record => record.code.split('/')[0] === code).reduce((sum, record) => sum + record.PZAmount, 0);
      const mapzSum = data.mapz.filter(record => record.code.split('/')[0] === code).reduce((sum, record) => sum + record.PZAmount, 0);
  
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
    this.applyHeaderStyles(ws, errorCheckData[0].length);
    ws['!cols'] = Array(errorCheckData[0].length).fill({ wch: 20 }); // Ustawienie szerokości kolumn
    this.applyRowStyles(ws, errorCheckData.length);
    ws['!autofilter'] = { ref: `A1:${XLSX.utils.encode_col(errorCheckData[0].length - 1)}1` };
  
    this.applyConditionalFormatting(ws, errorCheckData.length, 'ErrorCheck');
  
    return ws;
  }
  
  private applyConditionalFormatting(ws: XLSX.WorkSheet, numRows: number, sheetName: string): void {
    const lightRedColor = 'FFFFCCCC';
    const borderStyle = 'thin';
    const borderColor = 'FFCCA3A3';
  
    const applyCellStyle = (cell: XLSX.CellObject, fillColor: string) => {
      cell.s = {
        fill: {
          patternType: 'solid',
          fgColor: { rgb: fillColor }
        },
        border: {
          top: { style: borderStyle, color: { rgb: borderColor } },
          bottom: { style: borderStyle, color: { rgb: borderColor } },
          left: { style: borderStyle, color: { rgb: borderColor } },
          right: { style: borderStyle, color: { rgb: borderColor } }
        }
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
  
      if (sheetName === 'mapz' || sheetName === 'wnpz') {
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

  private saveExcelFile(buffer: ArrayBuffer, filename: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/octet-stream' });
    const url: string = window.URL.createObjectURL(data);
    const link: HTMLAnchorElement = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  private applyRowStyles(worksheet: XLSX.WorkSheet, numRows: number): void {
    const columnCount = worksheet['!cols']?.length || 0;  //liczba kolumn w danym arkuszu
    const borderColor = 'FFCCD7EE';
    const borderStyle = 'thin';
    const lightBlueColor = 'FFD9E1F2';

    for (let row = 1; row <= numRows; row++) {
      const rowColor = row % 2 === 0 ? lightBlueColor : 'FFFFFFFF'; // Alternate row color

      for (let col = 0; col < columnCount; col++) {
        const cellAddress = XLSX.utils.encode_cell({ c: col, r: row });
        if (!worksheet[cellAddress]) continue;

        worksheet[cellAddress].s = {
          fill: {
            patternType: "solid",
            fgColor: { rgb: rowColor }
          },
          border: {
            top: { style: borderStyle, color: { rgb: borderColor } },
            bottom: { style: borderStyle, color: { rgb: borderColor } },
            left: { style: borderStyle, color: { rgb: borderColor } },
            right: { style: borderStyle, color: { rgb: borderColor } }
          }
        };
      }
    }
  }

  private applyHeaderStyles(worksheet: XLSX.WorkSheet, columnCount: number): void {
    const headerColor = 'FF4472C4';
    const fontColor = 'FFFFFFFF';
    const borderColor = 'FFCCD7EE';
    const borderStyle = 'thin';


    for (let col = 0; col < columnCount; col++) {
      const cellAddress = XLSX.utils.encode_cell({ c: col, r: 0 });
      if (!worksheet[cellAddress]) continue;

      worksheet[cellAddress].s = {
        fill: {
          patternType: "solid",
          fgColor: { rgb: headerColor }
        },
        font: {
          color: { rgb: fontColor },
          bold: true
        },
        border: {
          top: { style: borderStyle, color: { rgb: borderColor } },
          bottom: { style: borderStyle, color: { rgb: borderColor } },
          left: { style: borderStyle, color: { rgb: borderColor } },
          right: { style: borderStyle, color: { rgb: borderColor } }
        }
      };
    }
  }
}

