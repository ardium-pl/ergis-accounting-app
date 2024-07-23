export type xmlObject = {
  
}

export type xmlRecord = {
  
}

export type csvVerificationRecord = {
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
} & csvVerificationRecord;



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
  vatNumber: string | null;
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

type PZNSubitem = {
  dokDost: number;
  num: number;
  odchKGZZ: number;
  receiveDate: Date;
  sendDate: Date;
  specNum: string;
  opcjaERS: string;
  wylKosztKG: number;
  zewnPodatekZZ: number;
}

export type pznPrnData = {
  commission: string;
  subitems: PZNSubitem[];
  supplierName: string;
  supplierNumber: string;
  // currencyInfo: PZNCurrencyData;
};

export type pznObject = {
  commission: string,
  dokDost: number;
  num: number;
  odchKGZZ: number;
  receiveDate: Date;
  sendDate: Date;
  specNum: string;
  opcjaERS: string,
  wylKosztKG: number;
  zewnPodatekZZ: number;
  supplierName: string;
  supplierNumber: string;
}

type PZNCurrencyData = {
  original: string;
  target: string;
  rate: number;
};

type PZItem = {
  code: string;
  deliveryDate: Date;
  PZAmount: number;
  PZAmountUnit: string;
  invoiceAmount: number;
};

export type wnpzPrnData = {
  num: number;
  reference: string;
  package: string;
  type: string;
  vatNumber: string;
  supplier: string;
  dataPod: Date;
  naDzien: Date;
  dataWplywu: Date;
  pzItems: PZItem[];
  vatItems: VatItem[];
  invoice: string;
  invoiceDate: Date;
  vatSummary: VatSummary;
};

export type wnpzObject = {
  num: number;
  reference: string;
  package: string;
  type: string;
  vatNumber: string;
  supplier: string;
  dataPod: Date;
  naDzien: Date;
  dataWplywu: Date;
  code: string;
  deliveryDate: Date;
  PZAmount: number;
  // PZAmountUnit: string;
  invoiceAmount: number;
  netValue: number;
  vat: string;
  vatPercent: number;
  vatValue: number;
  invoice: string;
  invoiceDate: Date;
  // grossValue: number;
}

export type mapzPrnData = {
  dataPod: Date;
  dataWplywu: Date;
  invoice: string;
  invoiceDate: Date;
  naDzien: Date;
  num: number;
  package: string;
  pzItems: PZItem[];
  reference: string;
  supplier: string;
  type: string;
  vatItems: VatItem[]
  vatNumber: string;
  vatSummary: VatSummary;
}

export type mapzObject = {
  dataPod: Date;
  dataWplywu: Date;
  invoice: string;
  invoiceDate: Date;
  naDzien: Date;
  num: number;
  package: string;
  code: string;
  deliveryDate: Date;
  PZAmount: number;
  invoiceAmount: number;
  reference: string;
  supplier: string;
  type: string;
  netValue: number;
  vat: string;
  vatPercent: number;
  vatValue: number;
  vatNumber: string;
}