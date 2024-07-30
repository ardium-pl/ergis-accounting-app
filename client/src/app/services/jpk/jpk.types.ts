export type XmlRawRecord = {
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
  dokumentzakupu?: string
}

export type XmlReadyRecord = {
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
  dokumentzakupu: string
}

export type CsvRawRecord = {
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

export type CsvReadyRecord = {
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

export type RejzReadyRecord = {
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

export type PznReadyRecord = {
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

export type WnpzReadyRecord = {
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

export type MapzReadyRecord = {
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