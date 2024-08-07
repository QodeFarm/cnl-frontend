import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'ta-field-datepicker',
  templateUrl: './field-datepicker.component.html',
  styleUrls: ['./field-datepicker.component.css'],
  providers: [DatePipe]
})
export class FieldDatepickerComponent extends FieldType implements OnInit {
  today = new Date();
  dateValue: any;
  //disabledDate = (current: Date): boolean => differenceInCalendarDays(current, this.today) > 0;
  constructor(public datepipe: DatePipe) {
    super();
  }
  ngOnInit(): void {
    this.dateValue = this.formControl.value;
    this.formControl.valueChanges.subscribe(res => {
      if (this.formControl.value) {
        this.dateValue = this.datepipe.transform(this.formControl.value, 'yyyy-MM-dd');
      }
    })
  }
  onChange(result: Date): void {
    // debugger
    const data = this.datepipe.transform(result, 'yyyy-MM-dd');
    this.formControl.setValue(data);
  }
}
