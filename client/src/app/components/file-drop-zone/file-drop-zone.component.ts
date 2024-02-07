import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, input } from '@angular/core';
import { coerceArrayProperty } from '@ardium-ui/devkit';

@Component({
    selector: 'app-file-drop-zone',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './file-drop-zone.component.html',
    styleUrl: './file-drop-zone.component.scss',
})
export class FileDropZoneComponent {
    @Output('upload') uploadEvent = new EventEmitter<File>();

    readonly accept = input<any, string>('*', { transform: v => coerceArrayProperty(v).join(',') });

    readFile(event: Event) {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (!file) {
            throw new Error('No file selected.');
        }
        this.uploadEvent.emit(file);
    }
}
