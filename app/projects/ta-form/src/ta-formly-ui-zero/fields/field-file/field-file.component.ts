import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { SiteConfigService } from '@ta/ta-core';

@Component({
  selector: 'ta-field-file',
  templateUrl: './field-file.component.html',
  styleUrls: ['./field-file.component.css']
})
export class FieldFileComponent extends FieldType {
  config: any = {
    plugId: 'file-upload',
    multiple: false,
    displayStyle: this.props.displayStyle,
    allowedType: this.props.allowedType,
    doneFn: (data) => {
      this.uploaded(data);
    }
  };
  constructor(private siteC: SiteConfigService) {
    super();
  }
  ngOnInit(): void {
    this.config.multiple = (this.props.multiple) ? true : false;
    this.config.displayStyle = (this.props.displayStyle) ? this.props.displayStyle : 'avatar';
    // this.config.allowedType = (this.props.allowedType) ? this.props.allowedType : 'image/png,image/jpeg,image/gif';
    this.config.limit = (this.props.limit) ? this.props.limit : 0; // allow number files
    if (this.props.storeFolder) {
      this.config.storeFolder = this.props.storeFolder;
    }
    if (this.formControl.value) {
      this.config.fileList = this.formControl.value;
      //this.lazySelectedItem = this.itemMapping(this.formControl.value);
    }
    this.formControl.valueChanges.subscribe(res => {
      if (this.formControl.value) {
        const _fList = this.formControl.value || [];
        this.config.fileList = _fList.map(res => {
          res.uid = res.attachment_id
          res.url = this.siteC.CONFIG.cdnPath + res.attachment_path;
          res.name = res.attachment_name;
          return res;
        });
        //this.lazySelectedItem = this.itemMapping(this.formControl.value);
      }
    })

  }
  ngAfterViewInit(): void {
    // if (this.formControl.value) {
    //   this.config.fileList = this.formControl.value;
    // }
  }
  uploaded(data) {

    this.formControl.setValue(data);

  }

}
