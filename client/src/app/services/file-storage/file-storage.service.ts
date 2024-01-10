import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileStorageService {

    constructor() { }

    file = signal<File | undefined>(undefined);
    fileContent = signal<string>("");
    
    setFile(file: File, readAs?: 'text' | 'binary'): void { //TODO implement readAs
        this.file.set(file);

        const reader = new FileReader();
        reader.onload = e => {
            this.fileContent.set(e.target?.result as string);
        };
        reader.onerror = () => {
            throw new Error('Error reading file.');
        };

        reader.readAsText(file);
    }
    resetFile(): void {
        this.file.set(undefined);
    }
}
