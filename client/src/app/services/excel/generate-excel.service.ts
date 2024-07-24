import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx-js-style';  // Use xlsx-js-style instead of xlsx
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
      'ns1:LpZakupu', 'ns1:KodKrajuNadaniaTIN4', 'ns1:NrDostawcy', 'ns1:NazwaDostawcy', 
      'ns1:DowodZakupu', 'ns1:DataZakupu', 'ns1:DataWplywu', 'ns1:K_40', 'ns1:K_41', 
      'ns1:K_42', 'ns1:K_43', 'ns1:K_44', 'ns1:K_45', 'ns1:K_46', 'ns1:K_47', 'ns1:DokumentZakupu', 'ZmienionyNrDostawcy', 
      'Formuła 1', 'Formuła 2', 'Formuła 3', 'Formuła 4', 'Formuła 5', 'Formuła 6', 'Formuła 7', 'Formuła 8', 
      'Formuła 9', 'Formuła 10', 'Formuła 11', 'Formuła 12', 'Formuła 13', 'Formuła 14', 'Formuła 15', 'Formuła 16', 
      'Formuła 17', 'Formuła 18', 'Formuła 19', 'Formuła 20', 'Formuła 21', 'Formuła 22'
    ]
  };

  // z wyparsowanych danych w jpk.service po naciśnięciu generuj tworzy plik Excel
  public generateExcel(data: { rejz: any[], pzn: pznObject[], wnpz: wnpzObject[], mapz: mapzObject[], vatVerification: readyVerifRecord[], xml: any[] }): void {
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

      // Apply alternating row styles
      this.applyRowStyles(ws, recordsWithCheckAmount.length);

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
      XLSX.utils.book_append_sheet(wb, vatVerificationSheet, 'weryfikacjaVat');
    } else {
      console.warn('No VAT verification data available');
    }

    // Dodanie arkusza dane jpk zakupy
    const xmlData = this.addFormulasToXmlData(data.xml); // Dodanie formuł do danych XML
    if (xmlData && xmlData.length > 0) {
      const xmlSheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([]);
      XLSX.utils.sheet_add_aoa(xmlSheet, [this.headers.daneJpkZakupy], { origin: 'A1' });
      this.applyHeaderStyles(xmlSheet, this.headers.daneJpkZakupy.length);
      XLSX.utils.sheet_add_json(xmlSheet, xmlData, { skipHeader: true, origin: 'A2' });
      xmlSheet['!cols'] = this.calculateColumnWidths(xmlData);
      this.applyRowStyles(xmlSheet, xmlData.length);
      XLSX.utils.book_append_sheet(wb, xmlSheet, 'dane jpk zakupy');
    } else {
      console.warn('No XML data available');
    }

    // zapis pliku Excel
    const wbout: ArrayBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    this.saveExcelFile(wbout, 'jpk_data.xlsx');
  }

  private addFormulasToXmlData(xmlData: any[]): any[] {
    return xmlData.map((record, index) => {
      const rowIndex = index + 2;  // Zakładamy, że dane zaczynają się od drugiego wiersza (pierwszy wiersz to nagłówki)
      return [
        ...Object.values(record),
        { f: `IF(B${rowIndex}="",C${rowIndex},IF(B${rowIndex}="AT",RIGHT(C${rowIndex},8),IF(B${rowIndex}="CY",LEFT(C${rowIndex},8),IF(B${rowIndex}="FR",RIGHT(C${rowIndex},9),IF(B${rowIndex}="EL",RIGHT(C${rowIndex},8),IF(B${rowIndex}="ES",MID(C${rowIndex},2,7),IF(B${rowIndex}="IE",LEFT(C${rowIndex},7),IF(B${rowIndex}="NL",REPLACE(C${rowIndex},10,1,""),C${rowIndex}))))))))` },
        { f: `VLOOKUP(M${rowIndex},WeryfikacjaVAT!A:F,6,FALSE)` },
        { f: `WeryfikacjaVAT!G${rowIndex}` },
        { f: `WeryfikacjaVAT!H${rowIndex}` },
        { f: `IFERROR((J${rowIndex} + O${rowIndex}) / S${rowIndex}, "-")` },
        { f: `WeryfikacjaVAT!I${rowIndex}` },
        { f: `IFERROR(IF(R${rowIndex}="PLN",1,VLOOKUP(F${rowIndex}-1,kursy!E:F,2,TRUE)),"-")` },
        { f: `WeryfikacjaVAT!J${rowIndex}` },
        { f: `WeryfikacjaVAT!K${rowIndex}` },
        { f: `WeryfikacjaVAT!L${rowIndex}` },
        { f: `WeryfikacjaVAT!M${rowIndex}` },
        { f: `WeryfikacjaVAT!N${rowIndex}` },
        { f: `WeryfikacjaVAT!O${rowIndex}` },
        { f: `WeryfikacjaVAT!P${rowIndex}` },
        { f: `WeryfikacjaVAT!Q${rowIndex}` },
        { f: `WeryfikacjaVAT!R${rowIndex}` },
        { f: `WeryfikacjaVAT!S${rowIndex}` },
        { f: `IFERROR(VLOOKUP(N${rowIndex},MAPZ!C:T,17,FALSE),"Nie podane w MAPZ")` },
        { f: `IFERROR(VLOOKUP(N${rowIndex},MAPZ!C:T,18,FALSE),"Nie podane w MAPZ")` },
        { f: `IFERROR(VLOOKUP(N${rowIndex},WNPZ!C:T,17,FALSE),"Nie podane w WNPZ")` },
        { f: `IFERROR(VLOOKUP(N${rowIndex},WNPZ!C:T,18,FALSE),"Nie podane w WNPZ")` }
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
    this.applyHeaderStyles(ws, errorCheckData[0].length);
    ws['!cols'] = Array(errorCheckData[0].length).fill({ wch: 20 }); // Ustawienie szerokości kolumn
    this.applyRowStyles(ws, errorCheckData.length);
  
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

  private applyRowStyles(worksheet: XLSX.WorkSheet, numRows: number): void {
    const columnCount = worksheet['!cols']?.length || 0;  // Ensure columnCount is valid
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
