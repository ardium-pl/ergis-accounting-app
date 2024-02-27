import { DecimalPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, computed, signal } from '@angular/core';
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
import { FaktoringMode, FaktoringService, FinalFaktoringObject } from '@services';
import { randomBetween, sleep } from '@utils';

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
    providers: [FileSaverService],
    templateUrl: './faktoring.page.html',
    styleUrl: './faktoring.page.scss',
})
export class FaktoringPage {
    constructor(public faktoringService: FaktoringService, private fileSystem: FileSaverService) {}

    readonly FAKTORING_MODE_OPTIONS = [
        { value: FaktoringMode.Negative, label: 'Ujemne' },
        { value: FaktoringMode.Positive, label: 'Dodatnie' },
    ];
    faktoringMode: string = FaktoringMode.Negative;

    readonly isPrnLoading = signal<boolean>(false);
    onPrnFileUpload(file: File): void {
        const isSuccessful = this.faktoringService.setPrnFile(file);
        if (!isSuccessful) return;

        // for the appearance of smooth loading
        // the editable table takes quite a bit to load, so we temporarily display a loading state instead
        this.isPrnLoading.set(true);
        setTimeout(() => {
            this.isPrnLoading.set(false);
        }, 500);
    }
    onCsvFileUpload(file: File): void {
        this.faktoringService.setCsvFile(file);
    }

    readonly areResultsLoading = signal(false);

    async onGenerateButtonClick(): Promise<void> {
        if (!this.faktoringService.hasPrn()) return;

        this.areResultsLoading.set(true);
        // sleep for a short while so that if an error is thrown, the results aren't immediate
        await sleep(500);
        try {
            const processedData = this.faktoringService.processData(this.faktoringMode as FaktoringMode);
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
        } catch (error) {
            if (error === 'ZERO_AMOUNT_ERR') {
                alert('Żadna z kwot nie może być równa zero!');
                return;
            }
            throw error;
        }
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
        csvData.push(
            ...jsonData.map(row =>
                headers
                    .map(fieldName =>
                        JSON.stringify(row[fieldName], (_, value) =>
                            typeof value === 'string' ? value.replace(/"/g, '') : typeof value === 'number' ? value.toFixed(2) : value
                        )
                    )
                    .join(';')
                    .replace(/"/g, '')
            )
        );

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
