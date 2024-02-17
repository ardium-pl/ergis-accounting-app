import { CommonModule } from '@angular/common';
import { Component, Input, effect, input, signal } from '@angular/core';
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
    readonly dataArray = signal<PrnObject[]>([]);
    readonly dataHeaders = signal<PrnObject>({});

    readonly headers = input.required<string[]>();

    @Input({ required: true, alias: 'dataArray' })
    set _dataArray(v: PrnObject[]) {
        this.dataArray.set(v.slice(1));
        this.dataHeaders.set(v[0]);
    }

    jsdnf = effect(() => {
        console.log(this.headers());
    })

    deleteRow(index: number): void {
        const newArr = [...this.dataArray()];
        newArr.splice(index, 1);
        this.dataArray.set(newArr);
    }

    updateCellValue(item: PrnObject, key: string, event: Event): void {
        const value = (event.target as HTMLDivElement).textContent || '';
        item[key] = value;
    }
}
