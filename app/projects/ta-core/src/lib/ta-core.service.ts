import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TaCoreService {

  constructor(@Inject(DOCUMENT) private document: Document) { }

  loadJs() {

  }

  loadStyle(styleName: any, id: string) {
    const head = this.document.getElementsByTagName('head')[0];
    if (!id) {
      id = styleName.replaceAll('/', '-').replaceAll('.', '-');
    }

    let themeLink = this.document.getElementById(id) as HTMLLinkElement;
    if (!themeLink) {
      const style = this.document.createElement('link');
      style.id = id;
      style.rel = 'stylesheet';
      style.href = `${styleName}`;
      head.appendChild(style);
    }
  }
}
