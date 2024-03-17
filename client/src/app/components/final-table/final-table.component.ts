import { Component, ElementRef, ViewChild, ViewEncapsulation, effect, input, signal } from '@angular/core';
import { ArdiumClickOutsideEventModule } from '@ardium-ui/devkit';
import { NumberPipe, PlnPipe } from '@pipes';
import { FinalFaktoringObject } from '@services';
import { ButtonComponent } from '../button/button.component';
import { IconComponent } from '../icon/icon.component';
import { formatNumber } from 'src/app/utils/number';

@Component({
    selector: 'app-final-table',
    standalone: true,
    imports: [NumberPipe, IconComponent, ArdiumClickOutsideEventModule, PlnPipe, ButtonComponent],
    templateUrl: './final-table.component.html',
    styleUrl: './final-table.component.scss',
    encapsulation: ViewEncapsulation.None,
})
export class FinalTableComponent {
    constructor() {
        effect(() => {
            if (!this.isDetailsShown()) return;
            setTimeout(() => {
                this._mainContainer.nativeElement.scrollTo(9999, 0);
            }, 0);
        });
    }

    readonly data = input.required<FinalFaktoringObject[] | null>();

    @ViewChild('mainContainer')
    private readonly _mainContainer!: ElementRef<HTMLDivElement>;

    readonly tooltipIndex = signal<number>(-1);
    readonly isDetailsShown = signal<boolean>(false);

    toggleTooltip(index: number): void {
        if (this.tooltipIndex() !== index) {
            this.tooltipIndex.set(index);
            return;
        }
        this.tooltipIndex.set(-1);
    }
    toggleDetails(): void {
        this.isDetailsShown.update(v => !v);
    }

    readonly isCopying = signal(false);

    copyAsCsv(): void {
        if (this.isCopying()) return;

        const data = this.data();
        if (!data) return;

        // add all necessary headers
        const headers = [
            'Konto',
            'Subkonto',
            'Rozwinięcie',
            'Referencja',
            'Korekta',
            '',
            'Konto',
            'Subkonto',
            'Rozwinięcie',
            'Referencja',
            'Korekta',
        ];
        // add additional headers if needed
        if (this.isDetailsShown()) {
            headers.push(
                ...[
                    'Referencja',
                    'Kwota dod. (PLN)',
                    'Kwota uj. (PLN)',
                    'Korekta',
                    'Waluta - dod. (PLN)',
                    'Waluta - uj. (PLN)',
                    'Różnica kursów (PLN)',
                ]
            );
        }

        // map all data into an array of table cells
        const csvData = data.map(row => {
            // add all necessary cells
            const retArr = [
                row.currencyCorrection > 0 ? '750' : '751',
                '75210',
                '0d00',
                `RK ${row.referencjaKG}`,
                `${formatNumber(-row.currencyCorrection || 0)}`,
                row.konto,
                row.subkonto,
                row.mpk,
                `RK ${row.referencjaKG}`,
                `${formatNumber(row.currencyCorrection)}`,
            ];
            // add additional cells if needed
            if (this.isDetailsShown()) {
                retArr.push(
                    ...[
                        row.details.otherReference,
                        formatNumber(row.details.positiveAmount, 3),
                        formatNumber(row.details.negativeAmount, 3),
                        formatNumber(row.currencyCorrection, 3),
                        formatNumber(row.details.positiveRate, 4),
                        formatNumber(row.details.negativeRate, 4),
                        formatNumber(row.details.rateDifference, 4),
                    ]
                );
            }
            // map it to table cells
            return retArr.map(v => `<td>${v}</td>`).join('');
        });

        // finish mapping the whole table
        const tableString = `<table><thead><tr>${headers.map(v => `<td>${v}</td>`).join('')}</tr></thead><tbody>${csvData
            .map(v => `<tr>${v}</tr>`)
            .join('')}</tbody></table>`;

        window.navigator.clipboard.write([
            new ClipboardItem({
                'text/plain': tableString,
                'text/html': tableString,
            }),
        ]);

        this.isCopying.set(true);

        setTimeout(() => {
            this.isCopying.set(false);
        }, 5000);
    }
}
