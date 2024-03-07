

export const IconButtonSize = {
    Big: 'big',
    Medium: 'medium',
} as const;
export type IconButtonSize = typeof IconButtonSize[keyof typeof IconButtonSize];