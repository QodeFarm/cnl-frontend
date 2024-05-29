import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'ta-field-concat',
  templateUrl: './field-concat.component.html',
  styleUrls: ['./field-concat.component.css']
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class FieldConcatComponent extends FieldType {
  value = {};
  ngOnInit(): void {
    this.value = this.model;
    this.form.valueChanges.subscribe(res => {
      this.value = res;
    });

  }
}
