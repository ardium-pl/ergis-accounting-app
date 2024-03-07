

export function parseNumber(str: string | number): number {
    return typeof str === 'string' ? Number(str.replace(/\s/g, '').replaceAll(',', '')) : str;
}

export function parseYesNo(v: any): boolean {
    return v === true || v?.toLowerCase() === "yes";
}

export function randomBetween(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min) + 1) + min;
}