import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { cityConfig, CountryConfig, customerCategoryConfig, customerCudConfig, CustomerPaymentConfig, designationsConfig, employeeSalaryComponentsConfig, FirmStatusConfig, gPackageUnitsConfig, GstCatConfig, GstTypesConfig, interactionTypesConfig, jobTypesConfig, leadStatusesConfig, leaveTypesConfig, ledgerAccountsConfig, LedgerGroupsConfig, MachineConfig, OrderStatusConfig, OrderTypesConfig, packUnitConfig, PaymentLinkConfig, PriceCatConfig, productBrandsConfig, productCategoriesConfig, productColorsConfig, productGroupsConfig, productGstClassificationsConfig, ProductionStatusesConfig, productModesConfig, productPurchaseGLConfig, productSalesGLConfig, productSizesConfig, productStockUnitsConfig, productTypesConfig, PurchaseTypesConfig, ReminderTypesConfig, SaleTypesConfig, shiftsConfig, StateConfig, statusConfig, taskPrioritiesConfig, TerritoryConfig, TransportConfig, unitOptionsConfig, UserGroupsConfig, VendorAgentConfig, vendorCategeoryConfig, VendorPaymentTermsConfig, warehouseLocationsConfig } from '../utils/master-curd-config';



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
              required: false,
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
              required: false,
              curdConfig: customerCategoryConfig
            }
          }
        },
        {
          name: 'ledger-account-dropdown',
          extends: 'adv-select',
          wrappers: ['ta-field'],
          defaultOptions: {
            templateOptions: {
              placeholder: 'Please Select Ledger',
              label: 'Ledger Accounts',
              dataKey: 'ledger_account_id',
              dataLabel: 'name',
              required: false,
              curdConfig: ledgerAccountsConfig
            }
          }
        },
        {
          name: 'city-dropdown',
          extends: 'adv-select',
          wrappers: ['ta-field'],
          defaultOptions: {
            templateOptions: {
              placeholder: 'Please Select City',
              label: 'City',
              dataKey: 'city_id',
              dataLabel: 'city_name',
              required: false,
              curdConfig: cityConfig
            }
          }
        },
        {
          name: 'state-dropdown',
          extends: 'adv-select',
          wrappers: ['ta-field'],
          defaultOptions: {
            templateOptions: {
              placeholder: 'Please Select State',
              label: 'State',
              dataKey: 'state_id',
              dataLabel: 'state_name',
              required: false,
              curdConfig: StateConfig
            }
          }
        },
        {
          name: 'country-dropdown',
          extends: 'adv-select',
          wrappers: ['ta-field'],
          defaultOptions: {
            templateOptions: {
              placeholder: 'Please Select Country',
              label: 'Country',
              dataKey: 'country_id',
              dataLabel: 'country_name',
              required: false,
              curdConfig: CountryConfig
            }
          }
        },
        {
          name: 'vendor-cat-dropdown',
          extends: 'adv-select',
          wrappers: ['ta-field'],
          defaultOptions: {
            templateOptions: {
              placeholder: 'Please Select Category',
              label: 'Category',
              dataKey: 'vendor_category_id',
              dataLabel: 'name',
              required: false,
              curdConfig: vendorCategeoryConfig
            }
          }
        },
        {
          name: 'status-dropdown',
          extends: 'adv-select',
          wrappers: ['ta-field'],
          defaultOptions: {
            templateOptions: {
              placeholder: 'Please Select Status',
              label: 'Statuses',
              dataKey: 'status_id',
              dataLabel: 'status_name',
              required: false,
              curdConfig: statusConfig
            }
          }
        },
        {
          name: 'transport-dropdown',
          extends: 'adv-select',
          wrappers: ['ta-field'],
          defaultOptions: {
            templateOptions: {
              placeholder: 'Please Select Transport',
              label: 'Transport',
              dataKey: 'transporter_id',
              dataLabel: 'name',
              required: false,
              curdConfig: TransportConfig
            }
          }
        },
        {
          name: 'firm-status-dropdown',
          extends: 'adv-select',
          wrappers: ['ta-field'],
          defaultOptions: {
            templateOptions: {
              placeholder: 'Please Select Firmstatus',
              label: 'Firmstatus',
              dataKey: 'firm_status_id',
              dataLabel: 'name',
              required: false,
              curdConfig: FirmStatusConfig
            }
          }
        },
        {
          name: 'gst-cat-dropdown',
          extends: 'adv-select',
          wrappers: ['ta-field'],
          defaultOptions: {
            templateOptions: {
              placeholder: 'Please Select GST Categeory',
              label: 'GST Categeory',
              dataKey: 'gst_category_id',
              dataLabel: 'name',
              required: false,
              curdConfig: GstCatConfig
            }
          }
        },
        {
          name: 'price-cat-dropdown',
          extends: 'adv-select',
          wrappers: ['ta-field'],
          defaultOptions: {
            templateOptions: {
              placeholder: 'Please Select Price Categeory',
              label: 'Price Categeory',
              dataKey: 'price_category_id',
              dataLabel: 'name',
              required: false,
              curdConfig: PriceCatConfig
            }
          }
        },
        {
          name: 'vendor-agent-dropdown',
          extends: 'adv-select',
          wrappers: ['ta-field'],
          defaultOptions: {
            templateOptions: {
              placeholder: 'Please Select VendorAgent',
              label: 'VendorAgent',
              dataKey: 'vendor_agent_id',
              dataLabel: 'name',
              required: false,
              curdConfig: VendorAgentConfig
            }
          }
        },
        {
          name: 'vendor-payment-dropdown',
          extends: 'adv-select',
          wrappers: ['ta-field'],
          defaultOptions: {
            templateOptions: {
              placeholder: 'Please Select Vendor Payment Terms',
              label: 'Vendor Payment Terms',
              dataKey: 'payment_term_id',
              dataLabel: 'name',
              required: false,
              curdConfig: VendorPaymentTermsConfig
            }
          }
        },
        {
          name: 'customer-payment-dropdown',
          extends: 'adv-select',
          wrappers: ['ta-field'],
          defaultOptions: {
            templateOptions: {
              placeholder: 'Please Select Customer Payment Terms',
              label: 'Customer Payment Terms',
              dataKey: 'payment_term_id',
              dataLabel: 'name',
              required: false,
              curdConfig: CustomerPaymentConfig
            }
          }
        },
        {
          name: 'ledger-group-dropdown',
          extends: 'adv-select',
          wrappers: ['ta-field'],
          defaultOptions: {
            templateOptions: {
              placeholder: 'Please Select Ledger Group',
              label: 'Ledger Group',
              dataKey: 'ledger_group_id',
              dataLabel: 'name',
              required: false,
              curdConfig: LedgerGroupsConfig
            }
          }
        },
        {
          name: 'territory-dropdown',
          extends: 'adv-select',
          wrappers: ['ta-field'],
          defaultOptions: {
            templateOptions: {
              placeholder: 'Please Select Territory',
              label: 'Territory',
              dataKey: 'territory_id',
              dataLabel: 'name',
              required: false,
              curdConfig: TerritoryConfig
            }
          }
        },
        {
          name: 'machine-dropdown',
          extends: 'adv-select',
          wrappers: ['ta-field'],
          defaultOptions: {
            templateOptions: {
              placeholder: 'Please Select Machine',
              label: 'Machine',
              dataKey: 'machine_id',
              dataLabel: 'machine_name',
              required: false,
              curdConfig: MachineConfig
            }
          }
        },
        {
          name: 'production-status-dropdown',
          extends: 'adv-select',
          wrappers: ['ta-field'],
          defaultOptions: {
            templateOptions: {
              placeholder: 'Please Select Production Status',
              label: 'Production Status',
              dataKey: 'status_id',
              dataLabel: 'status_name',
              required: false,
              curdConfig: ProductionStatusesConfig
            }
          }
        },
        // {
        //   name: 'order-status-dropdown',
        //   extends: 'adv-select',
        //   wrappers: ['ta-field'],
        //   defaultOptions: {
        //     templateOptions: {
        //       placeholder: 'Please Select Order Status',
        //       label: 'Order Status',
        //       dataKey: 'order_status_id',
        //       dataLabel: 'status_name',
        //       required: false,
        //       curdConfig: OrderStatusConfig
        //     }
        //   }
        // },
        {
          name: 'gst-types-dropdown',
          extends: 'adv-select',
          wrappers: ['ta-field'],
          defaultOptions: {
            templateOptions: {
              placeholder: 'Please Select Gst Types',
              label: 'Gst Types',
              dataKey: 'gst_type_id',
              dataLabel: 'name',
              required: false,
              curdConfig: GstTypesConfig
            }
          }
        },
        {
          name: 'order-types-dropdown',
          extends: 'adv-select',
          wrappers: ['ta-field'],
          defaultOptions: {
            templateOptions: {
              placeholder: 'Please Select Order Types',
              label: 'Order Types',
              dataKey: 'order_type_id',
              dataLabel: 'name',
              required: false,
              curdConfig: OrderTypesConfig
            }
          }
        },
        {
          name: 'purchase-types-dropdown',
          extends: 'adv-select',
          wrappers: ['ta-field'],
          defaultOptions: {
            templateOptions: {
              placeholder: 'Please Select Purchase Types',
              label: 'Purchase Types',
              dataKey: 'purchase_type_id',
              dataLabel: 'name',
              required: false,
              curdConfig: PurchaseTypesConfig
            }
          }
        },
        {
          name: 'sale-types-dropdown',
          extends: 'adv-select',
          wrappers: ['ta-field'],
          defaultOptions: {
            templateOptions: {
              placeholder: 'Please Select Sale Types',
              label: 'Sale Types',
              dataKey: 'sale_type_id',
              dataLabel: 'name',
              required: false,
              curdConfig: SaleTypesConfig
            }
          }
        },
        {
          name: 'user-groups-dropdown',
          extends: 'adv-select',
          wrappers: ['ta-field'],
          defaultOptions: {
            templateOptions: {
              placeholder: 'Please Select User Groups',
              label: 'User Groups',
              dataKey: 'group_id',
              dataLabel: 'group_name',
              required: false,
              curdConfig: UserGroupsConfig
            }
          }
        },
        {
          name: 'reminder-types-dropdown',
          extends: 'adv-select',
          wrappers: ['ta-field'],
          defaultOptions: {
            templateOptions: {
              placeholder: 'Please Select Reminder Types',
              label: 'Reminder Types',
              dataKey: 'reminder_type_id',
              dataLabel: 'type_name',
              required: false,
              curdConfig: ReminderTypesConfig
            }
          }
        },
        {
          name: 'payment-links-dropdown',
          extends: 'adv-select',
          wrappers: ['ta-field'],
          defaultOptions: {
            templateOptions: {
              placeholder: 'Please Select payment Links',
              label: 'payment Links',
              dataKey: 'payment_link_type_id',
              dataLabel: 'name',
              required: false,
              curdConfig: PaymentLinkConfig
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
              required: false,
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
              required: false,
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
              required: false,
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
              required: false,
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
              required: false,
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
              required: false,
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
              required: false,
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
              required: false,
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
              required: false,
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
              required: false,
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
              required: false,
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
              required: false,
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
              required: false,
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
              required: false,
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
              required: false,
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
              required: false,
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
              required: false,
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
              required: false,
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
              required: false,
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
              required: false,
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
              required: false,
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
              required: false,
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
              required: false,
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
              required: false,
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
              required: false,
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
              required: false,
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
              required: false,
              curdConfig: taskPrioritiesConfig  
            }
          }
        },
        
      ],
    })
  ]
})
export class FomrlyMasterAdvSelectFieldsModule { }
