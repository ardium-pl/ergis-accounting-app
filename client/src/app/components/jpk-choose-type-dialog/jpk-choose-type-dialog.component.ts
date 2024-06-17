import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { JpkFileName } from '@services/jpk';
import { ButtonComponent } from '../button/button.component';
import { FileDisplayComponent } from '../file-display/file-display.component';
import { SelectComponent } from '../select/select.component';

export type JpkChooseTypeDialogData = {
  files: File[];
};

@Component({
  selector: 'app-jpk-choose-type-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    ButtonComponent,
    FileDisplayComponent,
    SelectComponent,
  ],
  templateUrl: './jpk-choose-type-dialog.component.html',
  styleUrl: './jpk-choose-type-dialog.component.scss',
})
export class JpkChooseTypeDialogComponent {
  readonly dialogRef = inject(MatDialogRef<JpkChooseTypeDialogComponent>);
  readonly data = inject<JpkChooseTypeDialogData>(MAT_DIALOG_DATA);

  readonly fileNameOptions = Object.values(JpkFileName).map(v => ({ value: v, label: v }));

  readonly chosenValues = signal<(JpkFileName | undefined)[]>(new Array(this.data.files.length).fill(undefined));

  onChooseValue(target: EventTarget, index: number) {
    let value = (target as HTMLSelectElement).value as string | undefined;
    if (value === 'undefined') value = undefined;

    this.chosenValues.update(v => {
      const newArray = [...v];
      newArray[index] = value as JpkFileName;
      return newArray;
    });
  }

  onSkipClick() {
    this.dialogRef.close();
  }

  readonly isOKButtonDisabled = computed(() => !this.chosenValues().every(v => v));
}
