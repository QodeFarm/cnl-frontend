import { FormlyFieldConfig } from "@ngx-formly/core";

export interface TaFormConfig {
  title?: any;
  fields?: FormlyFieldConfig[];
  url?: string;
  updateUrl?: string;
  pkId?: string;
  model?: any;
  formState?: FormState;
  showActionBtn?: boolean;
  valueChangeFn?: (res: any) => any;
  exParams?: any;
  submit?: {
    label?: string,
    icon?: string,
    submittedFn?: (res: any) => any;
    successMsg?: string;
    cssClass?: string;
    errorMsg?: string;
  };
  reset?: {
    cssClass?: string,
    label?: string,
    icon?: string,
    resetFn?: (res: any) => any;
    resetMsg?: string;
  }
}
interface FormState {
  viewMode?: boolean;
}
