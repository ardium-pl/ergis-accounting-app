import { Component, Input } from '@angular/core';
import { coerceBooleanProperty } from '@ardium-ui/devkit';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrl: './section.component.scss'
})
export class SectionComponent {

    @Input({ required: true }) header!: string;

    private _required: boolean = false;
    @Input()
    get required(): boolean { return this._required; }
    set required(v: any) { this._required = coerceBooleanProperty(v); }
}
