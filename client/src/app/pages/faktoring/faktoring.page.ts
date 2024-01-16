import { HttpClientModule } from '@angular/common/http';
import { Component, computed, effect, signal } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import {
    ButtonComponent,
    ErrorBoxComponent,
    FileDisplayComponent,
    FileDropZoneComponent,
    FinalTableComponent,
    IconButtonComponent,
    SectionComponent,
} from '@components';
import { FaktoringService, FileStorageService, FinalMergerObject, MergerObject, MergerService } from '@services';
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
    constructor(
        public fileStorage: FileStorageService,
        public faktoringService: FaktoringService,
        private mergerService: MergerService,
        private router: Router
    ) {}

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

    async onGenerateButtonClick(): Promise<void> {
        const prnData = this.faktoringService.processFaktoringData(this.formattedFile());
        if (!prnData) return;
        const processedData = this.mergerService.processData(prnData);

        setTimeout(() => {
            this.router.navigate([], { fragment: 'results' });
        }, 1000);

        if (!processedData) {
            this.tableData.set(null);
            this.unusedNegatives.set(NO_UNUSED_NEGATIVES_MESSAGE);
            return;
        }
        const [data, negatives] = processedData;
        this.tableData.set(data);
        if (negatives.length == 0) {
            this.unusedNegatives.set(NO_UNUSED_NEGATIVES_MESSAGE);
            return;
        }
        this.unusedNegatives.set(JSON.stringify(negatives));
    }

    readonly tableData = signal<FinalMergerObject[] | null>(null);
    readonly unusedNegatives = signal<string>(NO_UNUSED_NEGATIVES_MESSAGE);
    readonly hasAnyUnusedNegatives = computed(() => {
        return this.unusedNegatives() != NO_UNUSED_NEGATIVES_MESSAGE;
    });

    copyUnusedNegatives(): void {
        navigator.clipboard.writeText(this.unusedNegatives());
    }
}
