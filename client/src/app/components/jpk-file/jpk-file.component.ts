import { UpperCasePipe } from '@angular/common';
import { Component, ViewEncapsulation, computed, input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { JpkFile, JpkFileState } from 'src/app/services/jpk/jpk-file';
import { ArdiumFilesizePipeModule } from '@ardium-ui/devkit';

@Component({
  selector: 'app-jpk-file',
  standalone: true,
  imports: [UpperCasePipe, MatProgressSpinnerModule, MatIconModule, ArdiumFilesizePipeModule],
  templateUrl: './jpk-file.component.html',
  styleUrl: './jpk-file.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class JpkFileComponent {
  readonly jpkFile = input.required<JpkFile>();
  readonly _states = JpkFileState;

  readonly validationDataString = computed(() => {
    const data = this.jpkFile().validationData();
    if (!data) return 'Kod błędu: UNXPTD_NO_DATA';
    const [msg, code] = data;
    return `${msg} Kod błędu: ${code}`;
  })
}
