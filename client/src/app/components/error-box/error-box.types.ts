

export const ErrorBoxType = {
    Error: 'error',
    Info: 'info',
    Success: 'success',
} as const;
export type ErrorBoxType = typeof ErrorBoxType[keyof typeof ErrorBoxType];