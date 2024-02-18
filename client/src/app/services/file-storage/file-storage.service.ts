import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FileStorageService {
  constructor() {}

  // First file signals
  file = signal<File | undefined>(undefined);
  fileContent = signal<string | null>(null);
  fileBuffer = signal<ArrayBuffer | null>(null);
  fileType = signal<string | null>(null);

  // Second file signals
  csvFile = signal<File | undefined>(undefined);
  csvFileContent = signal<string | null>(null);
  csvFileBuffer = signal<ArrayBuffer | null>(null);
  csvFileType = signal<string | null>(null);

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

  setCsvFile(file: File, readAs: 'text' | 'binary' = 'text'): void {
    this.csvFile.set(file);

    const reader = new FileReader();
    reader.onload = e => {
      switch (readAs) {
        case 'binary':
          this.csvFileBuffer.set(e.target?.result as ArrayBuffer);
          break;
        default:
          this.csvFileContent.set(e.target?.result as string);
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
    
    this.csvFileType.set(file.name.split('.').at(-1)!.toLowerCase());
  }
  
  resetFile(): void {
    this.file.set(undefined);
  }

  resetCsvFile(): void {
    this.csvFile.set(undefined);
  }
}
