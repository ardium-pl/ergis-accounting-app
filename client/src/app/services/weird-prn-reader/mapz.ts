import { _ModelBase } from "./_model-base";
import { PZItem } from "./pz-item";


export class MAPZItem extends _ModelBase {
  public readonly dataPod!: Date;
  public readonly naDzien!: Date;
  public readonly dataWplywu!: Date;

  public readonly pzItems: PZItem[] = [];

  constructor(contentLines: string[], vatLines: string[]) {
    super(contentLines, vatLines);
    
    const line1 = contentLines[1].split(' ');

    this.dataPod = new Date('20' + line1[this._invoiceDateIndex + 1]);
    this.naDzien = new Date('20' + line1[this._invoiceDateIndex + 2]);
    this.dataWplywu = new Date('20' + line1[this._invoiceDateIndex + 3]);

    for (const line of contentLines) {
      if (/PZ .+? \d\d\/\d\d\/\d\d /.test(line)) {
        this.pzItems.push(new PZItem(line));
      }
    }
  }
}