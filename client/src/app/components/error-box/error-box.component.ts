import { Component, Input } from '@angular/core';
import { ErrorBoxType } from './error-box.types';

@Component({
  selector: 'app-error-box',
  standalone: true,
  imports: [],
  templateUrl: './error-box.component.html',
  styleUrl: './error-box.component.scss'
})
export class ErrorBoxComponent {
    @Input() type: ErrorBoxType = ErrorBoxType.Error;
}
