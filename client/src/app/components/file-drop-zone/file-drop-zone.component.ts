import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Output, computed, input, viewChild } from '@angular/core';
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
  @Output('upload') uploadEvent = new EventEmitter<File | File[]>();

  readonly accept = input<string, any>('*', { transform: v => coerceArrayProperty(v).join(',') });
  readonly acceptString = computed(() => this.accept().replaceAll(',', ', '));

  readonly maxFiles = input<number, any>(1, { transform: v => (v === 'any' ? Infinity : coerceNumberProperty(v)) });

  readonly inputEl = viewChild<undefined, ElementRef<HTMLInputElement>>('inputEl', { read: ElementRef });

  readFile(event: Event) {
    if (this.maxFiles() !== 1) {
      const files = Array.from((event.target as HTMLInputElement).files ?? []);
      if (files.length === 0) {
        throw new Error('No file selected.');
      }
      this.uploadEvent.emit(files);
      const inputEl = this.inputEl()?.nativeElement;
      if (inputEl) inputEl.value = '';
      return;
    }
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) {
      throw new Error('No file selected.');
    }
    this.uploadEvent.emit(file);
  }
}
