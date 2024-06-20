import { Component, EventEmitter, Output, input, ɵINPUT_SIGNAL_BRAND_WRITE_TYPE } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { coerceBooleanProperty, coerceNumberProperty } from '@ardium-ui/devkit';
import { FormFieldComponent } from '../_internal/form-field/form-field.component';
import { SelectOption } from './select.types';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [FormFieldComponent, FormsModule],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
})
export class SelectComponent {
  readonly options = input.required<any, Exclude<SelectOption, string>[]>({
    alias: 'options',
    transform: (value: SelectOption[]): Exclude<SelectOption, string>[] => {
      return value.map(v => (typeof v == 'string' ? { value: v, label: v } : v));
    },
  });

  readonly value = input<string | undefined>();
  @Output() valueChange = new EventEmitter<string>();

  onValueChange(v: string): void {
    this.valueChange.emit(v);
  }

  readonly label = input<string | undefined>();
  readonly htmlId = input<string | undefined>();

  readonly helperText = input<string | undefined>();

  readonly hasError = input<any, boolean>(false, { transform: v => coerceBooleanProperty(v) });

  readonly width = input<number, any>(120, { transform: v => coerceNumberProperty(v, 120) });
}
