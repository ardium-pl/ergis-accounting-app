import { Component, computed, signal } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ButtonComponent, ErrorBoxComponent, FileDisplayComponent, FileDropZoneComponent, SectionComponent } from '@components';
import { FileStorageService } from '@services';
import { ErrorBoxType } from 'src/app/components/error-box/error-box.types';

@Component({
    selector: 'app-main',
    standalone: true,
    imports: [
        SectionComponent,
        FileDropZoneComponent,
        FileDisplayComponent,
        MatProgressSpinnerModule,
        ButtonComponent,
        ErrorBoxComponent,
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

    results = true;
    areResultsLoading = signal(false);

    isButtonDisabled = signal(true);
    errorBoxState = signal<ErrorBoxType>(ErrorBoxType.Info);
    isWrongFormat = signal(false);

    gptResponse = signal("");

    onNegativeValuesInput(v: string): void {
        this.isButtonDisabled.set(v.length == 0);
    }
    onNegativeValuesBlur(v: string): void {
        this.errorBoxState.set(v.length == 0 ? ErrorBoxType.Error : ErrorBoxType.Success);
        try {
            JSON.parse(v);
            this.isWrongFormat.set(false);
        } catch (err) {
            this.isWrongFormat.set(true);
            this.errorBoxState.set(ErrorBoxType.Error);
        }
    }
}
