import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'pln',
    standalone: true,
})
export class PlnPipe implements PipeTransform {
    transform(value: number): string {
        return (
            (value ?? 0).toLocaleString('pl', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
                useGrouping: true,
            }) + ' zł'
        );
    }
}
