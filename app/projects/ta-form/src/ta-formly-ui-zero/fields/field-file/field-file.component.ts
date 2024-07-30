import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'ta-field-file',
  templateUrl: './field-file.component.html',
  styleUrls: ['./field-file.component.css']
})
export class FieldFileComponent extends FieldType {
  config = {
    plugId: 'file-upload',
    multiple: false,
    displayStyle: 'button',
    doneFn: (data) => {
      this.uploaded(data);
    }
  };
  ngOnInit(): void {

  }
  uploaded(data) {

    this.formControl.setValue(data);

  }

}
