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
import { FaktoringMode, FaktoringObject, FaktoringService, FileStorageService, FinalFaktoringObject, PrnReaderService, CsvParserService } from '@services';
import { parseYesNo, randomBetween, sleep } from '@utils';
import { ErrorBoxType } from 'src/app/components/error-box/error-box.types';
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

    private readonly pastData = new JsonDataStore<FaktoringObject>(v => {
        return {
            referencjaKG: v['referencjaKG'],
            naDzien: v['naDzien'],
            kwotaWWalucie: v['kwotaWWalucie'],
            kwotaWZl: v['kwotaWZł'] ?? v['kwotaWZl'],
            korekta: parseYesNo(v['korekta']),
        };
    });

    readonly FAKTORING_MODE_OPTIONS = [
        { value: FaktoringMode.Negative, label: 'Kwoty ujemne' },
        { value: FaktoringMode.Positive, label: 'Kwoty dodatnie' },
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

    private parseCsvContent(): FaktoringObject[] {
        const csvContent = this.fileStorage.csvFileContent();

        if (csvContent != null) {
            const parsedEntries = this.csvParser.parseCsv(csvContent);

            if (parsedEntries && this.isValidFaktoringObjectArray(parsedEntries)) {
                return parsedEntries;
            } else {
                throw new Error('CSV data is not in the correct format.');
            }
        }
        throw new Error('No CSV content available or content is invalid.');
    }

    private isValidFaktoringObjectArray(parsedEntries: any[]): parsedEntries is FaktoringObject[] {
        console.log(parsedEntries);
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

    readonly formattedFile = computed(() => {
        return this.prnReader.getPrnDataString(this.fileStorage.fileContent());
    });

    readonly areResultsLoading = signal(false);

    async onGenerateButtonClick(): Promise<void> {

        console.log(this.parseCsvContent());

        const prnContent = this.fileStorage.fileContent();
        if (!prnContent) return;

        this.areResultsLoading.set(true);
        // sleep for a short while so that if an error is thrown, the results aren't immediate
        await sleep(500);
        const processedData = this.faktoringService.processData(prnContent, this.parseCsvContent(), this.faktoringMode as FaktoringMode);
        // sleep a short random amount of time to give the illusion of a complex algorithm creating the results
        await sleep(randomBetween(4e3, 8e3));
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

    downloadLeftovers(): void {
        if (!this.hasAnyLeftovers()) return;

        this.fileSystem.saveAs(this.leftovers(), {
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
