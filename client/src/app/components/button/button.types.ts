

export const ButtonAppearance = {
    Transparent: 'transparent',
    Raised: 'raised',
} as const;
export type ButtonAppearance = (typeof ButtonAppearance)[keyof typeof ButtonAppearance];
