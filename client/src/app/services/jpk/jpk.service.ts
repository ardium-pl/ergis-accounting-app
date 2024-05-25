import { Injectable, inject } from '@angular/core';
import { Tuple } from '@utils';
import { JpkFile, JpkFileType } from './jpk-file';
import { ExcelService } from '../excel/excel.service';

const JpkFileName = {
  XML: 'V72405...',
  WeryfikacjaVAT: 'Weryfikacja VAT',
  RejZ: 'RejZ',
  PZN: 'PZN',
  WNPZ: 'WNPZ',
  MAPZ: 'MAPZ',
} as const;
type JpkFileName = (typeof JpkFileName)[keyof typeof JpkFileName];

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

  readonly excelService = inject(ExcelService);

  readonly files: Tuple<JpkFile, 6> = [
    new JpkFile(JpkFileType.XML, JpkFileName.XML),
    new JpkFile(JpkFileType.CSV, JpkFileName.WeryfikacjaVAT),
    new JpkFile(JpkFileType.PRN, JpkFileName.RejZ),
    new JpkFile(JpkFileType.PRN, JpkFileName.PZN),
    new JpkFile(JpkFileType.PRN, JpkFileName.WNPZ),
    new JpkFile(JpkFileType.PRN, JpkFileName.MAPZ),
  ];

  async handleFilesUpload(files: File[]): Promise<boolean[]> {
    const promises: Promise<boolean>[] = [];
    for (const file of files) {
      promises.push(this._handleSingleFileUpload(file));
    }
    return Promise.all(promises);
  }
  private async _handleSingleFileUpload(file: File): Promise<boolean> {
    const fileContent = await file.text();
    const determinedName = await this._determineFileName(file, fileContent);

    if (!determinedName) {
      return false;
    }
    switch (determinedName) {
      case JpkFileName.XML:
        this._handleXmlFile(file, fileContent);
        break;
      case JpkFileName.WeryfikacjaVAT:
        this._handleVerificationFile(file, fileContent);
        break;
      case JpkFileName.RejZ:
        this._handleRejZFile(file, fileContent);
        break;
      case JpkFileName.PZN:
        this._handlePZNFile(file, fileContent);
        break;
      case JpkFileName.WNPZ:
        this._handleWNPZFile(file, fileContent);
        break;
      case JpkFileName.MAPZ:
        this._handleMAPZFile(file, fileContent);
        break;
    }

    return true;
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
    if (/Rejestr VAT: go zakupy got�wkowe/.test(content)) {
      return JpkFileName.RejZ;
    }
    if (/Raport przyj�cia zakup�w/.test(content)) {
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
  private _handleXmlFile(file: File, content: string): void {
    const validation = this._validateXmlFile(content);

    this.files[0].fileName.set(file.name);
    this.files[0].fileSize.set(file.size);
  }
  private _validateXmlFile(content: string): false | string {
    if (!/<tns:KodFormularza.*?>JPK_VAT<\/tns:KodFormularza>/.test(content)) {
      return 'Dodany plik nie wygląda na poprawny plik JPK. Upewnij się, że dodajesz plik wygenerowany przez formularz JPK_VAT.';
    }
    return false;
  }
  private _handleVerificationFile(file: File, content: string): void {
    const validation = this._validateVerificationFile(content);

    this.files[1].fileName.set(file.name);
    this.files[1].fileSize.set(file.size);
  }
  private _validateVerificationFile(content: string): false | string {
    const requiredHeaders = new Set<string>(REQUIRED_VERIFICATION_COLUMNS);

    const fileHeaders = this.excelService.readHeaderAsCsv(content);

    for (const header of fileHeaders) {
      if (!requiredHeaders.has(header)) continue;

      requiredHeaders.delete(header);
    }

    if (requiredHeaders.size > 0) {
      const missingHeaders = Array.from(requiredHeaders);
      return missingHeaders.join(', ');
    }
    return false;
  }
  private _handleRejZFile(file: File, content: string): void {
    const validation = this._validateRejZFile(content);

    this.files[2].fileName.set(file.name);
    this.files[2].fileSize.set(file.size);
  }
  private _validateRejZFile(content: string): false | string {
    return false;
  }
  private _handlePZNFile(file: File, content: string): void {
    const validation = this._validatePZNFile(content);

    this.files[3].fileName.set(file.name);
    this.files[3].fileSize.set(file.size);
  }
  private _validatePZNFile(content: string): false | string {
    return false;
  }
  private _handleWNPZFile(file: File, content: string): void {
    const validation = this._validateWNPZFile(content);

    this.files[4].fileName.set(file.name);
    this.files[4].fileSize.set(file.size);
  }
  private _validateWNPZFile(content: string): false | string {
    return false;
  }
  private _handleMAPZFile(file: File, content: string): void {
    const validation = this._validateMAPZFile(content);

    this.files[5].fileName.set(file.name);
    this.files[5].fileSize.set(file.size);
  }
  private _validateMAPZFile(content: string): false | string {
    return false;
  }

  constructor() {}
}
