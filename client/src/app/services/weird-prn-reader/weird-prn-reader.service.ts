import { Injectable } from '@angular/core';
import { MAPZItem } from './mapz';
import { PZNItem } from './pzn';
import { RejZItem } from './rejz';
import { WNPZItem } from './wnpz';

@Injectable({
  providedIn: 'root',
})
export class WeirdPrnReaderService {
  
  readRejZ(rawPrnData: string): RejZItem[] {
    let lines = this._splitIntoLines(rawPrnData);
    lines = this._removeTopHeaderLines(lines, /^\s+Data raportu:/);
    lines = this._removeLinesBetween(lines, /^\s+Do przeniesienia:/, /^\s+Z przeniesienia:/);
    lines = this._removeLinesBetween(lines, /^\s*Rejestr VAT:/, /^\s+Data raportu:/);
    lines = this._removeTableHeaders(lines);
    lines = this._removeLinesBetween(lines, /^\s+=+$/, /^\s+1 /, 0, false);
    lines = this._removeLinesBetween(lines, /^\s+=+$/, /^\s+Wyj.cie: RejZ\d+$/, Math.max(lines.length - 100, 0));
    lines = this._removeLinesBetween(lines, /^\s+ID wsadu:/, /^\s+ID wsadu:/, lines.length - 2);
    const items = this._splitIntoItems(lines);
    const extractedVatItems = items.map(this._extractVatInfo);
    return extractedVatItems.map(data => new RejZItem(data[0], data[1]));
  }
  readMAPZ(rawPrnData: string): MAPZItem[] {
    let lines = this._splitIntoLines(rawPrnData);
    lines = this._removeTopHeaderLines(lines, /^\s+Data raportu:/);
    lines = this._removeLinesBetween(lines, /^\s+Do przeniesienia:/, /^\s+Z przeniesienia:/);
    lines = this._removeLinesBetween(lines, /^\s*Rejestr VAT:/, /^\s+Data raportu:/);
    lines = this._removeTableHeaders(lines);
    lines = this._removeLinesBetween(lines, /^ERGIS/, /^Strona:/);
    lines = this._removeLinesBetween(lines, /^\s+=+$/, /^\s+Wyj.cie: MA/, Math.max(lines.length - 100, 0));
    const items = this._splitIntoItems(lines);
    const extractedVatItems = items.map(this._extractVatInfo);
    return extractedVatItems.map(data => new MAPZItem(data[0], data[1]));
  }
  readWNPZ(rawPrnData: string): WNPZItem[] {
    let lines = this._splitIntoLines(rawPrnData);
    lines = this._removeTopHeaderLines(lines, /^\s+Data raportu:/);
    lines = this._removeLinesBetween(lines, /^\s+Do przeniesienia:/, /^\s+Z przeniesienia:/);
    lines = this._removeLinesBetween(lines, /^\s*Rejestr VAT:/, /^\s+Data raportu:/);
    lines = this._removeTableHeaders(lines);
    lines = this._removeLinesBetween(lines, /^ERGIS/, /^Strona:/);
    lines = this._removeLinesBetween(lines, /^\s+=+$/, /^\s+Wyj.cie: MA/, Math.max(lines.length - 100, 0));
    const items = this._splitIntoItems(lines);
    const extractedVatItems = items.map(this._extractVatInfo);
    return extractedVatItems.map(data => new WNPZItem(data[0], data[1]));
  }
  readPZN(rawPrnData: string): PZNItem[] {
    let lines = this._splitIntoLines(rawPrnData);
    lines = this._removeLinesBetween(lines, /^\s*.?ERGIS/, /^Strona:/);
    lines = this._removePZNTableHeaders(lines);
    lines = this._removePZNSummaries(lines);
    lines = this._removeLinesBetween(lines, /^\s+={5,}/, /^\s+Wyj.cie: PZ/, Math.max(lines.length - 100, 0));
    const items = this._splitPZNIntoItems(lines);
    return items.map(itemLines => new PZNItem(itemLines));
  }

  private _splitIntoLines(str: string): string[] {
    return str
      .split(/\n+/)
      .map(l => l.trimEnd())
      .filter(l => l);
  }
  private _removeTopHeaderLines(lines: string[], endPattern: RegExp): string[] {
    const endIndex = lines.findIndex(l => endPattern.test(l));
    lines.splice(0, endIndex + 1);
    return lines;
  }
  private _removeLinesBetween(
    lines: string[],
    startPattern: RegExp,
    endPattern: RegExp,
    minStartIndexIndex: number = 0,
    deleteEndLine: boolean = true
  ): string[] {
    let deleteStartIndex = -1;
    let deleteCount = 0;
    for (let i = minStartIndexIndex; i < lines.length; i++) {
      const line = lines[i];
      if (deleteStartIndex === -1 && startPattern.test(line)) {
        deleteStartIndex = i;
        deleteCount++;
      }
      if (deleteStartIndex !== -1 && !endPattern.test(line)) {
        deleteCount++;
      }
      if (endPattern.test(line)) {
        lines.splice(deleteStartIndex, deleteCount - (deleteEndLine ? 0 : 1));
        i -= deleteCount;
        deleteStartIndex = -1;
        deleteCount = 0;
      }
    }

    return lines;
  }
  private _removeTableHeaders(lines: string[]): string[] {
    return this._removeLinesBetween(lines, /^\s+Lp/, /^-+$/);
  }
  private _removePZNTableHeaders(lines: string[]): string[] {
    lines = this._removeLinesBetween(lines, /^Zlec./, /^-{5,}/, 0, false);
    return this._removeLinesBetween(lines, /^Dok PZ/, /^-{5,}/);
  }
  private _splitIntoItems(lines: string[]): string[][] {
    const lineItems: string[][] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (i !== 0 && /^ {0,4}\d+ /.test(line)) {
        const newItem = lines.splice(0, i);
        lineItems.push(newItem);
        i = 0;
      }
    }
    return lineItems;
  }
  private _extractVatInfo(lines: string[]): [string[], string[]] {
    const contentLines: string[] = [];
    const vatLines: string[] = [];

    const separatorLineIndex = lines.findIndex(l => /-+$/.test(l));
    const separatorLine = lines[separatorLineIndex];
    const separatorIndex = separatorLine.indexOf(' --');

    for (const line of lines) {
      const contentLine = line.slice(0, separatorIndex).trim().replace(/ {2,}/g, ' ');
      if (contentLine) contentLines.push(contentLine);

      const vatLine = line.slice(separatorIndex).trim().replace(/ {2,}/g, ' ');
      if (vatLine && !/^-+$/.test(vatLine)) vatLines.push(vatLine);
    }
    return [contentLines, vatLines];
  }
  private _removePZNSummaries(lines: string[]): string[] {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (/^\s+ZZ Razem|^\s+Raport razem podst/.test(line)) {
        i--;
        lines.splice(i, 3);
      }
    }
    return lines;
  }
  private _splitPZNIntoItems(lines: string[]): string[][] {
    const lineItems: string[][] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (i !== 0 && /^--------/.test(line)) {
        const newItem = lines.splice(0, i);
        newItem.shift();
        lineItems.push(newItem);
        i = 0;
      }
    }
    return lineItems;
  }
}
