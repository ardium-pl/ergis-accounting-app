export type xmlObject = {
  
}

export type xmlRawRecord = {
  lpzakupu: string;
  kodkrajunadaniatin: string;
  nazwadostawcy: string;
  nrdostawcy: string;
  dowodzakupu: string;
  datazakupu: string;
  k_40: string;
  k_41: string;
  k_42: string;
  k_43: string;
  k_44: string;
  k_45: string;
  k_46: string;
  k_47: string;
  datawplywu?: string;
}

export type xmlReadyRecord = {
  lpzakupu: string;
  kodkrajunadaniatin: string;
  nazwadostawcy: string;
  nrdostawcy: string;
  dowodzakupu: string;
  datazakupu: string;
  k_40: number;
  k_41: number;
  k_42: number;
  k_43: number;
  k_44: number;
  k_45: number;
  k_46: number;
  k_47: number;
  datawplywu?: string;
}

export type csvRawRecord = {
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

export type csvReadyRecord = {
  'Data płatności': string;
  'Data płatności ze skontem': string;
  Kompensaty: number;
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
  Przedpłaty: number;
  Rejestr: string;
  Skonto: number;
  'Status płatności': string;
  'Termin płatności': string;
  'Typ faktury': string;
  Waluta: string;
  'Wartość skonta': number;
  ZalacznikiTest: string;
};

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

export type rejzRawRecord = {
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

export type rejzReadyRecord = {
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

export type pznRawRecord = {
  commission: string;
  subitems: PZNSubitem[];
  supplierName: string;
  supplierNumber: string;
};

export type pznReadyRecord = {
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

export type wnpzRawRecord = {
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

export type wnpzReadyRecord = {
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
  invoiceAmount: number;
  netValue: number;
  vat: string;
  vatPercent: number;
  vatValue: number;
  invoice: string;
  invoiceDate: Date;
}

export type mapzRawRecord = {
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

export type mapzReadyRecord = {
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