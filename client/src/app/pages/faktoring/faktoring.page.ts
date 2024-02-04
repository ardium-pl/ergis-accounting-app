import { DecimalPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, computed, signal } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FileSaverSaveMethod, FileSaverService } from '@ardium-ui/devkit';
import {
    ButtonComponent,
    ErrorBoxComponent,
    FileDisplayComponent,
    FileDropZoneComponent,
    FinalTableComponent,
    IconButtonComponent,
    SectionComponent,
    SelectComponent,
} from '@components';
import { FaktoringMode, FaktoringService, FileStorageService, FinalMergerObject, MergerService } from '@services';
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
        DecimalPipe,
        SelectComponent,
    ],
    providers: [FileSaverService],
    templateUrl: './faktoring.page.html',
    styleUrl: './faktoring.page.scss',
})
export class FaktoringPage {
    constructor(
        public fileStorage: FileStorageService,
        public faktoringService: FaktoringService,
        private mergerService: MergerService,
        private fileSystem: FileSaverService
    ) {}

    readonly FAKTORING_MODE_OPTIONS = [
        { value: FaktoringMode.Negative, label: 'Kwoty ujemne' },
        { value: FaktoringMode.Positive, label: 'Kwoty dodatnie' },
    ];

    faktoringMode: string = FaktoringMode.Positive;

    log(...args: any[]){ console.log(...args) }

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
    onNegativeValuesPaste(event: ClipboardEvent): void {
        const v = event.clipboardData!.getData('Text');
        this.onNegativeValuesBlur(v);
    }

    async onGenerateButtonClick(): Promise<void> {
        this.areResultsLoading.set(true);
        const prnData = await this.faktoringService.processFaktoringData(this.formattedFile());
        this.areResultsLoading.set(false);
        if (!prnData) return;
        const { positives: addedPositives, negatives: addedNegatives } = prnData;
        const processedData = this.mergerService.processData(addedPositives, addedNegatives, this.faktoringMode as FaktoringMode);

        setTimeout(() => {
            const element = document.getElementById('results')!;
            const headerOffset = 16;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth',
            });
        }, 0);

        if (!processedData) {
            this.tableData.set(null);
            this.unusedNegatives.set(NO_UNUSED_NEGATIVES_MESSAGE);
            this.unusedNegativesCount.set(null);
            return;
        }
        const [data, negatives] = processedData;
        this.tableData.set(data);
        if (negatives.length == 0) {
            this.unusedNegatives.set(NO_UNUSED_NEGATIVES_MESSAGE);
            this.unusedNegativesCount.set(null);
            return;
        }
        this.unusedNegatives.set(JSON.stringify(negatives));
        this.unusedNegativesCount.set(negatives.length);
    }

    readonly tableData = signal<FinalMergerObject[] | null>(null);
    readonly unusedNegatives = signal<string>(NO_UNUSED_NEGATIVES_MESSAGE);
    readonly unusedNegativesCount = signal<number | null>(null);
    readonly hasAnyUnusedNegatives = computed(() => {
        return this.unusedNegatives() != NO_UNUSED_NEGATIVES_MESSAGE;
    });

    downloadUnusedNegatives(): void {
        if (!this.hasAnyUnusedNegatives()) return;

        this.fileSystem.saveAs(this.unusedNegatives(), {
            fileName: 'nieużyte.txt',
            method: FileSaverSaveMethod.PreferFileSystem,
            types: [
                {
                    description: 'Plik tekstowy',
                    accept: { 'text/plain': ['.txt'] },
                },
                {
                    description: 'Plik JSON',
                    accept: { 'application/json': ['.json', '.jsonc'] },
                },
            ],
        });
    }
}
