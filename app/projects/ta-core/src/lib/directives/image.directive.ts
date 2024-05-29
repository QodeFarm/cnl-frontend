import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: 'img[taImage]'
})
export class ImageDirective implements OnInit {
  @Input() defaultImage: string = 'default.jpg';

  constructor(private elementRef: ElementRef) { }

  ngOnInit(): void {
    this.elementRef.nativeElement.onerror = () => {
      this.elementRef.nativeElement.src = this.defaultImage;
    };
  }
}
