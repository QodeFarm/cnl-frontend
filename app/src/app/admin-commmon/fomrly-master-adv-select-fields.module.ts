import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { customerCategoryConfig, customerCudConfig, designationsConfig, employeeSalaryComponentsConfig, gPackageUnitsConfig, interactionTypesConfig, jobTypesConfig, leadStatusesConfig, leaveTypesConfig, packUnitConfig, productBrandsConfig, productCategoriesConfig, productColorsConfig, productGroupsConfig, productGstClassificationsConfig, productModesConfig, productPurchaseGLConfig, productSalesGLConfig, productSizesConfig, productStockUnitsConfig, productTypesConfig, shiftsConfig, taskPrioritiesConfig, unitOptionsConfig, warehouseLocationsConfig } from '../utils/master-curd-config';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormlyModule.forChild({
      types: [
        {
          name: 'customer-dropdown',
          extends: 'adv-select',
          wrappers: ['ta-field'],
          defaultOptions: {
            templateOptions: {
              placeholder: 'Please Select',
              label: 'Customer Category',
              dataKey: 'customer_category_id',
              dataLabel: 'name',
              required: true,
              curdConfig: customerCudConfig
            }
          }
        },
        {
          name: 'customer-cagtegory-dropdown',
          extends: 'adv-select',
          wrappers: ['ta-field'],
          defaultOptions: {
            templateOptions: {
              placeholder: 'Please Category Select',
              label: 'Customer Category Category',
              dataKey: 'customer_category_id',
              dataLabel: 'name',
              required: true,
              curdConfig: customerCategoryConfig
            }
          }
        },

        {
          name: 'productModes-dropdown',
          extends: 'adv-select',
          wrappers: ['ta-field'],
          defaultOptions: {
            templateOptions: {
              placeholder: ' Please Select Product Mode',
              label: ' Product Mode',
              dataKey: 'product_mode_id',
              dataLabel: 'mode_name',
              required: true,
              curdConfig: productModesConfig
            }
          }
        },
        {
          name: 'productSalesGL-dropdown',
          extends: 'adv-select',
          wrappers: ['ta-field'],
          defaultOptions: {
            templateOptions: {
              placeholder: 'Please Select productSalesGL',
              label: 'productSalesGL',
              dataKey: 'sales_gl_id',
              dataLabel: 'name',
              required: true,
              curdConfig: productSalesGLConfig
            }
          }
        },
        {
          name: 'productType-dropdown',
          extends: 'adv-select',
          wrappers: ['ta-field'],
          defaultOptions: {
            templateOptions: {
              placeholder: 'Please Select Product Type',
              label: 'Product Type',
              dataKey: 'type_id',
              dataLabel: 'name',
              required: true,
              curdConfig: productTypesConfig
            }
          }
        },
        {
          name: 'productBrands-dropdown',
          extends: 'adv-select',
          wrappers: ['ta-field'],
          defaultOptions: {
            templateOptions: {
              placeholder: ' Please Select Product Brand',
              label: 'Product Brand',
              dataKey: 'brand_id',
              dataLabel: 'name',
              required: true,
              curdConfig: productBrandsConfig
            }
          }
        },
        {
          name: 'productGroups-dropdown',
          extends: 'adv-select',
          wrappers: ['ta-field'],
          defaultOptions: {
            templateOptions: {
              placeholder: 'Please Select Product Groups',
              label: 'Product Groups',
              dataKey: 'product_group_id',
              dataLabel: 'name',
              required: true,
              curdConfig: productGroupsConfig
            }
          }
        },
        {
          name: 'productStockUnits-dropdown',
          extends: 'adv-select',
          wrappers: ['ta-field'],
          defaultOptions: {
            templateOptions: {
              placeholder: 'Please Select Product Stock Units',
              label: 'Product Stock Units',
              dataKey: 'stock_unit_id',
              dataLabel: 'name',
              required: true,
              curdConfig: productStockUnitsConfig
            }
          }
        },
        {
          name: 'productCategories-dropdown',
          extends: 'adv-select',
          wrappers: ['ta-field'],
          defaultOptions: {
            templateOptions: {
              placeholder: 'Please Select Product Categories',
              label: 'Product Categories',
              dataKey: 'category_id',
              dataLabel: 'name',
              required: true,
              curdConfig: productCategoriesConfig
            }
          }
        },
        {
          name: 'productGstClassifications-dropdown',
          extends: 'adv-select',
          wrappers: ['ta-field'],
          defaultOptions: {
            templateOptions: {
              placeholder: 'Please Select Product GST Classifications',
              label: 'Product GST Classifications',
              dataKey: 'gst_classification_id',
              dataLabel: 'name',
              required: true,
              curdConfig: productGstClassificationsConfig
            }
          }
        },
        {
          name: 'productItemType-dropdown',
          extends: 'adv-select',
          wrappers: ['ta-field'],
          defaultOptions: {
            templateOptions: {
              placeholder: 'Please Select Product Item Type',
              label: 'Product Item Type',
              dataKey: 'item_type_id',
              dataLabel: 'item_name',
              required: true,
              curdConfig: productGstClassificationsConfig
            }
          }
        },
        {
          name: 'productPurchaseGL-dropdown',
          extends: 'adv-select',
          wrappers: ['ta-field'],
          defaultOptions: {
            templateOptions: {
              placeholder: 'Please Select Product Purchase GL',
              label: 'Product Purchase GL',
              dataKey: 'purchase_gl_id',
              dataLabel: 'name',
              required: true,
              curdConfig: productPurchaseGLConfig
            }
          }
        },
        {
          name: 'productUnitOptions-dropdown',
          extends: 'adv-select',
          wrappers: ['ta-field'],
          defaultOptions: {
            templateOptions: {
              placeholder: 'Please Select Product Unit Options',
              label: 'Product Unit Options',
              dataKey: 'unit_options_id',
              dataLabel: 'unit_name',
              required: true,
              curdConfig: unitOptionsConfig
            }
          }
        },
        {
          name: 'productSizes-dropdown',
          extends: 'adv-select',
          wrappers: ['ta-field'],
          defaultOptions: {
            templateOptions: {
              placeholder: 'Please Select Product Sizes',
              label: 'Product Sizes',
              dataKey: 'size_id',
              dataLabel: 'size_name',
              required: true,
              curdConfig: productSizesConfig
            }
          }
        },
        {
          name: 'productColors-dropdown',
          extends: 'adv-select',
          wrappers: ['ta-field'],
          defaultOptions: {
            templateOptions: {
              placeholder: 'Please Select Product Colors',
              label: 'Product Colors',
              dataKey: 'color_id',
              dataLabel: 'color_name',
              required: true,
              curdConfig: productColorsConfig
            }
          }
        },
        {
          name: 'warehouseLocations-dropdown',
          extends: 'adv-select',
          wrappers: ['ta-field'],
          defaultOptions: {
            templateOptions: {
              placeholder: 'Please Select Warehouse Locations',
              label: 'Warehouse Locations',
              dataKey: 'location_id',
              dataLabel: 'location_name',
              required: true,
              curdConfig: warehouseLocationsConfig
            }
          }
        },
        {
          name: 'packUnits-dropdown',
          extends: 'adv-select',
          wrappers: ['ta-field'],
          defaultOptions: {
            templateOptions: {
              placeholder: 'Please Select Pack Units',
              label: 'Pack Units',
              dataKey: 'pack_unit_id',
              dataLabel: 'pack_unit_name',
              required: true,
              curdConfig: packUnitConfig
            }
          }
        },
        {
          name: 'GpackUnits-dropdown',
          extends: 'adv-select',
          wrappers: ['ta-field'],
          defaultOptions: {
            templateOptions: {
              placeholder: 'Please Select GPack Units',
              label: 'GPack Units',
              dataKey: 'g_pack_unit_id',
              dataLabel: 'g_pack_unit_name',
              required: true,
              curdConfig: gPackageUnitsConfig
            }
          }
        },
        {
          name: 'JobTypes-dropdown',
          extends: 'adv-select',
          wrappers: ['ta-field'],
          defaultOptions: {
            templateOptions: {
              placeholder: 'Please Select Job Types',
              label: 'Job Types',
              dataKey: 'job_type_id',
              dataLabel: 'job_type_name',
              required: true,
              curdConfig: jobTypesConfig
            }
          }
        },
        {
          name: 'designations-dropdown',
          extends: 'adv-select',
          wrappers: ['ta-field'],
          defaultOptions: {
            templateOptions: {
              placeholder: 'Please Select Designations',
              label: 'Designations',
              dataKey: 'designation_id',
              dataLabel: 'designation_name',
              required: true,
              curdConfig: designationsConfig
            }
          }
        },
        {
          name: 'jobCode-dropdown',
          extends: 'adv-select',
          wrappers: ['ta-field'],
          defaultOptions: {
            templateOptions: {
              placeholder: 'Please Select Job Codes',
              label: 'Job Codes',
              dataKey: 'job_code_id',
              dataLabel: 'job_code',
              required: true,
              curdConfig: jobTypesConfig
            }
          }
        },
        {
          name: 'departments-dropdown',
          extends: 'adv-select',
          wrappers: ['ta-field'],
          defaultOptions: {
            templateOptions: {
              placeholder: 'Please Select Departments',
              label: 'Departments',
              dataKey: 'department_id',
              dataLabel: 'department_name',
              required: true,
              curdConfig: designationsConfig
            }
          }
        },
        {
          name: 'shifts-dropdown',
          extends: 'adv-select',
          wrappers: ['ta-field'],
          defaultOptions: {
            templateOptions: {
              placeholder: 'Please Select Shifts',
              label: 'Shifts',
              dataKey: 'shift_id',
              dataLabel: 'shift_name',
              required: true,
              curdConfig: shiftsConfig
            }
          }
        },
        {
          name: 'salaryComponents-dropdown',
          extends: 'adv-select',
          wrappers: ['ta-field'],
          defaultOptions: {
            templateOptions: {
              placeholder: 'Please Select Salary Components',
              label: 'Salary Components',
              dataKey: 'component_id',
              dataLabel: 'component_name',
              required: true,
              curdConfig: shiftsConfig
            }
          }
        },
        {
          name: 'employeeSalaryComponents-dropdown',
          extends: 'adv-select',
          wrappers: ['ta-field'],
          defaultOptions: {
            templateOptions: {
              placeholder: 'Please Select Salary Components',
              label: 'Employee Salary Components',
              dataKey: 'employee_component_id',
              dataLabel: 'component_name',
              required: true,
              curdConfig: employeeSalaryComponentsConfig
            }
          }
        },
        {
          name: 'leaveTypes-dropdown',
          extends: 'adv-select',
          wrappers: ['ta-field'],
          defaultOptions: {
            templateOptions: {
              placeholder: 'Please Select Leave Types',
              label: 'Leave Types',
              dataKey: 'leave_type_id',
              dataLabel: 'leave_type_name',
              required: true,
              curdConfig: leaveTypesConfig
            }
          }
        },
        {
          name: 'leadStatuses-dropdown',
          extends: 'adv-select',
          wrappers: ['ta-field'],
          defaultOptions: {
            templateOptions: {
              placeholder: 'Please Select Lead Statuses',
              label: 'Lead Statuses',
              dataKey: 'lead_status_id',
              dataLabel: 'status_name',
              required: true,
              curdConfig: leadStatusesConfig
            }
          }
        },
        {
          name: 'interactionTypes-dropdown',
          extends: 'adv-select',
          wrappers: ['ta-field'],
          defaultOptions: {
            templateOptions: {
              placeholder: 'Please Select Interaction Types',
              label: 'Interaction Types',
              dataKey: 'interaction_type_id',
              dataLabel: 'interaction_type',
              required: true,
              curdConfig: interactionTypesConfig
            }
          }
        },
        {
          name: 'taskPriorities-dropdown',
          extends: 'adv-select',
          wrappers: ['ta-field'],
          defaultOptions: {
            templateOptions: {
              placeholder: 'Please Select Task Priorities',
              label: 'Task Priorities',
              dataKey: 'priority_id',
              dataLabel: 'priority_name',
              required: true,
              curdConfig: taskPrioritiesConfig
            }
          }
        },



      ],
    })
  ]
})
export class FomrlyMasterAdvSelectFieldsModule { }
