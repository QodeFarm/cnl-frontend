import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'ta-field-tabs',
  templateUrl: './field-tabs.component.html',
  styleUrls: ['./field-tabs.component.css']
})
export class FieldTabsComponent extends FieldType {

  activeTab = 0;

  selectTab(index: number) {
    this.activeTab = index;
  }
}