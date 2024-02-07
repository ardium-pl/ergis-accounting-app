import { Component, input } from '@angular/core';
import { ErrorBoxType } from './error-box.types';

@Component({
    selector: 'app-error-box',
    standalone: true,
    imports: [],
    templateUrl: './error-box.component.html',
    styleUrl: './error-box.component.scss',
})
export class ErrorBoxComponent {
    readonly type = input<ErrorBoxType>(ErrorBoxType.Error);
}
