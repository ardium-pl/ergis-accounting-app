import { Injectable, signal } from '@angular/core';
import { computed } from '@angular/core';
import { isDefined } from 'simple-bool';

@Injectable({
    providedIn: 'root',
})
export class FileStorageService {
    constructor() {}

    // First file signals
    readonly file = signal<File | undefined>(undefined);
    readonly fileContent = signal<string | null>(null);
    readonly fileBuffer = signal<ArrayBuffer | null>(null);
    readonly fileType = signal<string | null>(null);
    readonly isLoaded = computed(() => isDefined(this.file()));

    // Second file signals
    readonly csvFile = signal<File | undefined>(undefined);
    readonly csvFileContent = signal<string | null>(null);
    readonly csvFileBuffer = signal<ArrayBuffer | null>(null);
    readonly csvFileType = signal<string | null>(null);

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
                  let textResult = e.target?.result as string;
  
                  const lines = textResult.split(/\r\n|\n/); 
                  const processedLines = lines.map(line => {
                      const values = line.split(';');
                      const processedValues = values.map(value => value.replace(/^"(.*)"$/, '$1')); // Removing quotes from each string value
                      return processedValues.join(';'); 
                  });
                  const processedResult = processedLines.join('\n'); // Joining all lines back together
  
                  this.csvFileContent.set(processedResult);
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
        this.fileBuffer.set(null);
        this.fileContent.set(null);
        this.fileType.set(null);
    }

    resetCsvFile(): void {
        this.csvFile.set(undefined);
    }
}
