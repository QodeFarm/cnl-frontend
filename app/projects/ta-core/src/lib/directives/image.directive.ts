import { Directive, ElementRef, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { SiteConfigService } from '@ta/ta-core';

@Directive({
  selector: 'img[taImage]'
})
export class ImageDirective implements OnInit, OnChanges {
  @Input() defaultImage: string = 'default.jpg';
  @Input() srcData: any;

  constructor(private elementRef: ElementRef, private config: SiteConfigService) { }

  ngOnInit(): void {
    this.updateImageSource();

    // Set up error handling for image load errors
    this.elementRef.nativeElement.onerror = () => {
      this.elementRef.nativeElement.src = this.defaultImage;
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.srcData) {
      this.updateImageSource();
    }
  }

  private updateImageSource(): void {
    if (this.srcData) {
      if (this.validateUser(this.srcData)) {
        this.elementRef.nativeElement.src = this.config.CONFIG.cdnPath + this.srcData[0].attachment_path;
      } else {
        this.elementRef.nativeElement.src = this.defaultImage;
      }
    }
  }

  private validateUser(user: any): boolean {
    if (!Array.isArray(user) || user.length === 0 || !user[0].hasOwnProperty('attachment_path') || user[0].attachment_path === "") {
      console.error("Invalid user object");
      return false;
    }
    return true;
  }
}
