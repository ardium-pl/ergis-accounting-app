import { Injectable, computed, inject } from '@angular/core';
import { Tuple, sleep } from '@utils';
import { parseString, processors } from 'xml2js';
import { ExcelService } from '../excel/excel.service';
import { WeirdPrnReaderService } from '../weird-prn-reader/weird-prn-reader.service';
import { JpkFile, JpkFileState, JpkFileType } from './jpk-file';
import { csvRawRecord, csvReadyRecord, mapzRawRecord, mapzReadyRecord, pznRawRecord, pznReadyRecord, rejzRawRecord, rejzReadyRecord, wnpzRawRecord, wnpzReadyRecord, xmlRawRecord, xmlReadyRecord } from './jpk.types';
import { MAPZValidationPatterns, PZNValidationPatterns, RejZValidationPatterns, WNPZValidationPatterns } from './validation-patterns';

export const JpkFileName = {
  XML: 'Plik JPK_VAT',
  WeryfikacjaVAT: 'Weryfikacja VAT',
  RejZ: 'RejZ',
  PZN: 'PZN',
  WNPZ: 'WNPZ',
  MAPZ: 'MAPZ',
} as const;
export type JpkFileName = (typeof JpkFileName)[keyof typeof JpkFileName];

const REQUIRED_VERIFICATION_COLUMNS = [
  'Lp',
  'Numer faktury',
  'Kontrahent',
  'NIP',
  'Numer wewnętrzny',
  'Numer referencyjny',
  'Rejestr',
  'Waluta',
  'Typ faktury',
  'Opis (dekretacja)',
  'Status płatności',
  'Data płatności',
  'Termin płatności',
  'Data płatności ze skontem',
  'Wartość skonta',
  'Skonto',
  'Kompensaty',
  'Przedpłaty',
  'Numer faktury korygowanej',
  'ZalacznikiTest',
  'Opis',
  'Numer własny',
] as const;

@Injectable({
  providedIn: 'root',
})
export class JpkService {
  private readonly excelService = inject(ExcelService);
  private readonly prnReaderService = inject(WeirdPrnReaderService);

  readonly files: Tuple<JpkFile, 6> = [
    new JpkFile(JpkFileType.XML, JpkFileName.XML),
    new JpkFile(JpkFileType.CSV, JpkFileName.WeryfikacjaVAT),
    new JpkFile(JpkFileType.PRN, JpkFileName.RejZ),
    new JpkFile(JpkFileType.PRN, JpkFileName.PZN),
    new JpkFile(JpkFileType.PRN, JpkFileName.WNPZ),
    new JpkFile(JpkFileType.PRN, JpkFileName.MAPZ),
  ];

  readonly areAllFilesOK = computed(() => {
    return this.files.every(file => file.state() === JpkFileState.OK);
  });

  private _vatVerificationData: csvReadyRecord[] = [];
  private _xmlData: xmlReadyRecord[] = [];
  private _rejzData: rejzReadyRecord[] = [];
  private _pznData: pznReadyRecord[] = [];
  private _wnpzData: wnpzReadyRecord[] = [];
  private _mapzData: mapzReadyRecord[] = [];

  get xmlData(): xmlReadyRecord[] {
    return this._xmlData;
  }

  get vatVerificationData(): csvReadyRecord[] {
    return this._vatVerificationData;
  }

  get rejzData(): rejzReadyRecord[] {
    return this._rejzData;
  }

  get pznData(): pznReadyRecord[] {
    return this._pznData;
  }

  get wnpzData(): wnpzReadyRecord[] {
    return this._wnpzData;
  }

  get mapzData(): mapzReadyRecord[] {
    return this._mapzData;
  }

  async handleFilesUpload(files: File[], forcedTypes?: JpkFileName[]): Promise<File[]> {
    const promises: Promise<false | File>[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const forcedName = forcedTypes?.[i];
      promises.push(this._handleSingleFileUpload(file, forcedName));
    }
    return (await Promise.all(promises)).filter(v => v) as File[];
  }

