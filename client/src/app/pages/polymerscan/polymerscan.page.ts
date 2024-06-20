import { DecimalPipe } from '@angular/common';
import { Component, ViewEncapsulation, computed } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ButtonComponent, ErrorBoxComponent, FileDisplayComponent, FileDropZoneComponent, SectionComponent } from '@components';
import { FileStorageService } from '@services/file-storage';
import { PolymerscanService } from '@services/polymerscan';
import { MarkdownModule, provideMarkdown } from 'ngx-markdown';
import { isDefined } from 'simple-bool';

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
    ErrorBoxComponent,
  ],
  templateUrl: './polymerscan.page.html',
  styleUrl: './polymerscan.page.scss',
  encapsulation: ViewEncapsulation.None,
  providers: [provideMarkdown()],
})
export class PolymerscanPage {
  constructor(public fileStorage: FileStorageService, private polymerscanService: PolymerscanService) {}

  onFileUpload(file: File | File[]): void {
    let singleFile = file as File;
    if (singleFile.size > 10 * 1024 * 1024) {
      alert('Plik musi być mniejszy niż 10 MB');
      return;
    }
    if (!singleFile.name.toLowerCase().endsWith('.pdf')) {
      alert('Plik musi być typu .pdf');
      return;
    }
    this.fileStorage.setFile(singleFile);
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
      console.error('Polymerscan response error: ', res);
      return '';
    }
    return res.response.replace('\\n', '\n');
  });

  readonly shouldShowWarning = computed<boolean>(() => {
    const res = this.polymerscanService.response();
    return isDefined(res) && !res.success && res.error === 'NO_DATA_ERR';
  });
  readonly warningFoundAmount = computed<number | null>(() => {
    const res = this.polymerscanService.response();
    if (!isDefined(res) || res.success || res.error !== 'NO_DATA_ERR') return null;
    return res.found ?? null;
  });
  readonly warningRequiredAmount = computed<number | null>(() => {
    const res = this.polymerscanService.response();
    if (!isDefined(res) || res.success || res.error !== 'NO_DATA_ERR') return null;
    return res.required ?? null;
  });

  onGenerateButtonClick(): void {
    this.polymerscanService.callApi();
  }
}
