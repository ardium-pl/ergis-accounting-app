import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { KeysPipe } from '@pipes';
import { PrnObject } from '@services';
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
    @Input() dataArray: PrnObject[] = [];

    deleteRow(index: number): void {
        this.dataArray.splice(index, 1);
    }

    updateCellValue(item: PrnObject, key: string, event: Event): void {
        const value = (event.target as HTMLDivElement).textContent || '';
        item[key] = value;
    }
}
