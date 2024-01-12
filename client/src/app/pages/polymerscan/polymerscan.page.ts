import { Component } from '@angular/core';
import { FileDisplayComponent, FileDropZoneComponent, SectionComponent } from '@components';
import { FileStorageService } from '@services';

@Component({
  selector: '_polymerscan-page',
  standalone: true,
  imports: [SectionComponent, FileDropZoneComponent, FileDisplayComponent],
  templateUrl: './polymerscan.page.html',
  styleUrl: './polymerscan.page.scss',
})
export class PolymerscanPage {
  constructor(public fileStorage: FileStorageService) {}

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
}
