import { DecimalPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { FinalFaktoringObject } from '@services';

@Component({
    selector: 'app-final-table',
    standalone: true,
    imports: [DecimalPipe],
    templateUrl: './final-table.component.html',
    styleUrl: './final-table.component.scss',
})
export class FinalTableComponent {
    readonly data = input.required<FinalFaktoringObject[] | null>();

    readonly abs = Math.abs;
}
