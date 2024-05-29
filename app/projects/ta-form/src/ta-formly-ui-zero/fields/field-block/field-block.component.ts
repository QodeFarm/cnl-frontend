import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldType, FormlyModule } from '@ngx-formly/core';

@Component({
  selector: 'ta-field-block',
  templateUrl: './field-block.component.html',
  styleUrls: ['./field-block.component.css']
})
export class FieldBlockComponent extends FieldType implements OnInit{
  field:any;
  ngOnInit(): void {

  }
}