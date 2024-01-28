

export function parseNumber(str: string): number {
    return Number(str.replaceAll(',', ''));
}

export function parseYesNo(str: string): boolean {
    return str.toLowerCase() == "yes";
}