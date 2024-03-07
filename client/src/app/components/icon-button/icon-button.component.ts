import { Component, HostBinding, computed, input } from '@angular/core';
import { coerceBooleanProperty } from '@ardium-ui/devkit';
import { IconButtonSize } from './icon-button.types';

@Component({
    selector: 'app-icon-button',
    standalone: true,
    imports: [],
    templateUrl: './icon-button.component.html',
    styleUrl: './icon-button.component.scss',
})
export class IconButtonComponent {
    readonly disabled = input<any, boolean>(false, { transform: v => coerceBooleanProperty(v) });

    readonly size = input<IconButtonSize>(IconButtonSize.Big);

    readonly classes = computed<string>(() => {
        return [
            `size-${this.size()}`
        ].join(' ');
    })
}