  private async _handleSingleFileUpload(file: File, forcedName?: JpkFileName): Promise<false | File> {
    const fileContent = await file.text();
    const determinedName = forcedName ?? (await this._determineFileName(file, fileContent));

    if (!determinedName) {
      return file;
    }
    let validation: [string, string] | false;
    let fileIndex: number;

    switch (determinedName) {
      // parsowanie xml
      case JpkFileName.XML:
        validation = this._validateXmlFile(fileContent);

        if (!validation) {
          const xmlData = this.readAsXml(fileContent);
          console.log(xmlData)
          this._xmlData = this._parseXmlData(xmlData)
          console.log(this._xmlData)
        }
        fileIndex = 0;
        break;

      // parsowanie csv
      case JpkFileName.WeryfikacjaVAT:
        validation = this._validateVerificationFile(fileContent);

        if (!validation) {
          const csvRawData = this.excelService.readAsCsv<keyof csvRawRecord>(fileContent);
          const csvData = csvRawData.filter(this._isCsvRecord);
          this._vatVerificationData = this._parseVatVerificationData(csvData);
        }
        fileIndex = 1;
        break;

      case JpkFileName.RejZ:
        validation = this._validateRejZFile(fileContent);

        if (!validation) {
          const rejzData = this.prnReaderService.readRejZ(fileContent);
          this._rejzData = this._parseRejzData(rejzData);
        }
        fileIndex = 2;
        break;

      case JpkFileName.PZN:
        validation = this._validatePZNFile(fileContent);

        if (!validation) {
          const pznData = this.prnReaderService.readPZN(fileContent);
          this._pznData = this._parsePznData(pznData)
        }
        fileIndex = 3;
        break;

      case JpkFileName.WNPZ:
        validation = this._validateWNPZFile(fileContent);

        if (!validation) {
          const wnpzData = this.prnReaderService.readWNPZ(fileContent);
          this._wnpzData = this._parseWnpzData(wnpzData)
        }
        fileIndex = 4;
        break;

      case JpkFileName.MAPZ:
        validation = this._validateMAPZFile(fileContent);

        if (!validation) {
          const mapzData = this.prnReaderService.readMAPZ(fileContent);
          this._mapzData = this._parseMapzData(mapzData)
        }
        fileIndex = 5;
        break;
    }

    this.files[fileIndex].fileName.set(null);
    this.files[fileIndex].fileSize.set(null);
    this.files[fileIndex].fileContent.set(null);
    this.files[fileIndex].validationData.set(false);
    this.files[fileIndex].state.set(JpkFileState.Loading);

    const sleepModifier = Math.sqrt(fileContent.length);
    const sleepAmount = sleepModifier + Math.random() * sleepModifier;
    await sleep(sleepAmount);

    this.files[fileIndex].fileName.set(file.name);
    this.files[fileIndex].fileSize.set(file.size);
    this.files[fileIndex].fileContent.set(fileContent);
    this.files[fileIndex].validationData.set(validation);
    this.files[fileIndex].state.set(validation ? JpkFileState.Error : JpkFileState.OK);

    return false;
  }

  private async _determineFileName(file: File, content: string): Promise<JpkFileName | null> {
    const fileName = file.name;

    if (fileName.endsWith('.xml')) {
      return JpkFileName.XML;
    }
    if (fileName.endsWith('.csv')) {
      return JpkFileName.WeryfikacjaVAT;
    }
    if (!fileName.endsWith('.prn')) {
      return null;
    }
    if (/Rejestr VAT: go zakupy got.wkowe/.test(content)) {
      return JpkFileName.RejZ;
    }
    if (/Raport przyj.cia zakup.w/.test(content)) {
      return JpkFileName.PZN;
    }
    if (/Rejestr VAT: WN WNT/.test(content)) {
      return JpkFileName.WNPZ;
    }
    if (/Rejestr VAT: MA Rejestr zakupu mater/.test(content)) {
      return JpkFileName.MAPZ;
    }
    return null;
  }
  private _validateXmlFile(content: string): false | [string, string] {
    if (!/<tns:KodFormularza.*?>JPK_VAT<\/tns:KodFormularza>/.test(content)) {
      return [
        'Dodany plik nie wygląda na poprawny plik JPK. Upewnij się, że dodajesz plik wygenerowany przez formularz JPK_VAT.',
        'VLD_XML_0',
      ];
    }
    return false;
  }
  private _validateVerificationFile(content: string): false | [string, string] {
    const requiredHeaders = new Set<string>(REQUIRED_VERIFICATION_COLUMNS);

    const fileHeaders = this.excelService.readHeaderAsCsv(content);

    for (const header of fileHeaders) {
      if (!requiredHeaders.has(header)) continue;

      requiredHeaders.delete(header);
    }

    if (requiredHeaders.size > 0) {
      const missingHeaders = Array.from(requiredHeaders);
      return [missingHeaders.join(', '), 'VLD_CSV_0'];
    }
    return false;
  }
  private _runPatternBasedValidation(patterns: RegExp[], content: string, errorFactory: (patternIndex: number) => string): false | string {
    for (let i = 0; i < patterns.length; i++) {
      const pattern = patterns[i];
      if (!pattern.test(content)) {
        return errorFactory(i);
      }
    }
    return false;
  }
  private _validateRejZFile(content: string): false | [string, string] {
    const validationResults = this._runPatternBasedValidation(RejZValidationPatterns, content, i => `VLD_REJZ_${i}`);
    if (!validationResults) return false;
    return ['Dodany plik nie wygląda na poprawny plik RejZ. Upewnij się, że dodajesz odpowiedni plik.', validationResults];
  }
  private _validatePZNFile(content: string): false | [string, string] {
    const validationResults = this._runPatternBasedValidation(PZNValidationPatterns, content, i => `VLD_PZN_${i}`);
    if (!validationResults) return false;
    return ['Dodany plik nie wygląda na poprawny plik PZN. Upewnij się, że dodajesz odpowiedni plik.', validationResults];
  }
  private _validateWNPZFile(content: string): false | [string, string] {
    const validationResults = this._runPatternBasedValidation(WNPZValidationPatterns, content, i => `VLD_WNPZ_${i}`);
    if (!validationResults) return false;
    return ['Dodany plik nie wygląda na poprawny plik WNPZ. Upewnij się, że dodajesz odpowiedni plik.', validationResults];
  }
  private _validateMAPZFile(content: string): false | [string, string] {
    const validationResults = this._runPatternBasedValidation(MAPZValidationPatterns, content, i => `VLD_MAPZ_${i}`);
    if (!validationResults) return false;
    return ['Dodany plik nie wygląda na poprawny plik MAPZ. Upewnij się, że dodajesz odpowiedni plik.', validationResults];
  }

