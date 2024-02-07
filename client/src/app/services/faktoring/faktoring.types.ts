


export type FaktoringObject = {
    referencjaKG: string;
    naDzien: string;
    kwotaWWalucie: number;
    kwotaWZl: number;
    korekta: boolean;
}

export type FinalFaktoringObject = {
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