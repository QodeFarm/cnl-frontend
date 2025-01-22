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
  isCustomersPage = false;
  constructor(private router: Router) {
    super();
  }

  ngOnInit(): void {
    const currentUrl = this.router.url || '';
    console.log(this.field, this.field.fieldGroup);
    this.isCustomersPage = currentUrl === '/admin/customers';
    console.log("Test : ", this.isCustomersPage);
    // Show status filter for specific URLs    
  }


}
