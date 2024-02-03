import { DecimalPipe } from '@angular/common';
import { Component, ViewEncapsulation, computed, effect } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ButtonComponent, FileDisplayComponent, FileDropZoneComponent, SectionComponent } from '@components';
import { FileStorageService, PolymerscanService } from '@services';
import { MarkdownModule, provideMarkdown } from 'ngx-markdown';

@Component({
    selector: '_polymerscan-page',
    standalone: true,
    imports: [
        SectionComponent,
        FileDropZoneComponent,
        FileDisplayComponent,
        ButtonComponent,
        MatProgressSpinnerModule,
        DecimalPipe,
        MarkdownModule,
    ],
    templateUrl: './polymerscan.page.html',
    styleUrl: './polymerscan.page.scss',
    encapsulation: ViewEncapsulation.None,
    providers: [provideMarkdown()],
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
        this.fileStorage.setFile(file);
    }

    readonly areResultsLoading = computed(() => this.polymerscanService.isPending());
    readonly uploadProgress = computed(() => this.polymerscanService.progress());
    readonly isButtonDisabled = computed(() => this.fileStorage.fileType() != 'pdf');

    readonly formattedResponse = computed(() => {
        const res = this.polymerscanService.response();

        if (!res) {
            return '';
        }
        if (!res.success) {
            if (res.error === 'NO_DATA_ERR') {
                return 'Model AI nie zwrócił żadnych danych.'
            }
            console.error('Polymerscan response error: ', res);
            return '';
        }
        return res.response.replace('\\n', '\n');
    });

    onGenerateButtonClick(): void {
        this.polymerscanService.callApi();
    }
}
