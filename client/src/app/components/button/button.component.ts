import { Component, input, computed } from '@angular/core';
import { coerceBooleanProperty } from '@ardium-ui/devkit';
import { ButtonAppearance } from './button.types';

@Component({
    selector: 'app-button',
    standalone: true,
    imports: [],
    templateUrl: './button.component.html',
    styleUrl: './button.component.scss',
})
export class ButtonComponent {
    readonly disabled = input<any, boolean>(false, { transform: v => coerceBooleanProperty(v) });

    readonly htmlId = input<string | null | undefined>(null);

    readonly appearance = input<ButtonAppearance>(ButtonAppearance.Raised);

    readonly classes = computed<string>(() => {
        return [`appearance-${this.appearance()}`].join(' ');
    });
}
