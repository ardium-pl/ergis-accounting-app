import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'nmbr',
    standalone: true,
})
export class NumberPipe implements PipeTransform {
    transform(value: number, fractionDigits: number = 2): string {
        return (
            (value ?? 0).toLocaleString('pl', {
                minimumFractionDigits: fractionDigits,
                maximumFractionDigits: fractionDigits,
                useGrouping: false,
            })
        );
    }
}
