import { csvRawRecord } from './jpk.types';

export const requiredKeys = [
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
] as const;

export function isCsvRecord(record: any): record is csvRawRecord {
  return requiredKeys.every(key => key in record);
}
