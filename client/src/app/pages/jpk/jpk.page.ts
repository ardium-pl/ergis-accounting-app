import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FileDropZoneComponent } from '@components';

@Component({
  selector: '_jpk-page',
  standalone: true,
  imports: [MatCardModule, MatFormFieldModule, MatInputModule, MatProgressSpinnerModule, FileDropZoneComponent],
  templateUrl: './jpk.page.html',
  styleUrl: './jpk.page.scss',
})
export class JpkPage {}
