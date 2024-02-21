import { DecimalPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, computed, effect, signal } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FileSaverSaveMethod, FileSaverService } from '@ardium-ui/devkit';
import {
    ButtonComponent,
    EditableDataTableComponent,
    ErrorBoxComponent,
    FileDisplayComponent,
    FileDropZoneComponent,
    FinalTableComponent,
    IconButtonComponent,
    SectionComponent,
    SelectComponent,
} from '@components';
import { CsvParserService, FaktoringMode, FaktoringObject, FaktoringService, FileStorageService, FinalFaktoringObject, PrnReaderService } from '@services';
import { parseYesNo, randomBetween, sleep } from '@utils';
import { JsonDataStore } from 'src/app/utils/json-data-store';

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
        EditableDataTableComponent,
    ],
    providers: [FileSaverService, PrnReaderService, CsvParserService],
    templateUrl: './faktoring.page.html',
    styleUrl: './faktoring.page.scss',
})
export class FaktoringPage {
    constructor(
        public fileStorage: FileStorageService,
        public faktoringService: FaktoringService,
        private fileSystem: FileSaverService,
        private prnReader: PrnReaderService,
        private csvParser: CsvParserService
    ) {}

    readonly FAKTORING_MODE_OPTIONS = [
        { value: FaktoringMode.Negative, label: 'Ujemne' },
        { value: FaktoringMode.Positive, label: 'Dodatnie' },
    ];
    faktoringMode: string = FaktoringMode.Negative;

    onPrnFileUpload(file: File): void {
        if (file.size > 10 * 1024 * 1024) {
            alert('Plik musi być mniejszy niż 10 MB');
            return;
        }
        if (!file.name.toLowerCase().endsWith('.prn')) {
            alert('Plik musi być typu .prn');
            return;
        }

        this.fileStorage.setFile(file);

        this.isPrnLoading.set(true);
        setTimeout(() => {
            this.isPrnLoading.set(false);
        }, 500);
    }
    onCsvFileUpload(file: File): void {
        if (file.size > 10 * 1024 * 1024) {
            alert('Plik musi być mniejszy niż 10 MB');
            return;
        }
        if (!file.name.toLowerCase().endsWith('.csv')) {
            alert('Plik musi być typu .csv');
            return;
        }
        this.fileStorage.setCsvFile(file);
    }

    private isValidFaktoringObjectArray(parsedEntries: any[]): parsedEntries is FaktoringObject[] {
        if (!Array.isArray(parsedEntries) || parsedEntries.length === 0) {
            return false;
        }
        return parsedEntries.every(
            entry =>
                entry.hasOwnProperty('referencjaKG') &&
                entry.hasOwnProperty('naDzien') &&
                entry.hasOwnProperty('kwotaWWalucie') &&
                entry.hasOwnProperty('kwotaWZl') &&
                entry.hasOwnProperty('korekta')
        );
    }

    readonly isPrnLoading = signal<boolean>(false);

    readonly prnArray = computed(() => {
        const fileContent = this.fileStorage.fileContent();
        if (typeof fileContent === 'string') {
            return this.prnReader.readPrn(fileContent);
        }
        return [];
    });
    readonly prnHeaders = computed(() => {
        const fileContent = this.fileStorage.fileContent();
        if (typeof fileContent === 'string') {
            return this.prnReader.readPrnHeaders(fileContent);
        }
        return [];
    });

    readonly csvArray = computed<FaktoringObject[]>(() => {
        const csvContent = this.fileStorage.csvFileContent();

        if (csvContent) {
            const parsedEntries = this.csvParser.parseCsv(csvContent);

            if (parsedEntries && this.isValidFaktoringObjectArray(parsedEntries)) {
                return parsedEntries;
            } else {
                throw new Error('CSV data is not in the correct format.');
            }
        }
        if (csvContent != null) throw new Error('No CSV content available or content is invalid.');
        return [];
    });

    private convertStringToNumber(value: string): number {
        return parseFloat(value.replace(/\s+/g, '').replace(',', '.'));
      }

    readonly areResultsLoading = signal(false);

    async onGenerateButtonClick(): Promise<void> {
        const prn = this.prnArray();
        if (!prn.length) return;

        this.areResultsLoading.set(true);
        // sleep for a short while so that if an error is thrown, the results aren't immediate
        await sleep(500);
        const processedData = this.faktoringService.processData(prn, this.csvArray(), this.faktoringMode as FaktoringMode);
        // sleep a short random amount of time to give the illusion of a complex algorithm creating the results
        if (!window.location.href.includes('localhost')) await sleep(randomBetween(4e3, 8e3));
        this.areResultsLoading.set(false);

        // scroll to errors after the section gets rendered
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

        // notify the user there is no data generated
        if (!processedData) {
            this.tableData.set(null);
            this.leftovers.set(NO_UNUSED_NEGATIVES_MESSAGE);
            this.leftoversCount.set(null);
            return;
        }
        // now there is some data, split it into the table portion and unused entries portion
        const [data, leftovers] = processedData;
        this.tableData.set(data);
        // if there are no unused entries, display the appropriate message
        if (leftovers.length == 0) {
            this.leftovers.set(NO_UNUSED_NEGATIVES_MESSAGE);
            this.leftoversCount.set(null);
            return;
        }
        // there are some unused entries - allow for them to be downloaded
        this.leftovers.set(JSON.stringify(leftovers));
        this.leftoversCount.set(leftovers.length);
    }

    readonly tableData = signal<FinalFaktoringObject[] | null>(null);
    readonly leftovers = signal<string>(NO_UNUSED_NEGATIVES_MESSAGE);
    readonly leftoversCount = signal<number | null>(null);
    readonly hasAnyLeftovers = computed(() => {
        return this.leftovers() != NO_UNUSED_NEGATIVES_MESSAGE;
    });

    private jsonToCsv(jsonString: string): string {
        const jsonData = JSON.parse(jsonString);

        if (!Array.isArray(jsonData) || jsonData.length === 0) {
            return '';
        }
        const headers = Object.keys(jsonData[0]);
        const csvData = [];
        csvData.push(headers.join(';'));
        csvData.push(...jsonData.map(row =>
            headers
                .map(fieldName =>
                    JSON.stringify(row[fieldName], (_, value) => (typeof value === 'string' ? value.replace(/"/g, '""') : value))
                )
                .join(';')
        ));

        return csvData.join('\r\n');
    }

    downloadLeftovers(): void {
        if (!this.hasAnyLeftovers()) return;
        const csvData = this.jsonToCsv(this.leftovers());
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });

        this.fileSystem.saveAs(blob, {
            fileName: 'nieużyte',
            method: FileSaverSaveMethod.PreferFileSystem,
            types: [
                {
                    description: 'Plik CSV',
                    accept: { 'text/csv': ['.csv'] },
                },
            ],
        });
    }
}