  private readAsXml(xmlContent: string): xmlRawRecord[] {
    const options = {
      explicitArray: false,
      mergeAttrs: true,
      trim: true,
      normalizeTags: true,
      explicitRoot: false,
      tagNameProcessors: [processors.stripPrefix], // Usuwa przedrostki przestrzeni nazw z nazw tagów
      attrNameProcessors: [processors.stripPrefix], // Usuwa przedrostki przestrzeni nazw z nazw atrybutów
    };

    let result: any;
    parseString(xmlContent, options, (err, res) => {
      if (err) {
        throw new Error(`Error parsing XML: ${err.message}`);
      }
      result = res;
      console.log(result);
    });

    const xmlRawRecords: xmlRawRecord[] = result.ewidencja.zakupwiersz;
    return xmlRawRecords;
  }

  private parseStringToFloat(value: string): number {
    if (value==='') {
      return 0;
    }
    const normalizedValue = value.replace(',', '.'); // Zamiana przecinków na kropki
    const numberValue = parseFloat(normalizedValue);

    return numberValue
  }

  // parsuje obiekt odczytany z xml na listę recordów gotowych do excella
  private _parseXmlData(xmlData: xmlRawRecord[]): xmlReadyRecord[] {

    const xmlReadyRecords =  xmlData.map(record => ({
        lpzakupu: record.lpzakupu  || '',
        kodkrajunadaniatin: record.kodkrajunadaniatin || '',
        nazwadostawcy: record.nazwadostawcy || '',
        nrdostawcy: record.nrdostawcy || '',
        dowodzakupu: record.dowodzakupu || '',
        datazakupu: record.datazakupu || '',
        datawplywu: record.datawplywu || '',
        k_40: this.parseStringToFloat(record.k_40),
        k_41: this.parseStringToFloat(record.k_41),
        k_42: this.parseStringToFloat(record.k_42),
        k_43: this.parseStringToFloat(record.k_43),
        k_44: this.parseStringToFloat(record.k_44),
        k_45: this.parseStringToFloat(record.k_45),
        k_46: this.parseStringToFloat(record.k_46),
        k_47: this.parseStringToFloat(record.k_47),
        dokumentzakupu: record.dokumentzakupu || ''
    }));
    return xmlReadyRecords
  }

  private _parseVatVerificationData(csvContent: Array<csvRawRecord>): csvReadyRecord[] {
    const csvReadyRecords = csvContent.map(vatRecord => ({
      ['NIP i numer']: vatRecord.NIP + vatRecord['Numer faktury'].substring(0, 20),
      Lp: vatRecord.Lp,
      'Numer faktury': vatRecord['Numer faktury'],
      Kontrahent: vatRecord.Kontrahent,
      NIP: vatRecord.NIP,
      'Numer wewnętrzny': vatRecord['Numer wewnętrzny'],
      'Numer referencyjny': vatRecord['Numer referencyjny'],
      Rejestr: vatRecord.Rejestr,
      Waluta: vatRecord.Waluta,
      'Typ faktury': vatRecord['Typ faktury'],
      'Opis (dekretacja)': vatRecord['Opis (dekretacja)'],
      'Status płatności': vatRecord['Status płatności'],
      'Data płatności': vatRecord['Data płatności'],
      'Termin płatności': vatRecord['Termin płatności'],
      'Data płatności ze skontem': vatRecord['Data płatności ze skontem'],
      'Wartość skonta': this.parseStringToFloat(vatRecord['Wartość skonta']),
      Skonto: this.parseStringToFloat(vatRecord.Skonto),
      Kompensaty: this.parseStringToFloat(vatRecord.Kompensaty),
      Przedpłaty: this.parseStringToFloat(vatRecord.Przedpłaty),
      'Numer faktury korygowanej': vatRecord['Numer faktury korygowanej'],
      Opis: vatRecord.Opis,
      'Numer własny': vatRecord['Numer własny'],
      'ZalacznikiTest': vatRecord['ZalacznikiTest']
    }));
    return csvReadyRecords
  }

