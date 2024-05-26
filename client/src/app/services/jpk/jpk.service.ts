import { Injectable, inject } from '@angular/core';
import { Tuple, sleep } from '@utils';
import { JpkFile, JpkFileState, JpkFileType } from './jpk-file';
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
  private readonly excelService = inject(ExcelService);

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
    let validation: string | false;
    let fileIndex: number;
    switch (determinedName) {
      case JpkFileName.XML:
        validation = this._validateXmlFile(fileContent);
        fileIndex = 0;
        break;
      case JpkFileName.WeryfikacjaVAT:
        validation = this._validateVerificationFile(fileContent);
        fileIndex = 1;
        break;
      case JpkFileName.RejZ:
        validation = this._validateRejZFile(fileContent);
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

    this.files[fileIndex].state.set(JpkFileState.Loading);

    const sleepModifier = Math.sqrt(fileContent.length);
    const sleepAmount = sleepModifier + Math.random() * sleepModifier;
    await sleep(sleepAmount);

    this.files[fileIndex].fileName.set(file.name);
    this.files[fileIndex].fileSize.set(file.size);
    this.files[fileIndex].fileContent.set(fileContent);
    this.files[fileIndex].validationData.set(validation);
    this.files[fileIndex].state.set(validation ? JpkFileState.Error : JpkFileState.OK);

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
  private _validateXmlFile(content: string): false | string {
    if (!/<tns:KodFormularza.*?>JPK_VAT<\/tns:KodFormularza>/.test(content)) {
      return 'Dodany plik nie wygląda na poprawny plik JPK. Upewnij się, że dodajesz plik wygenerowany przez formularz JPK_VAT.';
    }
    return false;
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
  private _validateRejZFile(content: string): false | string {
    return false;
  }
  private _validatePZNFile(content: string): false | string {
    return false;
  }
  private _validateWNPZFile(content: string): false | string {
    return false;
  }
  private _validateMAPZFile(content: string): false | string {
    return false;
  }
}
