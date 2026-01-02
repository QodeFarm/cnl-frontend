import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { AssetCategoriesConfig, AssetStatusConfig, cityConfig, CountryConfig, customerCategoryConfig, customerCudConfig, CustomerPaymentConfig, designationsConfig, employeeSalaryComponentsConfig, expenseCategoryConfig, FirmStatusConfig, gPackageUnitsConfig, GstCatConfig, GstTypesConfig, interactionTypesConfig, jobTypesConfig, leadStatusesConfig, leaveTypesConfig, ledgerAccountsConfig, LedgerGroupsConfig, LocationsAssetConfig, MachineConfig, OrderStatusConfig, OrderTypesConfig, packUnitConfig, PaymentLinkConfig, PriceCatConfig, productBrandsConfig, productCategoriesConfig, productColorsConfig, productGroupsConfig, productGstClassificationsConfig, productionFloorsConfig, ProductionStatusesConfig, productModesConfig, productPurchaseGLConfig, productSalesGLConfig, productsCrudConfig, productSizesConfig, productStockUnitsConfig, productTypesConfig, productUniqueQuantityCodesConfig, PurchaseTypesConfig, ReminderTypesConfig, SaleTypesConfig, shiftsConfig, StateConfig, statusConfig, taskPrioritiesConfig, TerritoryConfig, TransportConfig, unitOptionsConfig, UserGroupsConfig, VendorAgentConfig, vendorCategeoryConfig, VendorCurdConfig, VendorPaymentTermsConfig, warehouseLocationsConfig } from '../utils/master-curd-config';



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
              placeholder: ' Select',
              label: 'Customers',
              dataKey: 'customer_id',
              dataLabel: 'name',
              required: false,
              curdConfig: customerCudConfig
            }
          }
        },
        {
          name: 'vendor-dropdown',
          extends: 'adv-select',
          wrappers: ['ta-field'],
          defaultOptions: {
            templateOptions: {
              placeholder: ' Select',
              label: 'Vendors',
              dataKey: 'vendor_id',
              dataLabel: 'name',
              required: false,
              curdConfig: VendorCurdConfig
            }
          }
        },
        {
          name: 'customer-cagtegory-dropdown',
          extends: 'adv-select',
          wrappers: ['ta-field'],
          defaultOptions: {
            templateOptions: {
              placeholder: ' Category Select',
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
              placeholder: ' Select Ledger',
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
              placeholder: ' Select City',
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
              placeholder: ' Select State',
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
              placeholder: 'Select Country',
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
              placeholder: ' Select Category',
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
              placeholder: ' Select Status',
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
              placeholder: ' Select Transport',
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
              placeholder: ' Select Firmstatus',
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
              placeholder: ' Select GST Categeory',
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
              placeholder: ' Select Price Categeory',
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
              placeholder: ' Select VendorAgent',
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
              placeholder: ' Select Vendor Payment Terms',
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
              placeholder: ' Select Customer Payment Terms',
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
              placeholder: ' Select Ledger Group',
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
              placeholder: ' Select Territory',
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
              placeholder: ' Select Machine',
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
              placeholder: ' Select Production Status',
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
        //       placeholder: ' Select Order Status',
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
              placeholder: ' Select Gst Types',
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
              placeholder: ' Select Order Types',
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
              placeholder: ' Select Purchase Types',
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
              placeholder: ' Select Sale Types',
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
              placeholder: ' Select User Groups',
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
              placeholder: ' Select Reminder Types',
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
              placeholder: ' Select payment Links',
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
              placeholder: '  Select Product Mode',
              label: ' Product Mode',
              dataKey: 'item_master_id',
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
              placeholder: ' Select productSalesGL',
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
              placeholder: ' Select Product Type',
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
              placeholder: '  Select Product Brand',
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
              placeholder: ' Select Product Groups',
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
              placeholder: ' Select Product Stock Units',
              label: 'Product Stock Units',
              dataKey: 'stock_unit_id',
              dataLabel: 'name',
              required: false,
              curdConfig: productStockUnitsConfig
            }
          }
        },
        {
          name: 'productUniqueQuantityCodes-dropdown',
          extends: 'adv-select',
          wrappers: ['ta-field'],
          defaultOptions: {
            templateOptions: {
              placeholder: ' Select Quantity Code',
              label: 'Quantity Code',
              dataKey: 'quantity_code_id',
              dataLabel: 'name',
              required: false,
              curdConfig: productUniqueQuantityCodesConfig
            }
          }
        },
        

        {
          name: 'productCategories-dropdown',
          extends: 'adv-select',
          wrappers: ['ta-field'],
          defaultOptions: {
            templateOptions: {
              placeholder: ' Select Product Categories',
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
              placeholder: ' Select Product GST Classifications',
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
              placeholder: ' Select Product Item Type',
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
              placeholder: ' Select Product Purchase GL',
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
              placeholder: ' Select Product Unit Options',
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
              placeholder: ' Select Product Sizes',
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
              placeholder: ' Select Product Colors',
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
              placeholder: ' Select Warehouse Locations',
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
              placeholder: ' Select Pack Units',
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
              placeholder: ' Select GPack Units',
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
              placeholder: ' Select Job Types',
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
              placeholder: ' Select Designations',
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
              placeholder: ' Select Job Codes',
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
              placeholder: ' Select Departments',
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
              placeholder: ' Select Shifts',
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
              placeholder: ' Select Salary Components',
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
              placeholder: ' Select Salary Components',
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
              placeholder: ' Select Leave Types',
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
              placeholder: ' Select Lead Statuses',
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
              placeholder: ' Select Interaction Types',
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
              placeholder: ' Select Task Priorities',
              label: 'Task Priorities',
              dataKey: 'priority_id',
              dataLabel: 'priority_name',
              required: false,
              curdConfig: taskPrioritiesConfig  
            }
          }
        },

        {
          name: 'asset-cat-dropdown',
          extends: 'adv-select',
          wrappers: ['ta-field'],
          defaultOptions: {
            templateOptions: {
              placeholder: ' Select Asset Categorey',
              label: 'Asset Categorey',
              dataKey: 'asset_category_id',
              dataLabel: 'category_name',
              required: true,
              curdConfig: AssetCategoriesConfig
            }
          }
        },
        {
          name: 'asset-status-dropdown',
          extends: 'adv-select',
          wrappers: ['ta-field'],
          defaultOptions: {
            templateOptions: {
              placeholder: ' Select Asset Statuses',
              label: 'Asset Statuses',
              dataKey: 'asset_status_id',
              dataLabel: 'status_name',
              required: true,
              curdConfig: AssetStatusConfig
            }
          }
        },
        {
          name: 'location-dropdown',
          extends: 'adv-select',
          wrappers: ['ta-field'],
          defaultOptions: {
            templateOptions: {
              placeholder: ' Select location',
              label: 'Location',
              dataKey: 'location_id',
              dataLabel: 'location_name',
              required: true,
              curdConfig: LocationsAssetConfig
            }
          }
        },
        {
          name: 'products-dropdown',
          extends: 'adv-select',
          wrappers: ['ta-field'],
          defaultOptions: {
            templateOptions: {
              placeholder: ' Select Products',
              label: 'Products',
              dataKey: 'product_id',
              dataLabel: 'name',
              required: false,
              curdConfig: productsCrudConfig
            }
          }
        },
        {
          name: 'productionFloors-dropdown',
          extends: 'adv-select',
          wrappers: ['ta-field'],
          defaultOptions: {
            templateOptions: {
              placeholder: ' Select Production Floor',
              label: 'Production Floor',
              dataKey: 'production_floor_id',
              dataLabel: 'floor_name',
              required: true,
              curdConfig: productionFloorsConfig
            }
          }

        },
        {
          name: 'expenseCategory-dropdown',
          extends: 'adv-select',
          wrappers: ['ta-field'],
          defaultOptions: {
            templateOptions: {
              placeholder: ' Select Category',
              label: 'Category', 
              dataKey: 'category_id',
              dataLabel: '',
              required: true,
              curdConfig: expenseCategoryConfig
            }
          }

        }
        //     {
        //   name: 'products-dropdown',
        //   extends: 'adv-select',
        //   wrappers: ['ta-field'],
        //   defaultOptions: {
        //     templateOptions: {
        //       placeholder: ' Select Products',
        //       label: 'Products',
        //       dataKey: 'product_id',
        //       dataLabel: 'name',
        //       valueProp: 'product_id',
        //       labelProp: 'name',
        //       required: true,
        //       curdConfig: productsCrudConfig
        //     },
        //     hooks: {
        //       onInit: (field: any) => {
        //         const parentArray = field.parent;
        //         if (!parentArray) return;

        //         const currentRowIndex = +parentArray.key;
        //         const modelRow = field?.form?.model?.sale_order_items?.[currentRowIndex];

        //         // 🔹 Handle edit mode
        //         let existingValue = modelRow?.product || modelRow?.product_id;

        //         if (existingValue) {
        //           if (typeof existingValue === 'string') {
        //             // Look for option match
        //             const match = field.templateOptions.options?.find(
        //               opt => opt.product_id === existingValue
        //             );

        //             field.formControl.setValue(
        //               match || { product_id: existingValue, name: modelRow?.product_name || '' },
        //               { emitEvent: false }
        //             );
        //           } else {
        //             // Already a product object
        //             field.formControl.setValue(existingValue, { emitEvent: false });
        //           }
        //         }

        //         // 🔹 Subscribe to changes globally
        //         field.formControl.valueChanges.subscribe((data: any) => {
        //           if (!modelRow) {
        //             field.form.model.sale_order_items[currentRowIndex] = {};
        //           }
        //           field.form.model.sale_order_items[currentRowIndex]['product_id'] = data?.product_id;
        //         });
        //       }
        //     }
        //   }
        // },
              ],
            })
          ]
        })
        export class FomrlyMasterAdvSelectFieldsModule { }