  private _isCsvRecord(record: any): record is csvRawRecord {
    const requiredKeys = [
      'Data płatności',
      'Data płatności ze skontem',
      'Kompensaty',
      'Kontrahent',
      'Lp',
      'NIP',
      'Numer faktury',
      'Numer faktury korygowanej',
      'Numer referencyjny',
      'Numer wewnętrzny',
      'Numer własny',
      'Opis',
      'Opis (dekretacja)',
      'Przedpłaty',
      'Rejestr',
      'Skonto',
      'Status płatności',
      'Termin płatności',
      'Typ faktury',
      'Waluta',
      'Wartość skonta',
      'ZalacznikiTest',
    ];
    return requiredKeys.every(key => key in record);
  }

  private _parseRejzData(rejzData: rejzRawRecord[]): rejzReadyRecord[] {
    const rejzReadyRecords = rejzData.flatMap(({ num, reference, package: packageVar, type, supplier, invoice, invoiceDate, vatItems }) =>
      vatItems.map(vatItem => ({
        num,
        reference,
        package: packageVar,
        type,
        supplier,
        netValue: vatItem.netValue,
        vatCode: vatItem.vat,
        vatPercent: vatItem.vatPercent,
        vatValue: vatItem.vatValue,
        invoice,
        invoiceDate,
      }))
    );
    return rejzReadyRecords
  }

  private _parsePznData(pznData: pznRawRecord[]): pznReadyRecord[] {
    const pznReadyRecords = pznData.flatMap(({ commission, subitems, supplierName, supplierNumber}) =>
      subitems.map(PZNSubitem => ({
        num: PZNSubitem.num,
        commission,
        supplierNumber,
        supplierName,
        specNum: PZNSubitem.specNum,
        opcjaERS: PZNSubitem.opcjaERS,
        sendDate: PZNSubitem.sendDate,
        receiveDate: PZNSubitem.receiveDate,
        dokDost: PZNSubitem.dokDost,
        wylKosztKG: PZNSubitem.wylKosztKG,
        zewnPodatekZZ: PZNSubitem.zewnPodatekZZ,
        odchKGZZ: PZNSubitem.odchKGZZ,
      }))
    );
    return pznReadyRecords
  }


  private _parseWnpzData(wnpzData: wnpzRawRecord[]): wnpzReadyRecord[] {
    const wnpzReadyRecords = wnpzData.flatMap(({ num, reference, package: packageVar, type, vatNumber, supplier, dataPod, naDzien, dataWplywu, pzItems, vatItems, invoice, invoiceDate, vatSummary }) =>
      pzItems.map(PZItem => ({
        num,
        reference,
        package: packageVar,
        type,
        vatNumber,
        supplier,
        netValue: vatItems[0].netValue,
        vat: vatItems[0].vat,
        vatPercent: vatItems[0].vatPercent,
        vatValue: vatItems[0].vatValue,
        invoice,
        invoiceDate,
        dataPod,
        naDzien,
        dataWplywu,
        code: PZItem.code,
        deliveryDate: PZItem.deliveryDate,
        PZAmount: PZItem.PZAmount,
        invoiceAmount: PZItem.invoiceAmount,
      }))
    );
    return wnpzReadyRecords
  }

  private _parseMapzData(mapzData: mapzRawRecord[]): mapzReadyRecord[] {
    const mapzReadyRecords = mapzData.flatMap(({dataPod, dataWplywu, invoice, invoiceDate, naDzien, num, package: packageVar, pzItems, reference, supplier, type, vatItems, vatNumber, vatSummary }) =>
      pzItems.map(PZItem => ({
        num,
        reference,
        package: packageVar,
        type,
        vatNumber,
        supplier,
        netValue: vatItems[0].netValue,
        vat: vatItems[0].vat,
        vatPercent: vatItems[0].vatPercent,
        vatValue: vatItems[0].vatValue,
        invoice,
        invoiceDate,
        dataPod,
        naDzien,
        dataWplywu,
        code: PZItem.code,
        deliveryDate: PZItem.deliveryDate,
        PZAmount: PZItem.PZAmount,
        invoiceAmount: PZItem.invoiceAmount,
      }))
    );
    return mapzReadyRecords
  }

}