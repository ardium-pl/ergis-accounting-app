import { HttpClientModule } from '@angular/common/http';
import { Component, computed, signal, effect } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ButtonComponent, ErrorBoxComponent, FileDisplayComponent, FileDropZoneComponent, FinalTableComponent, SectionComponent } from '@components';
import { FileStorageService, FinalMergerObject, GptService, MergerService } from '@services';
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
        HttpClientModule,
        FinalTableComponent,
    ],
    templateUrl: './main.page.html',
    styleUrl: './main.page.scss'
})
export class MainPage {

    constructor(
        public fileStorage: FileStorageService,
        public gptService: GptService,
        private mergerService: MergerService,
    ) { }

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
    readonly areResultsLoading = signal(false);
    readonly wasNegativesTouched = signal(false);

    readonly errorBoxState = computed<ErrorBoxType>(() => {
        if (!this.wasNegativesTouched()) return ErrorBoxType.Info;
        if (!this.mergerService.isNegativeDataValid()) {
            return ErrorBoxType.Error;
        }
        if (this.mergerService.negativesData().length == 0) {
            ErrorBoxType.Error
        }
        return ErrorBoxType.Success;
    });
    readonly isWrongFormat = this.mergerService.isNegativeDataValid;

    readonly errorBoxStateEffect = effect(() => {
    });

    onNegativeValuesBlur(v: string): void {
        this.mergerService.setNegativesData(v);
    }

    tableData: FinalMergerObject[] | null = [
        { referencjaKG: 'JL1', currencyCorrection: 200 },
        { referencjaKG: 'JL2', currencyCorrection: -100 },
        { referencjaKG: 'JL3', currencyCorrection: 0 },
        { referencjaKG: 'JL4', currencyCorrection: 50 },
    ];
    onGenerateButtonClick(): void {
        this.tableData = this.mergerService.processedData();
    }
}
