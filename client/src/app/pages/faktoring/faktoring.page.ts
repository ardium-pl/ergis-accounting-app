import { HttpClientModule } from '@angular/common/http';
import { Component, computed, signal } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
    ButtonComponent,
    ErrorBoxComponent,
    FileDisplayComponent,
    FileDropZoneComponent,
    FinalTableComponent,
    IconButtonComponent,
    SectionComponent,
} from '@components';
import { FileStorageService, GptService, MergerService } from '@services';
import { ErrorBoxType } from 'src/app/components/error-box/error-box.types';

const NO_UNUSED_NEGATIVES_MESSAGE = '\nWszystkie pozycje zostały wykorzystane!';

@Component({
    selector: '_faktoring-page',
    standalone: true,
    imports: [
        SectionComponent,
        FileDropZoneComponent,
        FileDisplayComponent,
        MatProgressSpinnerModule,
        ButtonComponent,
        ErrorBoxComponent,
        HttpClientModule,
        FinalTableComponent,
        IconButtonComponent,
    ],
    templateUrl: './faktoring.page.html',
    styleUrl: './faktoring.page.scss',
})
export class FaktoringPage {
    constructor(public fileStorage: FileStorageService, public gptService: GptService, private mergerService: MergerService) {}

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
        if (!text) return '';
        const startPattern = '---------------------------- -------- -------------- --------';
        const startIndex = text.indexOf(startPattern) + startPattern.length;
        const endIndex = text.lastIndexOf('faktoring') + 'faktoring'.length;

        let formatted = text;
        if (startIndex > startPattern.length - 1 && endIndex > 'faktoring'.length - 1 && endIndex > startIndex) {
            formatted = formatted.substring(startIndex, endIndex);
        }
        formatted = formatted
            .trim()
            .split('\n')
            .map(v => v.trim())
            .join('\n');
        return formatted;
    });

    results = true;
    readonly areResultsLoading = signal(false);
    readonly wasNegativesTouched = signal(false);

    readonly errorBoxState = computed<ErrorBoxType>(() => {
        if (!this.wasNegativesTouched()) return ErrorBoxType.Info;
        if (!this.isWrongFormat()) {
            return ErrorBoxType.Error;
        }
        if (this.mergerService.negativesData().length == 0) {
            ErrorBoxType.Error;
        }
        return ErrorBoxType.Success;
    });
    readonly isWrongFormat = this.mergerService.isNegativeDataValid;

    onNegativeValuesBlur(v: string): void {
        this.wasNegativesTouched.set(true);
        this.mergerService.setNegativesData(v);
    }

    onGenerateButtonClick(): void {
        this.gptService.fetchGptData(this.formattedFile());
    }

    readonly tableData = computed(() => {
        const processedData = this.mergerService.processedData();
        if (!processedData) {
            return null;
        }
        const [data] = processedData;
        return data;
    });
    readonly unusedNegatives = computed(() => {
        const processedData = this.mergerService.processedData();
        if (!processedData) {
            return NO_UNUSED_NEGATIVES_MESSAGE;
        }
        const [_, negatives] = processedData;
        if (negatives.length == 0) {
            return NO_UNUSED_NEGATIVES_MESSAGE;
        }
        return JSON.stringify(negatives);
    });
    readonly hasAnyUnusedNegatives = computed(() => {
        return this.unusedNegatives() != NO_UNUSED_NEGATIVES_MESSAGE;
    });

    copyUnusedNegatives(): void {
        navigator.clipboard.writeText(this.unusedNegatives());
    }
}
