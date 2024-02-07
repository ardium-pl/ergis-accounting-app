import { Component, HostBinding, input } from '@angular/core';
import { coerceBooleanProperty } from '@ardium-ui/devkit';

@Component({
    selector: 'app-icon-button',
    standalone: true,
    imports: [],
    templateUrl: './icon-button.component.html',
    styleUrl: './icon-button.component.scss',
})
export class IconButtonComponent {
    @HostBinding('class.no-pointer')
    readonly disabled = input<any, boolean>(false, { transform: v => coerceBooleanProperty(v) });
}
