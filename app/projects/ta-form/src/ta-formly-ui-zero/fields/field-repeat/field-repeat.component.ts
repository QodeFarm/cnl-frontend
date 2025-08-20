import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FieldArrayType } from '@ngx-formly/core';

@Component({
  selector: 'ta-field-repeat',
  templateUrl: './field-repeat.component.html',
  styleUrls: ['./field-repeat.component.css']
})
export class FieldRepeatComponent extends FieldArrayType {
  // router: any;
  isRestrictedPage = false; // For both customers and vendors pages

  constructor(private router: Router) {
    super();
  }

  ngOnInit(): void {
    const currentUrl = this.router.url || '';
    console.log(this.field, this.field.fieldGroup);
    
    // List of restricted URLs
    const restrictedUrls = ['/admin/customers', '/admin/vendors'];

    // Check if the current URL matches any restricted URL
    this.isRestrictedPage = restrictedUrls.some(url => currentUrl.includes(url));

    // console.log('Is Restricted Page:', this.isRestrictedPage);

    // Additional logic for specific pages
    // if (this.isRestrictedPage) {
    //   console.log(`Restricted page detected: ${currentUrl}`);
    // }
  }


}
