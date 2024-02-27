import { DecimalPipe } from '@angular/common';
import { Component, input, ViewEncapsulation, signal } from '@angular/core';
import { FinalFaktoringObject } from '@services';
import { IconComponent } from '../icon/icon.component';
import { ArdiumClickOutsideEventModule } from '@ardium-ui/devkit';
import { PlnPipe } from '@pipes';

@Component({
    selector: 'app-final-table',
    standalone: true,
    imports: [DecimalPipe, IconComponent, ArdiumClickOutsideEventModule, PlnPipe],
    templateUrl: './final-table.component.html',
    styleUrl: './final-table.component.scss',
    encapsulation: ViewEncapsulation.None,
})
export class FinalTableComponent {
    readonly data = input.required<FinalFaktoringObject[] | null>();

    readonly tooltipIndex = signal<number>(-1);

    toggleTooltip(index: number): void {
        if (this.tooltipIndex() === -1) {
            this.tooltipIndex.set(index);
            return;
        }
        this.tooltipIndex.set(-1);
    }
}
