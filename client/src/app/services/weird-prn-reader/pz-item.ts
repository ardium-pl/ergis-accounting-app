import { parseNumberWithThousandSeparator } from "@utils";
export class PZItem {
  public readonly code!: string; // Kod PZ
  public readonly deliveryDate!: Date; // Data dostawy
  public readonly PZAmount!: number; // Ilość PZ
  public readonly PZAmountUnit!: string; // Jednostka ilości PZ
  public readonly invoiceAmount!: number; // Ilość faktura

  // PZ F2400635/2     24/03/27      1,962.0sz    FK      1,962.0
  constructor(pzItemStr: string) {
    const PZ = pzItemStr.split(/ +/);

    this.code = PZ[1];
    this.deliveryDate = new Date('20' + PZ[2]);
    
    const [_, PZAmount, PZAmountUnit] = PZ[3].match(/([-]?[0-9,.]+)([a-z]+)/i) ?? [];
    if (!PZAmount || !PZAmountUnit) {
      throw new Error('Cannot parse PZ amount or unit.');
    }

    this.PZAmount = parseNumberWithThousandSeparator(PZAmount);
    this.PZAmountUnit = PZAmountUnit.toLowerCase();
    
    this.invoiceAmount = parseNumberWithThousandSeparator(PZ[5]);
  }
}