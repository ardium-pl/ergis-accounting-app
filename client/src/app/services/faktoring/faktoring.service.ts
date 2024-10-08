import { Injectable, computed, inject, signal } from '@angular/core';
import { CsvObject, ExcelService } from '@services/excel';
import { PrnObject } from '@services/prn-reader';
import { roundToPrecision } from 'more-rounding';
import { SkippingIterator } from 'src/app/utils/skipping-iterator';
import { parseNumber, parseYesNo } from './../../utils/helpers';
import { PrnReaderService } from './../prn-reader/prn-reader.service';
import { FaktoringDetails, FaktoringMode, FaktoringObject, FinalFaktoringObject, LeftOverObject, LeftoversFlag } from './faktoring.types';

@Injectable({
  providedIn: 'root',
})
export class FaktoringService {
  private readonly prnReader = inject(PrnReaderService);
  private readonly excelService = inject(ExcelService);

  //! prn file
  private readonly _prnFile = signal<File | null>(null);
  public readonly prnFile = computed(() => this._prnFile());
  private readonly _prnArray = signal<PrnObject[]>([]);
  public readonly prnArray = computed(() => this._prnArray());
  private readonly _prnHeaders = signal<string[]>([]);
  public readonly prnHeaders = computed(() => this._prnHeaders());
  public readonly hasPrn = computed(() => this._prnArray().length > 0);

  /**
   * Sets the prn file to be used in the service.
   * @param file The file uploaded.
   * @returns Whether the file met the expected criteria or not.
   */
  public setPrnFile(file: File): boolean {
    if (file.size > 10 * 1024 * 1024) {
      alert('Plik musi być mniejszy niż 10 MB');
      return false;
    }
    if (!file.name.toLowerCase().endsWith('.prn')) {
      alert('Plik musi być typu .prn');
      return false;
    }

    const reader = new FileReader();
    reader.onload = e => {
      const content = e.target?.result as string;

      const prnObjects = this.prnReader.readPrn(content);
      this._prnArray.set(prnObjects);

      const headers = this.prnReader.readPrnHeaders(content);
      this._prnHeaders.set(headers);
    };
    reader.onerror = () => {
      throw new Error('Error reading file.');
    };
    reader.readAsText(file);
    this._prnFile.set(file);
    return true;
  }
  public removePrnRow(index: number): void {
    const newArray = [...this._prnArray()];
    newArray.splice(index, 1);
    this._prnArray.set(newArray);
  }
  public updatePrnRow(index: number, key: string, value: string): void {
    const newArray = [...this._prnArray()];
    newArray[index][key] = value;
    this._prnArray.set(newArray);
  }
  //! csv file
  private readonly _csvFile = signal<File | null>(null);
  public readonly csvFile = computed(() => this._csvFile());
  private readonly _csvArray = signal<FaktoringObject[]>([]);
  public readonly csvArray = computed(() => this._csvArray());
  public readonly hasCsv = computed(() => this._csvArray().length > 0);

  public setCsvFile(file: File): boolean {
    if (file.size > 10 * 1024 * 1024) {
      alert('Plik musi być mniejszy niż 10 MB');
      return false;
    }
    if (!file.name.toLowerCase().endsWith('.csv')) {
      alert('Plik musi być typu .csv');
      return false;
    }

    const reader = new FileReader();
    reader.onload = e => {
      const content = e.target?.result as string;

      try {
        const csvObjects = this.excelService.readAsCsv<keyof FaktoringObject>(content);
        const faktoringObjects = csvObjects.map(this._mapRawCsvObject);
        this._csvArray.set(faktoringObjects);
        this._csvFile.set(file);
      } catch (error) {
        if (error === 'EMPTY_CSV_ERR') {
          alert('Dodano plik CSV bez zawartości!');
          return;
        }
        if (error === 'SEPARATOR_ERR') {
          alert('Nie udało się wykryć rodzaju separatora pliku CSV. Sprawdź, czy plik nie był ręcznie edytowany.');
          return;
        }
        if (error === 'CSV_FORMAT_ERR') {
          alert('Plik CSV ma nieprawidłowy format!');
          return;
        }
      }
    };
    reader.onerror = () => {
      throw new Error('Error reading file.');
    };
    reader.readAsText(file);
    return true;
  }

