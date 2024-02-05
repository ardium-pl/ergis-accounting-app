import { Component, HostBinding, Input } from '@angular/core';
import { coerceBooleanProperty } from '@ardium-ui/devkit';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {

    @HostBinding('class.no-pointer')
    private _disabled: boolean = false;
    @Input()
    get disabled(): boolean { return this._disabled; }
    set disabled(v: any) { this._disabled = coerceBooleanProperty(v); }
}
