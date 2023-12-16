import { Component, computed, effect } from '@angular/core';
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

    readonly formattedFile = computed(() => {
        const text = this.fileStorage.fileContent();
        const startPattern = "---------------------------- -------- -------------- --------";
        const startIndex = text.indexOf(startPattern) + startPattern.length;
        const endIndex = text.lastIndexOf("faktoring") + "faktoring".length;


        let formatted = text;
        if (startIndex > startPattern.length - 1 && endIndex > "faktoring".length - 1 && endIndex > startIndex) {
            formatted = formatted.substring(startIndex, endIndex);
        }
        formatted = formatted.trim().split('\n').map(v => v.trim()).join('\n');
        return formatted;
    });

    onNegativeValuesInput(v: string): void {
        
    }
}
