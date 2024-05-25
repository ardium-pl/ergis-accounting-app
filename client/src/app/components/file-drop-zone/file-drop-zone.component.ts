import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, computed, input } from '@angular/core';
import { coerceArrayProperty, coerceNumberProperty } from '@ardium-ui/devkit';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-file-drop-zone',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './file-drop-zone.component.html',
  styleUrl: './file-drop-zone.component.scss',
})
export class FileDropZoneComponent {
  @Output('upload') uploadEvent = new EventEmitter<File>();

  readonly accept = input<string, any>('*', { transform: v => coerceArrayProperty(v).join(',') });
  readonly acceptString = computed(() => this.accept().replaceAll(',', ', '));

  readonly maxFiles = input<number, any>(1, { transform: v => (v === 'any' ? Infinity : coerceNumberProperty(v)) });

  readFile(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) {
      throw new Error('No file selected.');
    }
    this.uploadEvent.emit(file);
  }
}
