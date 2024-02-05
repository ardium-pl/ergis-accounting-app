

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

export const FaktoringMode = {
    positiveAsBase: "positiveAsBase",
    negativeAsBase: "negativeAsBase"
} as const
export type FaktoringMode = typeof FaktoringMode[keyof typeof FaktoringMode];