  public processData() {
    const fromPrn = this._deleteSameDocumentTransactions(this._mapPrnObjectsToFaktoringObjects(this._prnArray()));
    const pastEntries = this._csvArray();

    let positives: FaktoringObject[] = [];
    let negatives: FaktoringObject[] = [];
    let faktoringMode: FaktoringMode = FaktoringMode.Positive;

    //Assign values from CSV if it's not
    if (this._csvArray().length != 0) {
      positives = pastEntries[0].kwotaWWalucie > 0 ? [...pastEntries] : [];
      negatives = pastEntries[0].kwotaWWalucie < 0 ? [...pastEntries] : [];

      //Setting faktoring mode dynamically based on the type of past entrie
      faktoringMode = pastEntries[0].kwotaWWalucie > 0 ? FaktoringMode.Negative : FaktoringMode.Positive;
    }

    // filter out corrections & sort entries into positives and negatives
    for (const obj of fromPrn) {
      if (obj.kwotaWZl < 0) {
        negatives.push(obj);
        continue;
      }
      if (obj.kwotaWZl > 0) {
        positives.push(obj);
        continue;
      }
    }

    // if there aren't any positives then there isn't data to process
    if (!positives) return null;
    // try processing the data
    try {
      return this._processData(positives, negatives, faktoringMode);
    } catch (err) {
      // return null if an error is encountered
      console.error(err);
      return null;
    }
  }

  private _mapPrnObjectsToFaktoringObjects(rawObjects: PrnObject[]): FaktoringObject[] {
    return rawObjects.map(this._mapRawPrnObject).filter(obj => !obj.korekta && obj.kwotaWWalucie != 0);
  }

  private _deleteSameDocumentTransactions(faktoringObjects: FaktoringObject[]): FaktoringObject[] {
    const modifiedArray: FaktoringObject[] = [];
    const groupsArrayJSON: string[] = [];

    faktoringObjects.forEach(obj => {
      const searchedDocument = obj.document;

      const group = faktoringObjects.filter(obj => obj.document === searchedDocument);
      const groupJSON = JSON.stringify(group);

      if (group.length === 1 || this._sameSignsInGroup(group)) {
        modifiedArray.push(obj);
        return;
      }
      if (groupsArrayJSON.includes(groupJSON)) {
        return;
      }
      const mergedFaktoringObj = this._mergeGroupOfFaktoringObjects(group);
      modifiedArray.push(mergedFaktoringObj);
      groupsArrayJSON.push(groupJSON);
    });
    return modifiedArray;
  }

  private _sameSignsInGroup(group: FaktoringObject[]): boolean {
    const isMinus = (amount: number) => amount < 0;
    const isPlus = (amount: number) => amount > 0;

    return group.every(item => isMinus(item.kwotaWWalucie)) || group.every(item => isPlus(item.kwotaWWalucie));
  }

  private _mergeGroupOfFaktoringObjects(group: FaktoringObject[]): FaktoringObject {
    let mergedKwotaWWalucie: number = 0;
    let mergedKwotaWZl: number = 0;
    const firstObj = group[0];

    group.forEach(obj => {
      mergedKwotaWWalucie += obj.kwotaWWalucie;
      mergedKwotaWZl += obj.kwotaWZl;
    });

    return {
      ...firstObj,
      kwotaWWalucie: mergedKwotaWWalucie,
      kwotaWZl: mergedKwotaWZl,
    };
  }

  private _mapRawPrnObject(rawObject: PrnObject): FaktoringObject {
    return {
      referencjaKG: rawObject['ReferencjaKG'],
      naDzien: rawObject['NaDzie'] ?? rawObject['NaDzien'], //The polish character ń is usually removed
      kwotaWWalucie: parseNumber(rawObject['KwotaWWalucie']),
      kwotaWZl: parseNumber(rawObject['Kwota']),
      korekta: parseYesNo(rawObject['Kor']) || parseNumber(rawObject['KwotaWWalucie']) === 0,
      konto: rawObject['Konto'],
      subkonto: rawObject['Subkonto'],
      mpk: rawObject['MPK'],
      document: rawObject['Dokument'],
    };
  }
  private _mapRawCsvObject(rawObject: CsvObject<keyof FaktoringObject>): FaktoringObject {
    const entries = Object.entries(rawObject);
    if (entries.length < 7 || entries.some(([, v]) => !v)) {
      throw 'CSV_FORMAT_ERR';
    }
    return {
      referencjaKG: rawObject.referencjaKG ?? '',
      naDzien: rawObject.naDzien ?? '',
      kwotaWWalucie: parseNumber(rawObject.kwotaWWalucie ?? '0'),
      kwotaWZl: parseNumber(rawObject.kwotaWZl ?? '0'),
      korekta: parseYesNo(rawObject.korekta),
      konto: rawObject.konto ?? '',
      subkonto: rawObject.subkonto ?? '',
      mpk: rawObject.mpk ?? '',
      document: '', //CSV doesn't contain a document
    };
  }

