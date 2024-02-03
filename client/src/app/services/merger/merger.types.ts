

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
    Positive: "positiveAsBase",
    Negative: "negativeAsBase"
} as const
export type FaktoringMode = typeof FaktoringMode[keyof typeof FaktoringMode];

export const LeftoversFlag = {
    Positive: 'positive',
    Negative: 'negative',
    NoneLeft: 'none-left',
} as const;
export type LeftoversFlag = typeof LeftoversFlag[keyof typeof LeftoversFlag];