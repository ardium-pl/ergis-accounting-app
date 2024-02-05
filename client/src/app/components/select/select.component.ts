import { Component, Input, signal, Output, EventEmitter } from '@angular/core';
import { SelectOption } from './select.types';
import { FormFieldComponent } from '../_internal/form-field/form-field.component';
import { coerceBooleanProperty } from '@ardium-ui/devkit';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-select',
    standalone: true,
    imports: [FormFieldComponent, FormsModule],
    templateUrl: './select.component.html',
    styleUrl: './select.component.scss',
})
export class SelectComponent {
    @Input({
        required: true,
        alias: 'options',
        transform: (value: SelectOption[]): Exclude<SelectOption, string>[] => {
            return value.map(v => (typeof v == 'string' ? { value: v, label: v } : v));
        },
    })
    options!: Exclude<SelectOption, string>[];

    @Input() value?: string;
    @Output() valueChange = new EventEmitter<string>();

    emitValue(v: string): void {
        this.valueChange.emit(v);
    }

    @Input() label?: string;
    @Input() htmlId?: string;

    @Input() helperText?: string;

    readonly hasError = signal<boolean>(false);
    @Input('hasError')
    set _hasError(v: any) {
        this.hasError.set(coerceBooleanProperty(v));
    }
}
