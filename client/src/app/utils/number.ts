


export function formatNumber(num: number, fractionDigits: number = 2): string {
    return (num ?? 0).toLocaleString('pl', {
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
        useGrouping: false,
    });
}