import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'app-file-drop-zone',
    standalone: true,
    imports: [
        CommonModule,
    ],
    templateUrl: './file-drop-zone.component.html',
    styleUrl: './file-drop-zone.component.scss'
})
export class FileDropZoneComponent {

    @Output('upload') uploadEvent = new EventEmitter<File>();

    readFile(event: Event) {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (!file) {
            throw new Error('No file selected.');
        }
        this.uploadEvent.emit(file);
    }
}
