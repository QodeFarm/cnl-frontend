import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'ta-ta-field-input',
  templateUrl: './ta-field-input.component.html',
  styleUrls: ['./ta-field-input.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaFieldInputComponent extends FieldType implements OnInit {
  precision = 2;
  passwordVisible = false;
  // @Input() options:any;
  ngOnInit(): void {
    // console.log(this.options);
  }


}
