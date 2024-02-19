import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'pln',
    standalone: true,
})
export class PlnPipe implements PipeTransform {
    transform(value: number, fractionDigits: number = 2): string {
        return (
            (value ?? 0).toLocaleString('pl', {
                minimumFractionDigits: fractionDigits,
                maximumFractionDigits: fractionDigits,
                useGrouping: true,
            }) + ' zł'
        );
    }
}
