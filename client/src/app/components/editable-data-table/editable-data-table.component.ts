import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AutoLengthDirective } from '@directives';
import { KeysPipe } from '@pipes';
import { PrnObject } from '@services';

@Component({
    selector: 'app-editable-data-table',
    standalone: true,
    imports: [CommonModule, FormsModule, KeysPipe, AutoLengthDirective],
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
