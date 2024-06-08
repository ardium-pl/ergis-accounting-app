import { parseNumberWithThousandSeparator } from "@utils";


export class VatItem {
  public readonly netValue!: number;
  public readonly vat!: string;
  public readonly vatPercent!: number;
  public readonly vatValue!: number;

  constructor(vatLine: string) {
    const lineParts = vatLine.split(' ');
    this.netValue = parseNumberWithThousandSeparator(lineParts[0]);
    this.vat = lineParts[1];
    this.vatPercent = parseNumberWithThousandSeparator(lineParts[2].replace('%', ''));
    this.vatValue = parseNumberWithThousandSeparator(lineParts[3]);
  }
}

export class VatSummary {
  public readonly netValue!: number;
  public readonly vatValue!: number;
  public readonly grossValue!: number;

  constructor(summaryLine: string) {
    const lineParts = summaryLine.split(' ');
    this.netValue = parseNumberWithThousandSeparator(lineParts[0]);
    this.vatValue = parseNumberWithThousandSeparator(lineParts[1]);
    this.grossValue = parseNumberWithThousandSeparator(lineParts[2]);
  }
}