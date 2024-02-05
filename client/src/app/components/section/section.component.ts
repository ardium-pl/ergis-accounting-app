import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { coerceBooleanProperty } from '@ardium-ui/devkit';

@Component({
    selector: 'app-section',
    standalone: true,
    imports: [
        CommonModule
    ],
    encapsulation: ViewEncapsulation.None,
    templateUrl: './section.component.html',
    styleUrl: './section.component.scss'
})
export class SectionComponent {

    @Input({ required: true }) header!: string;
    @Input() headerId?: string;

    private _required: boolean = false;
    @Input()
    get required(): boolean { return this._required; }
    set required(v: any) { this._required = coerceBooleanProperty(v); }
}
