import { TaFormConfig } from "projects/ta-form/src/lib/ta-form-config";
import { TaTableConfig } from "projects/ta-table/src/lib/ta-table-config";

export interface TaCurdConfig {
    tableConfig:TaTableConfig;
    formConfig:TaFormConfig;
    displayStyle?:string;
    drawerSize?:any;
    drawerPlacement?:any;
}