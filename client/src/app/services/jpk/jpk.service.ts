import { Injectable, computed, inject, signal } from '@angular/core';
import { Tuple, sleep } from '@utils';
import { JpkFile, JpkFileState, JpkFileType } from './jpk-file';
import { ExcelService } from '../excel/excel.service';
import { MAPZValidationPatterns, PZNValidationPatterns, RejZValidationPatterns, WNPZValidationPatterns } from './validation-patterns';
import { FaktoringService } from '../faktoring/faktoring.service';
import { parseStringPromise } from 'xml2js';
import { readyVerifRecord, csvVerifRecord, rejzObject, rejzPrnData } from './jpk.types';
import { WeirdPrnReaderService } from '../weird-prn-reader/weird-prn-reader.service';

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
  private readonly faktoringService = inject(FaktoringService);
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
    let csvObjects: object;
    let xmlObjects: object;
    switch (determinedName) {
      case JpkFileName.XML:
        validation = this._validateXmlFile(fileContent);
        if (!validation) {
          xmlObjects = await this.parseXML(fileContent);
          // console.log('XML');
          // console.log(xmlObjects);
        }
        fileIndex = 0;
        break;
      case JpkFileName.WeryfikacjaVAT:
        validation = this._validateVerificationFile(fileContent);
        if (!validation) {
          csvObjects = this.excelService.readAsCsv(fileContent);
        }
        fileIndex = 1;
        break;
      case JpkFileName.RejZ:
        validation = this._validateRejZFile(fileContent);
        if (!validation) {
          const prnObjects = this.prnReaderService.readRejZ(fileContent);
          console.log('RejZ');
          console.log(prnObjects);
        }
        fileIndex = 2;
        break;
      case JpkFileName.PZN:
        validation = this._validatePZNFile(fileContent);
        fileIndex = 3;
        break;
      case JpkFileName.WNPZ:
        validation = this._validateWNPZFile(fileContent);
        fileIndex = 4;
        break;
      case JpkFileName.MAPZ:
        validation = this._validateMAPZFile(fileContent);
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

  private async parseXML(xmlContent: string): Promise<any> {
    try {
      const options = {
        explicitArray: false,
        mergeAttrs: true,
        trim: true,
        normalizeTags: true,
      };

      const result = await parseStringPromise(xmlContent, options);
      return result;
    } catch (err) {
      console.error('Error parsing XML:', err);
      throw err;
    }
  }

  private _prepareVatValidationData(csvContent: Array<csvVerifRecord>): Array<readyVerifRecord> {
    console.log(csvContent);
    return csvContent.map(vatRecord => ({
      ['NIP i numer']: vatRecord.NIP + vatRecord['Numer faktury'].substring(0, 20),
      ...vatRecord,
    }));
  }

  private _parseRejzData(rejzObjectsArray: Array<rejzPrnData>): Array<rejzObject> {
    const rejzDataArray: Array<rejzObject> = [];
    rejzObjectsArray.forEach(obj => {
      const num = obj.num;
      const reference = obj.reference;
      const packageVar = obj.package;
      const type = obj.type;
      const supplier = obj.supplier;
      const invoice = obj.invoice;
      const invoiceDate = obj.invoiceDate;

      obj.vatItems.forEach(vatItem => {
        rejzDataArray.push({
          num: num,
          reference: reference,
          package: packageVar,
          type: type,
          supplier: supplier,
          netValue: vatItem.netValue,
          vatCode: vatItem.vat,
          vatPercent: vatItem.vatPercent,
          vatValue: vatItem.vatValue,
          invoice: invoice,
          invoiceDate: invoiceDate,
        });
      });
    });
    return rejzDataArray;
  }
}
