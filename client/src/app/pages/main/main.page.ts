import { Component } from '@angular/core';
import { FileDisplayComponent, FileDropZoneComponent, SectionComponent } from '@components';
import { FileStorageService } from '@services';

@Component({
    selector: 'app-main',
    standalone: true,
    imports: [
        SectionComponent,
        FileDropZoneComponent,
        FileDisplayComponent,
    ],
    templateUrl: './main.page.html',
    styleUrl: './main.page.scss'
})
export class MainPage {

    constructor(public fileStorage: FileStorageService) {}

    onFileUpload(file: File): void {
        if (file.size > 10 * 1024 * 1024) {
            alert('Plik musi być mniejszy niż 10 MB');
            return;
        }
        if (!file.name.toLowerCase().endsWith('.prn')) {
            alert('Plik musi być typu .prn');
            return;
        }
        this.fileStorage.setFile(file);
    }

    onNegativeValuesInput(v: string): void {
        
    }
}
