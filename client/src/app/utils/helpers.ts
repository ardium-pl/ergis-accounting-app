

export function parseNumber(str: string): number {
    return Number(str.replaceAll(',', ''));
}

export function parseYesNo(str: string): boolean {
    return str.toLowerCase() == "Yes";
}

export function randomBetween(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min) + 1) + min;
}