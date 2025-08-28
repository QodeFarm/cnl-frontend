import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule } from '@ngx-formly/core';
import { cityConfig, CountryConfig, customerCategoryConfig, customerCudConfig, CustomerPaymentConfig, FirmStatusConfig, GstCatConfig, GstTypesConfig, ledgerAccountsConfig, LedgerGroupsConfig, MachineConfig, OrderStatusConfig, OrderTypesConfig, PaymentLinkConfig, PriceCatConfig, ProductionStatusesConfig, PurchaseTypesConfig, ReminderTypesConfig, SaleTypesConfig, StateConfig, statusConfig, TerritoryConfig, TransportConfig, UserGroupsConfig, VendorAgentConfig, vendorCategeoryConfig, VendorPaymentTermsConfig } from '../utils/master-curd-config';



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
        }
      ],
    })
  ]
})
export class FomrlyMasterAdvSelectFieldsModule { }
