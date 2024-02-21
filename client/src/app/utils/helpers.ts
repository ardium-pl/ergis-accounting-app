

export function parseNumber(str: string): number {
    return Number(str.replaceAll(',', ''));
}

export function parseCsvValue(str: string): number {
    return Number(str.replace(/\s/g, '').replaceAll(',', '.'));
}

export function parseYesNo(v: any): boolean {
    return v === true || v?.toLowerCase() === "yes";
}

export function randomBetween(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min) + 1) + min;
}