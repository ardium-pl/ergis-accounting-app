

export const TakAlboNie = {
    Tak: 'Tak',
    Nie: 'Nie',
} as const;
export type TakAlboNie = typeof TakAlboNie[keyof typeof TakAlboNie];

export type MergerObject = {
    referencjaKG: string;
    naDzien: string;
    kwotaWWalucie: number;
    kwotaWZł: number;
    korekta: TakAlboNie;
}

export type FinalMergerObject = {
    referencjaKG: string;
    currencyCorrection: number;
}