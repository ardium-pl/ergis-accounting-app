import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { KeysPipe } from '@pipes';
import { FaktoringService } from '@services/faktoring';
import { PrnObject } from '@services/prn-reader';
import { IconButtonComponent } from '../icon-button/icon-button.component';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-editable-data-table',
  standalone: true,
  imports: [CommonModule, FormsModule, KeysPipe, IconButtonComponent, IconComponent],
  templateUrl: './editable-data-table.component.html',
  styleUrl: './editable-data-table.component.scss',
})
export class EditableDataTableComponent {
  private readonly faktoringService = inject(FaktoringService);

  readonly dataArray = input.required<PrnObject[]>();

  readonly headers = input.required<string[]>();

  deleteRow(index: number): void {
    this.faktoringService.removePrnRow(index);
  }

  updateCellValue(index: number, key: string, event: Event): void {
    const value = (event.target as HTMLDivElement).textContent || '';
    this.faktoringService.updatePrnRow(index, key, value);
  }
}
