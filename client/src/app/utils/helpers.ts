export function parseNumber(str: string | number): number {
  if (typeof str === 'number') {
    return str;
  }
  const separator = str.match(/([.,])\d+$/)?.[1];
  return Number(
    str
      .replace(/\s/g, '')
      .replace(new RegExp(`[^\\d${separator}\\-]`, 'g'), '')
      .replace(',', '.')
  );
}

export function parseYesNo(v: any): boolean {
  return v === true || v?.toLowerCase() === 'tak';
}

export function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + 1) + min;
}
