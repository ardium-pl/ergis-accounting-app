import { Component, effect, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ButtonComponent, FileDropZoneComponent } from '@components';
import { JpkService } from 'src/app/services/jpk/jpk.service';
import { JpkFileComponent } from 'src/app/components/jpk-file/jpk-file.component';

@Component({
  selector: '_jpk-page',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    FileDropZoneComponent,
    JpkFileComponent,
    ButtonComponent,
    MatTooltipModule,
  ],
  templateUrl: './jpk.page.html',
  styleUrl: './jpk.page.scss',
})
export class JpkPage {
  readonly jpkService = inject(JpkService);

  onFilesUpload(files: File | File[]) {
    this.jpkService.handleFilesUpload(files as File[]);
  }

  onGenerateButtonClick() {
    console.log('Generating excel file');
  }
}
