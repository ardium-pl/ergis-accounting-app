import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FileStorageService {
  constructor() {}

  file = signal<File | undefined>(undefined);
  fileContent = signal<string | null>(null);
    fileBuffer = signal<ArrayBuffer | null>(null);
    fileType = signal<string | null>(null);

  setFile(file: File, readAs: 'text' | 'binary' = 'text'): void {
    this.file.set(file);

    const reader = new FileReader();
    reader.onload = e => {
      switch (readAs) {
        case 'binary':
          this.fileBuffer.set(e.target?.result as ArrayBuffer);
          break;
        default:
          this.fileContent.set(e.target?.result as string);
          break;
      }
    };
    reader.onerror = () => {
      throw new Error('Error reading file.');
    };

    switch (readAs) {
      case 'binary':
        reader.readAsArrayBuffer(file);
        break;
      default:
        reader.readAsText(file);
        break;
      }
      
      this.fileType.set(file.name.split('.').at(-1)!.toLowerCase());
  }
  resetFile(): void {
    this.file.set(undefined);
  }
}
