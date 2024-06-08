
import { parseNumberWithThousandSeparator } from '@utils';
import { VatItem, VatSummary } from './vat-item';

export class RejZItem {
  public readonly lp!: number;
  public readonly referencja!: string;
  public readonly paczka!: string;
  public readonly typNumerVat!: string;
  public readonly dostawca!: string;

  public readonly faktura!: string;
  public readonly dataFaktury!: Date;

  public readonly vatItems!: VatItem[];
  public readonly vatSummary!: VatSummary;

  constructor(contentLines: string[], vatLines: string[]) {
    const line0 = contentLines[0].split(' ');
    const line1 = contentLines[1].split(' ');

    this.lp = parseNumberWithThousandSeparator(line0[0]);
    this.referencja = line0[1];
    this.paczka = line0[2];
    this.typNumerVat = line0[3];
    this.dostawca = line0[4];

    const dateIndex = line1.findIndex((v, i) => i !== 0 && /^\d\d\/\d\d\/\d\d$/.test(v))

    this.faktura = line1.slice(0, dateIndex).join(' ');
    this.dataFaktury = new Date('20' + line1[dateIndex]);

    if (isNaN(this.dataFaktury.valueOf())) {
      console.log(line0, line1);
    }

    const summaryLine = vatLines.pop()!;
    this.vatSummary = new VatSummary(summaryLine);
    this.vatItems = vatLines.map(l => new VatItem(l));
  }
}
