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
  num: number; 
  reference: string; 
  package: string; 
  type: string; 
  vatNumber: string;
  supplier: string; 
  invoice: string; 
  invoiceDate: Date; 
  vatItems: VatItem[]; 
  vatSummary: VatSummary;
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

export type pznPrnData = {
  num: number;
  specNum: string;
  sendDate: string;
  receiveDate: Date;
  dokDost: number;
  wylKosztKG: number;
  zewnPodatekZZ: number;
  odchKGZZ: number;
  currencyInfo: PZNCurrencyData;
}

type PZNCurrencyData = {
  original: string;
  target: string;
  rate: number;
}