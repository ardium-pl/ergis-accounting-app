import { Directive, ElementRef, HostListener, Renderer2, OnInit, AfterViewChecked } from '@angular/core';

@Directive({
    selector: 'input[appAutoLength]',
    standalone: true,
})
export class AutoLengthDirective implements OnInit, AfterViewChecked {
    constructor(private el: ElementRef<HTMLInputElement>, private renderer: Renderer2) {}

    @HostListener('input')
    setSize() {
        const length = this.el.nativeElement.value.length;
        this.renderer.setAttribute(this.el.nativeElement, 'size', String(length + 1));
    }

    ngOnInit(): void {
        this.setSize();
    }

    ngAfterViewChecked(): void {
        this.setSize();
    }
}
