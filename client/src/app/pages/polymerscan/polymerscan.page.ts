import { Component, computed, signal, effect } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ButtonComponent, FileDisplayComponent, FileDropZoneComponent, SectionComponent } from '@components';
import { FileStorageService, PolymerscanService } from '@services';

@Component({
    selector: '_polymerscan-page',
    standalone: true,
    imports: [SectionComponent, FileDropZoneComponent, FileDisplayComponent, ButtonComponent, MatProgressSpinnerModule],
    templateUrl: './polymerscan.page.html',
    styleUrl: './polymerscan.page.scss',
})
export class PolymerscanPage {
    constructor(public fileStorage: FileStorageService, private polymerscanService: PolymerscanService) {}

    onFileUpload(file: File): void {
        if (file.size > 10 * 1024 * 1024) {
            alert('Plik musi być mniejszy niż 10 MB');
            return;
        }
        if (!file.name.toLowerCase().endsWith('.pdf')) {
            alert('Plik musi być typu .pdf');
            return;
        }
        console.log('file uploaded');
        this.fileStorage.setFile(file);
    }

    readonly areResultsLoading = signal(false);
    readonly isButtonDisabled = computed(() => this.fileStorage.fileType() != 'pdf');

    onGenerateButtonClick(): void {
        const pdfArrayBuffer = this.fileStorage.fileBuffer(); // Assuming this returns an ArrayBuffer
        if (pdfArrayBuffer) {
            const pdfBuffer = Buffer.from(pdfArrayBuffer);
            this.polymerscanService.processPhraseExtractionFromBuffer(pdfBuffer, ['Your', 'Phrases'])
                .then(matches => {
                    this.polymerscanService.polymerScanGPTApiCall(matches)
                    .then(gptResponse =>{
                        //TODO: ADD DISPLAY HERE
                    })
                    .catch(error =>{
                        console.error(error);
                    })
                })
                .catch(error => {
                    // Handle error
                });
        }
      }

    readonly eff = effect(() => {
        console.log(this.polymerscanService.jsonResponse());
    })
}