import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FormlyConfig, FormlyFieldConfig, FormlyTemplateOptions, ConfigOption } from '@ngx-formly/core';

@Injectable({
  providedIn: 'root'
})
export class TaFormService {

  coreInputFields = <any>['input', 'string', 'number', 'integer', 'lazy-plugin', 'select', 'repeat'];
  constructor(private http: HttpClient, private formlyConfig: FormlyConfig) { }

  saveForm(url: string, model: any, options?: any) {
    if (model[options.pkId]) {
      return this.http.put(url + model[options.pkId] + '/', model);
    } else {
      return this.http.post(url, model);
    }

  }
  isFieldTypeExists(type: string): boolean {
    const fieldType = this.formlyConfig.getType(type) as FormlyFieldConfig;
    return !!fieldType;
  }
  getFormlyFormate(fields = [], form?: FormGroup) {
    return fields.map((f: any) => {
      // const templateOptions: FormlyTemplateOptions = {};
      // if (!f.templateOptions) {
      //   f.templateOptions = {};
      // }
      if (f.templateOptions) {
        f.props = f.templateOptions;
      }
      if (!f.props) {
        f.props = {};
      }
      if (f.label) {
        f.props.label = f.label;
      }
      if (f.cssClass) {
        f.className = f.cssClass;
      }
      if (f.plugId && f.plugId != 'block') {
        if (f.plugId == 'form-field') {
          // const c = new FormControl(null, []);
          // form?.addControl(f.key,c);
          // f.props.parentForm = form;
          // f.props.parentModel = model;
          // f.props.parentFormlyOptions = formlyOptions
        } else {
          const _f = {
            type: "lazy-plugin",
            key: f.pbId,
            props: f
          }
          return _f;
        }
        // f.type = f.plugId;
        // if(!this.coreInputFields.includes(f.type)){
        //   f.type = "lazy-plugin";
        //   f.templateOptions = f;
        // };
      } else {
        if (f.child && f.plugId == 'block') {
          if (f.cssClass) {
            f.fieldGroupClassName = f.cssClass;
            f.className = '';
          }
          f.type = "field-block";
          f.fieldGroup = this.getFormlyFormate(f.child);
        }
      }
      if (f.fieldGroup) {
        f.fieldGroup = this.getFormlyFormate(f.fieldGroup);
      }
      //const fieldTypeExists = this.isFieldTypeExists(f.type);


      return f;
    })
  }

}
