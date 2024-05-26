import { Component, effect, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FileDropZoneComponent } from '@components';
import { JpkService } from 'src/app/services/jpk/jpk.service';

@Component({
  selector: '_jpk-page',
  standalone: true,
  imports: [MatCardModule, MatFormFieldModule, MatInputModule, MatProgressSpinnerModule, FileDropZoneComponent],
  templateUrl: './jpk.page.html',
  styleUrl: './jpk.page.scss',
})
export class JpkPage {
  readonly jpkService = inject(JpkService);

  constructor() {
    effect(() => {
      for (let i = 0; i < this.jpkService.files.length; i++) {
        const file = this.jpkService.files[i];
        console.log('File ' + i, file.fileName(), file.fileSize(), file.state());
      }
    })
  }

  onFilesUpload(files: File | File[]) {
    this.jpkService.handleFilesUpload(files as File[]);
  }
}
