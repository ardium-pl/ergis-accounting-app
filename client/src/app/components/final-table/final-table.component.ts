import { DecimalPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FinalFaktoringObject } from '@services';

@Component({
  selector: 'app-final-table',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './final-table.component.html',
  styleUrl: './final-table.component.scss'
})
export class FinalTableComponent {
    @Input({ required: true }) data!: FinalFaktoringObject[] | null;

    abs = Math.abs;
}
