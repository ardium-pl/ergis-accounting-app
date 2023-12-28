import { Component, HostBinding, Input } from '@angular/core';
import { coerceBooleanProperty } from '@ardium-ui/devkit';

@Component({
  selector: 'app-icon-button',
  standalone: true,
  imports: [],
  templateUrl: './icon-button.component.html',
  styleUrl: './icon-button.component.scss'
})
export class IconButtonComponent {

    @HostBinding('class.no-pointer')
    private _disabled: boolean = false;
    @Input()
    get disabled(): boolean { return this._disabled; }
    set disabled(v: any) { this._disabled = coerceBooleanProperty(v); }
}
