import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ButtonComponent, FileDropZoneComponent } from '@components';
import { JpkService } from '@services/jpk';
import { JpkChooseTypeDialogComponent } from 'src/app/components/jpk-choose-type-dialog/jpk-choose-type-dialog.component';
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
  readonly dialog = inject(MatDialog);

  async onFilesUpload(files: File | File[]) {
    const failedFiles = await this.jpkService.handleFilesUpload(files as File[]);

    const dialogRef = this.dialog.open(JpkChooseTypeDialogComponent, {
      data: { files: failedFiles },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      this.jpkService.handleFilesUpload(failedFiles, result);
    })
  }

  onGenerateButtonClick() {
    console.log('Generating excel file');
  }
}
