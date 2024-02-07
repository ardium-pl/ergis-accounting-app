import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation, input } from '@angular/core';
import { coerceBooleanProperty } from '@ardium-ui/devkit';

@Component({
    selector: 'app-section',
    standalone: true,
    imports: [CommonModule],
    encapsulation: ViewEncapsulation.None,
    templateUrl: './section.component.html',
    styleUrl: './section.component.scss',
})
export class SectionComponent {
    readonly header = input.required<string>();
    readonly headerId = input<string | undefined>();

    readonly required = input<any, boolean>(false, { transform: v => coerceBooleanProperty(v) });
}
