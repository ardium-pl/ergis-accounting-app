

export const IconButtonSize = {
    VeryBig: 'very-big',
    Big: 'big',
    Medium: 'medium',
} as const;
export type IconButtonSize = typeof IconButtonSize[keyof typeof IconButtonSize];


export const IconButtonAppearance = {
    Transparent: 'transparent',
    Outlined: 'outlined',
} as const;
export type IconButtonAppearance = typeof IconButtonAppearance[keyof typeof IconButtonAppearance];