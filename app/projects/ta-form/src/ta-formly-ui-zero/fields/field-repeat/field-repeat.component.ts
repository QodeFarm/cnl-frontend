import { Component, OnInit } from '@angular/core';
import { FieldArrayType } from '@ngx-formly/core';

@Component({
  selector: 'ta-field-repeat',
  templateUrl: './field-repeat.component.html',
  styleUrls: ['./field-repeat.component.css']
})
export class FieldRepeatComponent extends FieldArrayType {
  constructor() {
    super();
  }
}