  private _processData(
    positivesArray: FaktoringObject[],
    negativesArray: FaktoringObject[],
    faktoringMode: FaktoringMode
  ): [FinalFaktoringObject[], LeftOverObject[]] {
    //handle no negatives
    if (negativesArray.length == 0) return [[], positivesArray];
    //handle no positives
    if (positivesArray.length == 0) return [[], negativesArray];

    // make negative entries positive for easier logic
    negativesArray = negativesArray.map(v => ({
      ...v,
      kwotaWWalucie: -v.kwotaWWalucie,
      kwotaWZl: -v.kwotaWZl,
    }));

    console.table(negativesArray)
    console.table(positivesArray)
    // get the first
    const positives = new SkippingIterator(positivesArray, v => v.korekta);
    const negatives = new SkippingIterator(negativesArray, v => v.korekta);
    let positiveObject = positives.next().value;
    let negativeObject = negatives.next().value;

    let positiveAmount = positiveObject?.kwotaWWalucie;
    let negativeAmount = negativeObject.kwotaWWalucie;

    const allCurrencyCorrections: FinalFaktoringObject[] = [];
    let leftoversFlag: LeftoversFlag = LeftoversFlag.NoneLeft;

    let i = 0;
    while ((positives.hasNext() || !isNaN(positiveAmount)) && (negatives.hasNext() || !isNaN(negativeAmount))) {
      i++;
      console.log(
        negativeObject?.referencjaKG,
        positiveObject?.referencjaKG,
        negativeAmount,
        positiveAmount,
        negatives.remaining().length,
        positives.remaining().length,
        i
      );
      const positiveExchangeRate = positiveObject.kwotaWZl / positiveObject.kwotaWWalucie;
      const negativeExchangeRate = negativeObject.kwotaWZl / negativeObject.kwotaWWalucie;

      //const positiveDate = this.getReferencesDate(positiveObject.referencjaKG);
      const positiveDate = this._getReferencesDate(positiveObject.naDzien);
      const negativeDate = this._getReferencesDate(negativeObject.naDzien);

      if (positiveDate > negativeDate) {
        faktoringMode = FaktoringMode.Positive;
      } else if (negativeDate > positiveDate) {
        faktoringMode = FaktoringMode.Negative;
      } else if (positiveDate.getDate() == negativeDate.getDate()) {
        const positiveObjectIndex = this.getPrnIndex(positiveObject.referencjaKG);
        const negativeObjectIndex = this.getPrnIndex(negativeObject.referencjaKG);

        if (positiveObjectIndex && negativeObjectIndex && positiveObjectIndex > negativeObjectIndex) {
          faktoringMode = FaktoringMode.Positive;
        } else {
          faktoringMode = FaktoringMode.Negative;
        }
      }

      const referencjaKG = faktoringMode == FaktoringMode.Positive ? positiveObject.referencjaKG : negativeObject.referencjaKG; //This is the line that I have to modify
      const konto = faktoringMode == FaktoringMode.Positive ? positiveObject.konto : negativeObject.konto;
      const subkonto = faktoringMode == FaktoringMode.Positive ? positiveObject.subkonto : negativeObject.subkonto;
      const mpk = faktoringMode == FaktoringMode.Positive ? positiveObject.mpk : negativeObject.mpk;

      let correctionAmount: number;

      // for validation purposes
      const lookUpPositiveAmount: number = positiveAmount;
      const lookUpNegativeAmount: number = -negativeAmount;
      const lookUpPositiveReference: string = positiveObject.referencjaKG;
      const lookUpNegativeReference: string = negativeObject.referencjaKG;

      if (positiveAmount > negativeAmount) {
        // negative is the valid correction amount - remove one entry and subtract from the positive total
        correctionAmount = negativeAmount;
        positiveAmount -= negativeAmount;
        positiveAmount = roundToPrecision(positiveAmount, 5);

        negativeObject = negatives.next().value;
        negativeAmount = negativeObject?.kwotaWWalucie ?? NaN;

        leftoversFlag = LeftoversFlag.Positive;
      } else if (positiveAmount < negativeAmount) {
        // positive is the valid correction amount - remove one entry and subtract from the negative total
        correctionAmount = positiveAmount;
        negativeAmount -= positiveAmount;
        negativeAmount = roundToPrecision(negativeAmount, 5);

        positiveObject = positives.next().value;
        positiveAmount = positiveObject?.kwotaWWalucie ?? NaN;

        leftoversFlag = LeftoversFlag.Negative;
      } else {
        // both types are the valid correction amounts - remove one entry from both and set new totals
        correctionAmount = positiveAmount;

        positiveObject = positives.next().value;
        positiveAmount = positiveObject?.kwotaWWalucie ?? NaN;
        
        negativeObject = negatives.next().value;
        negativeAmount = negativeObject?.kwotaWWalucie ?? NaN;

        leftoversFlag = LeftoversFlag.NoneLeft;
      }
      const rateDifference = negativeExchangeRate - positiveExchangeRate;
      const currencyCorrection = correctionAmount * rateDifference;

      const details: FaktoringDetails = {
        positiveAmount: lookUpPositiveAmount,
        negativeAmount: lookUpNegativeAmount,
        positiveReference: lookUpPositiveReference,
        negativeReference: lookUpNegativeReference,
        otherReference: FaktoringMode.Positive ? lookUpNegativeReference : lookUpPositiveReference,
        positiveRate: positiveExchangeRate,
        negativeRate: negativeExchangeRate,
        rateDifference,
      };
      allCurrencyCorrections.push({
        referencjaKG,
        currencyCorrection,
        details,
        konto,
        subkonto,
        mpk,
      });
    }

    // determine which type of objects to return
    if (leftoversFlag === LeftoversFlag.Negative || (leftoversFlag === LeftoversFlag.NoneLeft && negativeAmount)) {
      // make all negative entries negative again
      const negativeExchangeRate = negativeObject.kwotaWZl / negativeObject.kwotaWWalucie;
      const leftOverNegatives: LeftOverObject[] = this._retrieveUnusedElement(
        -negativeAmount,
        negatives.remaining(false).map(v => ({
          ...v,
          kwotaWWalucie: -v.kwotaWWalucie,
          kwotaWZl: -v.kwotaWZl,
        })),
        negativeExchangeRate,
        negativeObject.referencjaKG,
        negativeObject.naDzien,
        negativeObject.konto,
        negativeObject.subkonto,
        negativeObject.mpk
      );

      return [allCurrencyCorrections, leftOverNegatives];
    }
    if (leftoversFlag === LeftoversFlag.Positive || (leftoversFlag === LeftoversFlag.NoneLeft && positiveAmount)) {
      const positiveExchangeRate = positiveObject.kwotaWZl / positiveObject.kwotaWWalucie;
      const leftOverPositives: LeftOverObject[] = this._retrieveUnusedElement(
        positiveAmount,
        positives.remaining(false),
        positiveExchangeRate,
        positiveObject.referencjaKG,
        positiveObject.naDzien,
        positiveObject.konto,
        positiveObject.subkonto,
        positiveObject.mpk
      );
      return [allCurrencyCorrections, leftOverPositives];
    }
    return [allCurrencyCorrections, []];
  }

