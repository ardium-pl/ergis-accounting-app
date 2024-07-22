import { Component, ViewEncapsulation, inject } from '@angular/core';
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
import { GenerateExcelService } from '@services/excel/generate-excel.service';


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
  encapsulation: ViewEncapsulation.None,
})
export class JpkPage {
  readonly jpkService = inject(JpkService);
  readonly excelService = inject(GenerateExcelService); // Inject the Excel service
  readonly dialog = inject(MatDialog);

  async onFilesUpload(files: File | File[]) {
    const failedFiles = await this.jpkService.handleFilesUpload(files as File[]);

    if (!failedFiles.length) return;

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
    console.log('Parsed RejZ Data:', this.jpkService.rejzData);
    console.log('Prepared VAT Validation Data:', this.jpkService.vatVerificationData);
    if (!this.jpkService.areAllFilesOK()) {
      console.log("Not all files are ready for generation.");
      return;
    }
    const data = {
      rejz: this.jpkService.rejzData,
      pzn: this.jpkService.pznData,
      wnpz: this.jpkService.wnpzData,
      mapz: this.jpkService.mapzData
    };
    this.excelService.generateExcel(data);
  }
}
