import { Component, Input, signal } from '@angular/core';
import { coerceBooleanProperty } from '@ardium-ui/devkit';

@Component({
  selector: 'app-_form-field',
  standalone: true,
  imports: [],
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.scss'
})
export class FormFieldComponent {
    @Input() label?: string;
    @Input() htmlFor?: string;

    @Input() helperText?: string;
    
    readonly hasError = signal<boolean>(false);
    @Input("hasError")
    set _hasError(v: any) { this.hasError.set(coerceBooleanProperty(v)); }
}