  private _getReferencesDate(referenceNumber: string) {
    //TODO: Add an error message visible to the user
    if (referenceNumber.length < 8) {
      throw new Error(`Invalid reference number format at ${referenceNumber}`);
    }

    const year = '20' + referenceNumber.substring(0, 2);
    const month = referenceNumber.substring(3, 5);
    const day = referenceNumber.substring(6, 8);

    const date = new Date(`${year}-${month}-${day}`);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date components. Conversion failed.');
    }
    return date;
  }

  private getPrnIndex(referenceNumber: string) {
    const prnArray = this._mapPrnObjectsToFaktoringObjects(this._prnArray());
    return prnArray.findIndex(obj => obj.referencjaKG === referenceNumber);
  }

  private _retrieveUnusedElement(
    currencyAmount: number,
    leftoverArray: LeftOverObject[],
    exchangeRate: number,
    referencjaKG: string,
    naDzien: string,
    konto: string,
    subkonto: string,
    mpk: string
  ) {
    const kwotaWZl = exchangeRate * currencyAmount;

    leftoverArray.unshift({
      referencjaKG,
      naDzien,
      kwotaWWalucie: currencyAmount,
      kwotaWZl,
      korekta: false,
      konto,
      subkonto,
      mpk,
    });
    return leftoverArray;
  }

  public getMismatchedAccounts(): { prn: { obj: FaktoringObject; index: number }; csv: { obj: FaktoringObject; index: number } } | null {
    const fromPrn = this._mapPrnObjectsToFaktoringObjects(this._prnArray());
    const fromCsv = this._csvArray();

    for (const prnObj of fromPrn) {
      if (!prnObj.konto || !prnObj.subkonto) continue;
      for (const csvObj of fromCsv) {
        if ((csvObj.konto && csvObj.konto != prnObj.konto) || (csvObj.subkonto && csvObj.subkonto != prnObj.subkonto)) {
          return {
            prn: {
              obj: prnObj,
              index: fromPrn.findIndex(v => v == prnObj),
            },
            csv: {
              obj: csvObj,
              index: fromCsv.findIndex(v => v == csvObj),
            },
          };
        }
      }
    }
    return null;
  }
}
