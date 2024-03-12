import { DecimalPipe } from '@angular/common';
import { Component, input, ViewEncapsulation, signal, effect, ViewChild, ElementRef } from '@angular/core';
import { FinalFaktoringObject } from '@services';
import { IconComponent } from '../icon/icon.component';
import { ArdiumClickOutsideEventModule } from '@ardium-ui/devkit';
import { PlnPipe } from '@pipes';
import { ButtonComponent } from '../button/button.component';

@Component({
    selector: 'app-final-table',
    standalone: true,
    imports: [DecimalPipe, IconComponent, ArdiumClickOutsideEventModule, PlnPipe, ButtonComponent],
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
}
