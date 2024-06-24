export type csvVerifRecord = {
  'Data płatności': string;
  'Data płatności ze skontem': string;
  Kompensaty: string;
  Kontrahent: string;
  Lp: string;
  NIP: string;
  'Numer faktury': string;
  'Numer faktury korygowanej': string;
  'Numer referencyjny': string;
  'Numer wewnętrzny': string;
  'Numer własny': string;
  Opis: string;
  'Opis (dekretacja)': string;
  Przedpłaty: string;
  Rejestr: string;
  Skonto: string;
  'Status płatności': string;
  'Termin płatności': string;
  'Typ faktury': string;
  Waluta: string;
  'Wartość skonta': string;
  ZalacznikiTest: string;
};

export type readyVerifRecord = {
  'NIP i numer': string;
} & csvVerifRecord;

type VatItem = {
  netValue: number;
  vat: string;
  vatPercent: number;
  vatValue: number;
};

type VatSummary = {
  netValue: number;
  vatValue: number;
  grossValue: number;
};

export type rejzPrnData = {
  num: number; // Lp
  reference: string; // Referencja
  package: string; // Paczka
  type: string; // Typ
  vatNumber: string; // Numer VAT
  supplier: string; // Dostawca
  invoice: string; // Faktura
  invoiceDate: Date; // Data fak
  vatItems: VatItem[]; // podsumowanie finansowe (po prawej stronie każdego itemu)
  vatSummary: VatSummary;
  //_invoiceDateIndex!: number;
};

export type rejzObject = {
  num: number;
  reference: string;
  package: string;
  type: string;
  supplier: string;
  netValue: number;
  vatCode: string;
  vatPercent: number;
  vatValue: number;
  invoice: string;
  invoiceDate: Date;
};
