

export const ErrorBoxType = {
    Error: 'error',
    Info: 'info',
    Success: 'success',
    Warning: 'warning',
} as const;
export type ErrorBoxType = typeof ErrorBoxType[keyof typeof ErrorBoxType];