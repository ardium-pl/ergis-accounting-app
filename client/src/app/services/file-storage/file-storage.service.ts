import { Injectable, signal } from '@angular/core';
import { computed } from '@angular/core';
import { isDefined } from 'simple-bool';

@Injectable({
    providedIn: 'root',
})
export class FileStorageService {
    constructor() {}

    readonly file = signal<File | undefined>(undefined);
    readonly fileContent = signal<string | null>(null);
    readonly fileBuffer = signal<ArrayBuffer | null>(null);
    readonly fileType = signal<string | null>(null);
    readonly isLoaded = computed(() => isDefined(this.file()))

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
    reset(): void {
        this.file.set(undefined);
        this.fileBuffer.set(null);
        this.fileContent.set(null);
        this.fileType.set(null);
    }
}
