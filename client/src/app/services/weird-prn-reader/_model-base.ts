import { parseNumberWithThousandSeparator } from '@utils';
import { VatItem, VatSummary } from './vat-item';

export abstract class _ModelBase {
  public readonly num!: number; // Lp
  public readonly reference!: string; // Referencja
  public readonly package!: string; // Paczka
  public readonly type!: string; // Typ
  public readonly vatNumber!: string | null; // Numer VAT
  public readonly supplier!: string; // Dostawca

  public readonly invoice!: string; // Faktura
  public readonly invoiceDate!: Date; // Data fak

  public readonly vatItems!: VatItem[]; // podsumowanie finansowe (po prawej stronie każdego itemu)
  public readonly vatSummary!: VatSummary;

  protected _invoiceDateIndex!: number;

  constructor(contentLines: string[], vatLines: string[]) {
    const line0 = contentLines[0].split(/ +/);
    const line1 = contentLines[1].split(/ +/);

    this.num = parseNumberWithThousandSeparator(line0[0]);
    this.reference = line0[1];
    this.package = line0[2];
    this.type = line0[3];

    if (line0.length === 6) {
      this.vatNumber = line0[4];
      this.supplier = line0[5];
    } else {
      this.vatNumber = null;
      this.supplier = line0[4];
    }

    this._invoiceDateIndex = line1.findIndex((v, i) => i !== 0 && /^\d\d\/\d\d\/\d\d$/.test(v));

    this.invoice = line1.slice(0, this._invoiceDateIndex).join(' ');
    this.invoiceDate = new Date('20' + line1[this._invoiceDateIndex]);

    const summaryLine = vatLines.pop()!;
    this.vatSummary = new VatSummary(summaryLine);
    this.vatItems = vatLines.map(l => new VatItem(l));
  }
}
