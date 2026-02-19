import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { SiteConfigService } from '@ta/ta-core';
import { NzUploadFile } from 'ng-zorro-antd/upload';

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
  enableCamera = false;
  constructor(private siteC: SiteConfigService) {
    super();
  }
  ngOnInit(): void {
    this.config.multiple = (this.props.multiple) ? true : false;
    this.config.displayStyle = (this.props.displayStyle) ? this.props.displayStyle : 'avatar';
    // Enable camera capture when explicitly enabled or for 'files' displayStyle
    this.enableCamera = this.props.enableCamera === true || this.config.displayStyle === 'files';
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
        // debugger;
        this.config.fileList = _fList.map(res => {
          res.uid = res.attachment_id || res.uid
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

  /** Handle camera capture: add to existing file list and update form control */
  onCameraCaptured(attachment: any): void {
    const currentList = this.formControl.value || [];
    // Build an entry compatible with the NzUploadFile structure + attachment fields
    const newFile: any = {
      uid: attachment.attachment_id || attachment.uid || `camera_${Date.now()}`,
      name: attachment.attachment_name,
      status: 'done',
      url: this.siteC.CONFIG.cdnPath + attachment.attachment_path,
      attachment_name: attachment.attachment_name,
      attachment_path: attachment.attachment_path,
      attachment_id: attachment.attachment_id,
      file_size: attachment.file_size
    };

    let updatedList: any[];
    if (!this.config.multiple) {
      // Single-file mode: replace the existing list
      updatedList = [newFile];
    } else if (this.config.limit > 0 && currentList.length >= this.config.limit) {
      // Multi-file mode but already at the limit — ignore the new file
      return;
    } else {
      updatedList = [...currentList, newFile];
    }
    // Update the config fileList so the upload component shows the file
    this.config.fileList = updatedList;
    // Update the form control value
    this.formControl.setValue(updatedList);
  }

}
