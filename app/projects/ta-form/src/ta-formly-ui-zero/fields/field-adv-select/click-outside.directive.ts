import { Directive, ElementRef, EventEmitter, Output } from "@angular/core";

@Directive({
    selector: '[clickOutside]',
    standalone: true
})
export class ClickOutsideDirective {
    @Output() clickOutside = new EventEmitter<MouseEvent>();

    constructor(private elementRef: ElementRef) {
        document.addEventListener('click', this.onClick.bind(this), true);
    }

    onClick(event: MouseEvent): void {
        if (!this.elementRef.nativeElement.contains(event.target)) {
            this.clickOutside.emit(event);
        }
    }

    ngOnDestroy(): void {
        document.removeEventListener('click', this.onClick.bind(this), true);
    }
}
