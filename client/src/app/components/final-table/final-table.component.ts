import { DecimalPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FinalMergerObject } from '@services';

@Component({
  selector: 'app-final-table',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './final-table.component.html',
  styleUrl: './final-table.component.scss'
})
export class FinalTableComponent {
    @Input({ required: true }) data!: FinalMergerObject[] | null;

    abs = Math.abs;
}
