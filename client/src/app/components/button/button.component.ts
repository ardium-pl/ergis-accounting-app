import { Component, HostBinding, input } from '@angular/core';
import { coerceBooleanProperty } from '@ardium-ui/devkit';

@Component({
    selector: 'app-button',
    standalone: true,
    imports: [],
    templateUrl: './button.component.html',
    styleUrl: './button.component.scss',
})
export class ButtonComponent {
    @HostBinding('class.no-pointer')
    readonly disabled = input<any, boolean>(false, { transform: v => coerceBooleanProperty(v) });
}
