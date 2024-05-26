import { UpperCasePipe } from '@angular/common';
import { Component, input } from '@angular/core';
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
})
export class JpkFileComponent {
  readonly jpkFile = input.required<JpkFile>();
  readonly _states = JpkFileState;
}
