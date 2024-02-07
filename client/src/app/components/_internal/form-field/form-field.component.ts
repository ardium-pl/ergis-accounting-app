import { Component, input } from '@angular/core';
import { coerceBooleanProperty } from '@ardium-ui/devkit';

@Component({
  selector: 'app-_form-field',
  standalone: true,
  imports: [],
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.scss'
})
export class FormFieldComponent {
    readonly label = input<string | undefined>();
    readonly htmlFor = input<string | undefined>();

    readonly helperText = input<string | undefined>();
    
    readonly hasError = input<any, boolean>(false, { transform: v => coerceBooleanProperty(v) });
}
