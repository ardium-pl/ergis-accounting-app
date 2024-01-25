import { HttpClientModule } from '@angular/common/http';
import { Component, computed, signal, effect, ViewChild, ElementRef } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ButtonComponent, ErrorBoxComponent, FileDisplayComponent, FileDropZoneComponent, FinalTableComponent, IconButtonComponent, SectionComponent } from '@components';
import { FileStorageService, FinalMergerObject, GptService, MergerService, PrnObject } from '@services';
import { ErrorBoxType } from 'src/app/components/error-box/error-box.types';
import { PrnReaderService } from 'src/app/services/prn-reader/prn-reader.service';

const NO_UNUSED_NEGATIVES_MESSAGE = '\nWszystkie pozycje zostały wykorzystane!';

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
        IconButtonComponent,
    ],
    templateUrl: './main.page.html',
    styleUrl: './main.page.scss'
})
export class MainPage {

    constructor(
        public fileStorage: FileStorageService,
        public gptService: GptService,
        private mergerService: MergerService,
        private prnReader: PrnReaderService,
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

    readonly formattedFile = computed<PrnObject[] | null>(() => {
        const content = this.fileStorage.fileContent();
        if (!content) return null;
        return this.prnReader.readPrn(content);
    });
    readonly foo = effect(() => {
        console.log(JSON.stringify(this.formattedFile()?.[0], null, 4));
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
            ErrorBoxType.Error
        }
        return ErrorBoxType.Success;
    });
    readonly isWrongFormat = this.mergerService.isNegativeDataValid;

    onNegativeValuesBlur(v: string): void {
        this.wasNegativesTouched.set(true);
        this.mergerService.setNegativesData(v);
    }

    onGenerateButtonClick(): void {
        // this.gptService.fetchGptData(this.formattedFile());
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


const rezultat = {
    "Referencja KG": "JL231130jza057",
    "Lp": "4",
    "Konto": "141",
    "Subkonto": "14130",
    "MPK": "0000",
    "ID": "jza",
    "Na dzień": "23/11/30",
    "Data wpr": "23/12/05",
    "Wal": "PLN",
    "Kwota w walucie": "0.00",
    "Kwota": "2,871.57",
    "WN": "2,871.57",
    "MA": "0.00",
    "Kor.": "Nie",
    "TT": "",
    "Dokument": "JL231130jza057",
    "Numer indeksu": "",
    "ZS/ZP": "",
    "Data pod": "",
    "Paczka": "",
    "Opis": "Wycen.WB 11/2023",
    "Adres": "",
    "Ko": "",
    "Sort Nazwa": "",
    "Projekt": "",
    "Zlec robocze": "",
    "Magazyn": ""
}