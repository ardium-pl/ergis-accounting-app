import { parseNumberWithThousandSeparator } from '@utils';

export class PZNItem {
  public readonly commission!: string;
  public readonly supplierNumber!: string;
  public readonly supplierName!: string;

  public readonly subitems: PZNSubitem[] = [];

  constructor(lines: string[]) {
    const line0 = lines.shift()!.split(' ');
    this.commission = line0.shift()!;
    this.supplierNumber = line0.shift()!;
    this.supplierName = line0.join(' ').replace(/\s+\*\s+kontynuu\s+\*$/i, '');

    for (let i = 0; i < lines.length; i++) {
      if (i === 0) continue;
      const line = lines[i];
      if (!/^ |^cmr/i.test(line)) {
        this.subitems.push(new PZNSubitem(lines.splice(0, i)));
        i = 0;
      }
    }
    if (lines.length) {
      this.subitems.push(new PZNSubitem(lines));
    }
  }
}

export class PZNSubitem {
  public readonly num!: number;
  public readonly specNum!: string;
  public readonly sendDate!: Date;
  public readonly receiveDate!: Date;
  public readonly dokDost!: number;
  public readonly wylKosztKG!: number;
  public readonly zewnPodatekZZ!: number;
  public readonly odchKGZZ!: number;
  public readonly opcjaERS!: string;
  public readonly currencyInfo?: PZNCurrencyData;

  constructor(lines: string[]) {
    const line0 = lines[0].split(/ +/);
    const line1 = lines[1].split(/ +/);

    this.specNum = line0[0];
    this.num = parseNumberWithThousandSeparator(line0[1]);
    this.opcjaERS = line0[2];
    this.sendDate = new Date('20' + line0[3]);

    const receiveDateIndex = line1.findIndex((v, i) => i !== 0 && /^\d\d\/\d\d\/\d\d$/.test(v));
    this.receiveDate = new Date('20' + line1[receiveDateIndex]);

    this.dokDost = parseNumberWithThousandSeparator(line0[4]);

    const offsetIfWAIsPresent = line0.length === 10 ? 1 : 0;

    this.wylKosztKG = parseNumberWithThousandSeparator(line0[6 + offsetIfWAIsPresent]);
    this.zewnPodatekZZ = parseNumberWithThousandSeparator(line0[7 + offsetIfWAIsPresent]);
    this.odchKGZZ = parseNumberWithThousandSeparator(line0[8 + offsetIfWAIsPresent]);

    if (lines[2]) {
      this.currencyInfo = new PZNCurrencyData(lines[2]);
    }
  }
}

export class PZNCurrencyData {
  public readonly original!: string;
  public readonly target!: string;
  public readonly rate!: number;

  constructor(currencyLine: string) {
    currencyLine = currencyLine.trim().replace('Kurs wym:', '').replace('= ', '');
    const parts = currencyLine.split(' ');

    this.original = parts[0].toUpperCase();
    this.target = parts[2].toUpperCase();
    this.rate = parseNumberWithThousandSeparator(parts[3]);
  }
}
