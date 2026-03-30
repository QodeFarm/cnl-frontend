import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TaFormComponent, TaFormConfig } from '@ta/ta-form';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { NzNotificationModule, NzNotificationService } from 'ng-zorro-antd/notification';
import { DeliveryChallanListComponent } from './delivery-challan-list/delivery-challan-list.component';
import { displayInformation, getUnitData } from 'src/app/utils/display.utils';

@Component({
  selector: 'app-delivery-challan',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule, DeliveryChallanListComponent, NzNotificationModule],
  templateUrl: './delivery-challan.component.html',
  styleUrls: ['./delivery-challan.component.scss']
})
export class DeliveryChallanComponent implements OnInit {

  @ViewChild('deliveryChallanForm', { static: false }) deliveryChallanForm: TaFormComponent | undefined;
  @ViewChild(DeliveryChallanListComponent) deliveryChallanListComponent!: DeliveryChallanListComponent;

  isCustomerPortal: boolean = false;
  showDeliveryChallanList: boolean = false;
  showForm: boolean = false;
  DeliveryChallanEditID: any = null;
  isConverting: boolean = false;
  dataToPopulate: any = null;
  challanNumber: any = null;

  formConfig: TaFormConfig = {};

  nowDate = () => {
    const date = new Date();
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  };

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.isCustomerPortal = data['customerView'] || false;

      if (this.isCustomerPortal) {
        this.showDeliveryChallanList = true;
        this.showForm = false;
        this.DeliveryChallanEditID = null;
        return;
      }

      this.showDeliveryChallanList = false;
      this.showForm = false;
      this.DeliveryChallanEditID = null;
      this.dataToPopulate = null;
      this.challanNumber = null;
      this.setFormConfig();
      this.cdr.detectChanges();  // destroy old TaFormComponent before recreating
      this.showForm = true;
      this.getOrderNo();
    });
  }

  getOrderNo(): void {
    this.http.get('masters/generate_order_no/?type=DC').subscribe((res: any) => {
      if (res?.data?.order_number) {
        this.challanNumber = res.data.order_number;
        this.formConfig.model['delivery_challan']['challan_no'] = this.challanNumber;
        // Update the form control directly so the field shows the number
        const formControls = (this.deliveryChallanForm?.form?.controls?.['delivery_challan'] as any)?.controls;
        if (formControls?.['challan_no']) {
          formControls['challan_no'].setValue(this.challanNumber);
        }
        this.cdr.detectChanges();
      }
    });
  }

  showDeliveryChallanListFn(): void {
    this.showDeliveryChallanList = true;
    this.deliveryChallanListComponent?.refreshTable();
  }

  hide(): void {
    const modalClose = document.getElementById('dcModalClose');
    if (modalClose) modalClose.click();
  }

  editDeliveryChallan(id: string): void {
    this.showForm = false;
    this.http.get('sales/delivery_challan/' + id).subscribe((res: any) => {
      if (res && res.data) {
        this.dataToPopulate = res.data;
        this.DeliveryChallanEditID = null;  // reset before setFormConfig
        this.setFormConfig();
        this.DeliveryChallanEditID = id;    // restore after setFormConfig
        this.formConfig.pkId = 'delivery_challan_id';
        this.formConfig.submit.label = 'Update';
        // Merge data into model so plain input fields (challan_no, dates, etc.) render correctly
        Object.assign(this.formConfig.model['delivery_challan'], res.data.delivery_challan || {});
        this.formConfig.model['delivery_challan_items'] = res.data.delivery_challan_items || [];
        this.showForm = true;
        this.cdr.detectChanges();
      }
    });
    this.hide();
  }

  createDeliveryChallan(): void {
    const validItems = (this.formConfig.model['delivery_challan_items'] || []).filter(
      (item: any) => item.product_id && item.quantity
    );
    if (validItems.length === 0) {
      this.notification.error('Validation', 'Please add at least one product with quantity before saving.', { nzDuration: 3000, nzPlacement: 'topRight' });
      return;
    }

    const payload = {
      delivery_challan: this.formConfig.model['delivery_challan'],
      delivery_challan_items: validItems,
      order_attachments: this.formConfig.model['order_attachments'] || [],
      order_shipments: this.formConfig.model['order_shipments'] || {}
    };

    this.http.post('sales/delivery_challan/', payload).subscribe(
      (response: any) => {
        const challanNo = response?.data?.delivery_challan?.challan_no || '';
        this.ngOnInit();
        this.notification.success('Created', `Delivery Challan ${challanNo} created successfully`, { nzDuration: 3000, nzPlacement: 'topRight' });
      },
      (error) => {
        console.error('Error creating Delivery Challan:', error);
        this.notification.error('Error', 'Error creating Delivery Challan', { nzDuration: 3000, nzPlacement: 'topRight' });
      }
    );
  }

  updateDeliveryChallan(): void {
    const challanId = this.formConfig.model['delivery_challan']['delivery_challan_id'];
    const validItems = (this.formConfig.model['delivery_challan_items'] || []).filter(
      (item: any) => item.product_id && item.quantity
    );
    if (validItems.length === 0) {
      this.notification.error('Validation', 'Please add at least one product with quantity before saving.', { nzDuration: 3000, nzPlacement: 'topRight' });
      return;
    }

    const payload = {
      delivery_challan: this.formConfig.model['delivery_challan'],
      delivery_challan_items: validItems,
      order_attachments: this.formConfig.model['order_attachments'] || [],
      order_shipments: this.formConfig.model['order_shipments'] || {}
    };

    this.http.put(`sales/delivery_challan/${challanId}/`, payload).subscribe(
      (response: any) => {
        this.ngOnInit();
        this.notification.success('Updated', 'Delivery Challan updated successfully', { nzDuration: 3000, nzPlacement: 'topRight' });
      },
      (error) => {
        console.error('Error updating Delivery Challan:', error);
        this.notification.error('Error', 'Error updating Delivery Challan', { nzDuration: 3000, nzPlacement: 'topRight' });
      }
    );
  }

  convertToInvoice(): void {
    const challanId = this.DeliveryChallanEditID
      || this.formConfig.model?.['delivery_challan']?.['delivery_challan_id'];

    if (!challanId) {
      this.notification.warning('Warning', 'Please save the challan before converting to invoice', { nzDuration: 3000, nzPlacement: 'topRight' });
      return;
    }

    if (this.formConfig.model?.['delivery_challan']?.['is_converted']) {
      this.notification.warning('Warning', 'This challan has already been converted to an invoice', { nzDuration: 3000, nzPlacement: 'topRight' });
      return;
    }

    this.isConverting = true;
    this.http.post(`sales/delivery_challan/${challanId}/convert_to_invoice/`, {}).subscribe(
      (res: any) => {
        this.isConverting = false;
        if (res && res.data) {
          this.notification.success('Converted', `Converted to Invoice: ${res.data.invoice_no}`, { nzDuration: 4000, nzPlacement: 'topRight' });
          this.editDeliveryChallan(challanId);
        }
      },
      (error) => {
        this.isConverting = false;
        const msg = error?.error?.message || 'Error converting challan to invoice';
        this.notification.error('Error', msg, { nzDuration: 3000, nzPlacement: 'topRight' });
      }
    );
  }

  totalAmountCal(): void {
    const items: any[] = this.formConfig.model['delivery_challan_items'] || [];
    const header = this.formConfig.model['delivery_challan'] || {};

    let itemValue = 0;
    items.forEach((item: any) => {
      itemValue += Number(item.amount || 0);
    });

    const discount = Number(header.discount || 0);
    const disAmt = itemValue * discount / 100;
    const taxable = itemValue - disAmt;
    const taxAmount = Number(header.tax_amount || 0);
    const cessAmount = Number(header.cess_amount || 0);
    const transport = Number(header.transport_charges || 0);
    const roundOff = Number(header.round_off || 0);
    const total = taxable + taxAmount + cessAmount + transport + roundOff;

    // Update form controls to trigger Angular change detection and refresh the UI
    const formControls = (this.deliveryChallanForm?.form?.controls?.['delivery_challan'] as any)?.controls;
    if (formControls) {
      formControls['item_value']?.setValue(itemValue.toFixed(2));
      formControls['dis_amt']?.setValue(disAmt.toFixed(2));
      formControls['taxable']?.setValue(taxable.toFixed(2));
      formControls['total_amount']?.setValue(total.toFixed(2));
    } else {
      header.item_value = itemValue.toFixed(2);
      header.dis_amt = disAmt.toFixed(2);
      header.taxable = taxable.toFixed(2);
      header.total_amount = total.toFixed(2);
    }
  }

  setFormConfig(): void {
    this.formConfig = {
      title: '',
      formState: { viewMode: false },
      showActionBtn: true,
      exParams: [
        {
          key: 'delivery_challan_items',
          type: 'script',
          value: 'data.delivery_challan_items.map(m=> { m.product_id = m.product?.product_id || m.product_id; return m; })'
        },
        {
          key: 'delivery_challan_items',
          type: 'script',
          value: 'data.delivery_challan_items.map(m=> { m.size_id = m.size?.size_id || null; return m; })'
        },
        {
          key: 'delivery_challan_items',
          type: 'script',
          value: 'data.delivery_challan_items.map(m=> { m.color_id = m.color?.color_id || null; return m; })'
        }
      ],
      submit: {
        label: 'Submit',
        submittedFn: () => {
          if (!this.DeliveryChallanEditID) {
            this.createDeliveryChallan();
          } else {
            this.updateDeliveryChallan();
          }
        }
      },
      reset: {
        resetFn: () => {
          this.DeliveryChallanEditID = null;
          this.dataToPopulate = null;
          this.challanNumber = null;
          this.ngOnInit();
        }
      },
      model: {
        delivery_challan: {},
        delivery_challan_items: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
        order_attachments: [],
        order_shipments: {}
      },
      fields: [
        // ===== HEADER SECTION (two-column layout: fields left, totals right) =====
        {
          fieldGroupClassName: 'ant-row custom-form-block row ms-0 align-items-start',
          key: 'delivery_challan',
          fieldGroup: [
            // LEFT: form fields
            {
              className: 'col-lg-9 col-md-8 col-12 p-0',
              fieldGroupClassName: 'ant-row mx-0 row align-items-end mt-2',
              fieldGroup: [
                {
                  key: 'customer',
                  type: 'customer-dropdown',
                  className: 'col-md-4 col-sm-6 col-12',
                  props: {
                    label: 'Customer',
                    dataKey: 'customer_id',
                    dataLabel: 'name',
                    options: [],
                    required: true,
                    lazy: {
                      url: 'customers/customers/?summary=true',
                      lazyOneTime: false
                    }
                  },
                  hooks: {
                    onInit: (field: any) => {
                      field.formControl.valueChanges.subscribe((data: any) => {
                        if (data && data.customer_id) {
                          this.formConfig.model['delivery_challan']['customer_id'] = data.customer_id;
                          if (data.customer_addresses?.billing_address) {
                            field.form.get('billing_address')?.setValue(data.customer_addresses.billing_address);
                          }
                          if (data.customer_addresses?.shipping_address) {
                            field.form.get('shipping_address')?.setValue(data.customer_addresses.shipping_address);
                          }
                          if (data.email) {
                            field.form.get('email')?.setValue(data.email);
                          }
                        }
                      });
                      if (this.dataToPopulate?.delivery_challan?.customer && field.formControl) {
                        field.formControl.setValue(this.dataToPopulate.delivery_challan.customer);
                      }
                    }
                  }
                },
                {
                  key: 'challan_no',
                  type: 'input',
                  className: 'col-md-4 col-sm-6 col-12',
                  templateOptions: {
                    label: 'Challan No',
                    placeholder: 'Auto Generated',
                    readonly: true
                  },
                  hooks: {
                    onInit: (field: any) => {
                      // Edit mode: populate from existing record
                      const existing = this.dataToPopulate?.delivery_challan?.challan_no;
                      if (existing && field.formControl) {
                        field.formControl.setValue(existing);
                        return;
                      }
                      // Create mode: populate from pre-fetched order number
                      if (this.challanNumber && field.formControl) {
                        field.formControl.setValue(this.challanNumber);
                      }
                    }
                  }
                },
                {
                  key: 'challan_date',
                  type: 'date',
                  defaultValue: this.nowDate(),
                  className: 'col-md-4 col-sm-6 col-12',
                  templateOptions: {
                    type: 'date',
                    label: 'Challan Date',
                    required: true
                  },
                  hooks: {
                    onInit: (field: any) => {
                      const v = this.dataToPopulate?.delivery_challan?.challan_date;
                      if (v && field.formControl) field.formControl.setValue(v);
                    }
                  }
                },
                {
                  key: 'tax',
                  type: 'select',
                  className: 'col-md-4 col-sm-6 col-12',
                  templateOptions: {
                    label: 'Tax',
                    options: [
                      { label: 'Exclusive', value: 'Exclusive' },
                      { label: 'Inclusive', value: 'Inclusive' }
                    ]
                  },
                  hooks: {
                    onInit: (field: any) => {
                      if (this.dataToPopulate?.delivery_challan?.tax && field.formControl) {
                        field.formControl.setValue(this.dataToPopulate.delivery_challan.tax);
                      } else {
                        field.formControl.setValue('Exclusive');
                      }
                    }
                  }
                },
                {
                  key: 'gst_type',
                  type: 'gst-types-dropdown',
                  className: 'col-md-4 col-sm-6 col-12',
                  templateOptions: {
                    label: 'GST Type',
                    placeholder: 'Select GST Type',
                    dataKey: 'gst_type_id',
                    dataLabel: 'name',
                    required: true,
                    lazy: { url: 'masters/gst_types/', lazyOneTime: true }
                  },
                  hooks: {
                    onInit: (field: any) => {
                      field.formControl.valueChanges.subscribe((data: any) => {
                        if (data && data.gst_type_id) {
                          this.formConfig.model['delivery_challan']['gst_type_id'] = data.gst_type_id;
                        }
                      });
                      if (this.dataToPopulate?.delivery_challan?.gst_type && field.formControl) {
                        field.formControl.setValue(this.dataToPopulate.delivery_challan.gst_type);
                      }
                    }
                  }
                },
                {
                  key: 'order_salesman',
                  type: 'orders-salesman-dropdown',
                  className: 'col-md-4 col-sm-6 col-12',
                  templateOptions: {
                    label: 'Salesman',
                    placeholder: 'Select Salesman',
                    dataKey: 'order_salesman_id',
                    dataLabel: 'name',
                    lazy: { url: 'masters/orders_salesman/', lazyOneTime: true }
                  },
                  hooks: {
                    onInit: (field: any) => {
                      field.formControl.valueChanges.subscribe((data: any) => {
                        if (data && data.order_salesman_id) {
                          this.formConfig.model['delivery_challan']['order_salesman_id'] = data.order_salesman_id;
                        }
                      });
                      if (this.dataToPopulate?.delivery_challan?.orders_salesman && field.formControl) {
                        field.formControl.setValue(this.dataToPopulate.delivery_challan.orders_salesman);
                      }
                    }
                  }
                },
                {
                  key: 'remarks',
                  type: 'textarea',
                  className: 'col-md-4 col-sm-6 col-12',
                  templateOptions: { label: 'Remarks', placeholder: 'Enter Remarks' },
                  hooks: {
                    onInit: (field: any) => {
                      const v = this.dataToPopulate?.delivery_challan?.remarks;
                      if (v && field.formControl) field.formControl.setValue(v);
                    }
                  }
                },
              ]
            },
            // RIGHT: summary totals panel (display only — all auto-computed)
            {
              className: 'col-lg-3 col-md-4 col-12 p-md-0 inline-form-fields',
              fieldGroupClassName: 'ant-row row mx-0 mt-2',
              fieldGroup: [
                {
                  key: 'item_value',
                  type: 'text',
                  className: 'col-12',
                  templateOptions: { label: 'Items Total', disabled: true },
                  defaultValue: '0.00'
                },
                {
                  key: 'dis_amt',
                  type: 'text',
                  className: 'col-12',
                  templateOptions: { label: 'Discount Amount', disabled: true },
                  defaultValue: '0.00'
                },
                {
                  key: 'taxable',
                  type: 'text',
                  className: 'col-12',
                  templateOptions: { label: 'Taxable Amount', disabled: true },
                  defaultValue: '0.00'
                },
                {
                  key: 'cgst',
                  type: 'text',
                  className: 'col-12',
                  templateOptions: { label: 'Output CGST', disabled: true },
                  defaultValue: '0.00',
                  expressionProperties: {
                    'model.cgst': (model: any) => {
                      const address = model.billing_address || model.shipping_address || '';
                      const isIntraState = address === '' || address.toLowerCase().includes('andhra pradesh');
                      const taxAmount = parseFloat(model.tax_amount || 0);
                      return isIntraState ? (taxAmount / 2).toFixed(2) : '0.00';
                    }
                  },
                  hideExpression: (model: any) => {
                    const address = model.billing_address || model.shipping_address || '';
                    const isIntraState = address === '' || address.toLowerCase().includes('andhra pradesh');
                    return !isIntraState;
                  }
                },
                {
                  key: 'sgst',
                  type: 'text',
                  className: 'col-12',
                  templateOptions: { label: 'Output SGST', disabled: true },
                  defaultValue: '0.00',
                  expressionProperties: {
                    'model.sgst': (model: any) => {
                      const address = model.billing_address || model.shipping_address || '';
                      const isIntraState = address === '' || address.toLowerCase().includes('andhra pradesh');
                      const taxAmount = parseFloat(model.tax_amount || 0);
                      return isIntraState ? (taxAmount / 2).toFixed(2) : '0.00';
                    }
                  },
                  hideExpression: (model: any) => {
                    const address = model.billing_address || model.shipping_address || '';
                    const isIntraState = address === '' || address.toLowerCase().includes('andhra pradesh');
                    return !isIntraState;
                  }
                },
                {
                  key: 'igst',
                  type: 'text',
                  className: 'col-12',
                  templateOptions: { label: 'Output IGST', disabled: true },
                  defaultValue: '0.00',
                  expressionProperties: {
                    'model.igst': (model: any) => {
                      const address = model.billing_address || model.shipping_address || '';
                      const isIntraState = address === '' || address.toLowerCase().includes('andhra pradesh');
                      const taxAmount = parseFloat(model.tax_amount || 0);
                      return !isIntraState ? taxAmount.toFixed(2) : '0.00';
                    }
                  },
                  hideExpression: (model: any) => {
                    const address = model.billing_address || model.shipping_address || '';
                    const isIntraState = address === '' || address.toLowerCase().includes('andhra pradesh');
                    return isIntraState;
                  }
                },
                {
                  key: 'cess_amount',
                  type: 'text',
                  className: 'col-12',
                  templateOptions: { label: 'Cess Amount', disabled: true },
                  defaultValue: '0.00'
                },
                {
                  key: 'total_amount',
                  type: 'text',
                  className: 'col-12 product-total',
                  templateOptions: { label: ' ', placeholder: 'Total Amount', disabled: true },
                  defaultValue: '0.00'
                }
              ]
            }
          ]
        },

        // ===== ITEMS TABLE (repeat — same as sale invoice) =====
        {
          key: 'delivery_challan_items',
          type: 'repeat',
          className: 'custom-form-list product-table',
          templateOptions: {
            addText: 'Add Product',
            columnConfig: {
              moduleKey: 'delivery_challan_items',
              lockedColumns: ['product', 'quantity', 'rate', 'amount'],
              defaultHidden: ['discount_type', 'discount_amount', 'discount', 'remarks'],
              excludeFromSettings: [],
              defaultWidths: {
                product: 220,
                print_name: 200,
                code: 100,
                size: 100,
                color: 100,
                total_boxes: 110,
                unit_options_id: 90,
                quantity: 100,
                rate: 110,
                discount_type: 80,
                discount_amount: 90,
                discount: 100,
                amount: 120,
                tax: 80,
                cgst: 80,
                sgst: 80,
                igst: 80,
                remarks: 150
              },
              enableResize: true,
              minColumnWidth: 50
            },
            tableCols: [
              { name: 'product',        label: 'Product',      width: '220px' },
              { name: 'print_name',     label: 'Print Name',   width: '200px' },
              { name: 'code',           label: 'Code',         width: '100px' },
              { name: 'size',           label: 'Size',         width: '100px' },
              { name: 'color',          label: 'Color',        width: '100px' },
              { name: 'total_boxes',    label: 'Total Boxes',  width: '110px' },
              { name: 'unit_options_id',label: 'Unit',         width: '90px'  },
              { name: 'quantity',       label: 'Qty',           width: '100px' },
              { name: 'rate',           label: 'Rate',          width: '110px' },
              { name: 'discount_type',  label: 'Disc Type',     width: '80px'  },
              { name: 'discount_amount',label: 'Disc ₹',        width: '90px'  },
              { name: 'discount',       label: 'Disc %',        width: '100px' },
              { name: 'amount',         label: 'Amount',        width: '120px' },
              { name: 'tax',            label: 'Tax %',         width: '80px'  },
              { name: 'cgst',           label: 'CGST',          width: '80px'  },
              { name: 'sgst',           label: 'SGST',          width: '80px'  },
              { name: 'igst',           label: 'IGST',          width: '80px'  },
              { name: 'remarks',        label: 'Remarks',       width: '150px' }
            ]
          },
          fieldArray: {
            fieldGroup: [
              {
                key: 'product',
                type: 'products-dropdown',
                templateOptions: {
                  label: 'Product',
                  dataKey: 'product_id',
                  hideLabel: true,
                  dataLabel: 'name',
                  placeholder: 'product',
                  options: [],
                  required: false,
                  lazy: {
                    url: 'products/products/?summary=true',
                    lazyOneTime: true
                  }
                },
                hooks: {
                  onInit: (field: any) => {
                    const parentArray = field.parent;
                    if (!parentArray) return;
                    const idx = +parentArray.key;

                    const existing = this.dataToPopulate?.delivery_challan_items?.[idx]?.product;
                    if (existing) field.formControl.setValue(existing);

                    field.formControl.valueChanges.subscribe((data: any) => {
                      if (!this.formConfig.model['delivery_challan_items'][idx]) {
                        this.formConfig.model['delivery_challan_items'][idx] = {};
                      }
                      this.formConfig.model['delivery_challan_items'][idx]['product_id'] = data?.product_id;

                      // Auto-fill print_name, code, rate, tax from product
                      if (data) {
                        field.form.controls.print_name?.setValue(data.print_name || data.name || '');
                        field.form.controls.code?.setValue(data.code || '');
                        field.form.controls.rate?.setValue(data.sales_rate || data.sale_price || 0);
                        field.form.controls.tax?.setValue(data.gst_input || 0);
                      }

                      // Show product info banner in card header (same as Sale Invoice)
                      const unit = getUnitData(data);
                      const row = this.formConfig.model['delivery_challan_items'][idx];
                      displayInformation(row?.product || data, null, null, unit, '', '');
                    });
                  }
                }
              },
              {
                type: 'input',
                key: 'print_name',
                templateOptions: {
                  label: 'Print Name',
                  placeholder: 'name',
                  hideLabel: true
                },
                hooks: {
                  onInit: (field: any) => {
                    const idx = +field.parent?.key;
                    const existing = this.dataToPopulate?.delivery_challan_items?.[idx]?.print_name;
                    if (existing) field.formControl.setValue(existing);
                  }
                }
              },
              {
                type: 'input',
                key: 'code',
                templateOptions: {
                  label: 'Code',
                  placeholder: 'code',
                  hideLabel: true
                },
                hooks: {
                  onInit: (field: any) => {
                    const idx = +field.parent?.key;
                    const existing = this.dataToPopulate?.delivery_challan_items?.[idx]?.product?.code;
                    if (existing) field.formControl.setValue(existing);
                  }
                }
              },
              {
                key: 'size',
                type: 'select',
                templateOptions: {
                  label: 'Size',
                  dataKey: 'size_id',
                  hideLabel: true,
                  dataLabel: 'size_name',
                  placeholder: 'size',
                  options: [],
                  required: false,
                  lazy: { lazyOneTime: true }
                },
                hooks: {
                  onInit: (field: any) => {
                    const idx = +field.parent?.key;
                    const existing = this.dataToPopulate?.delivery_challan_items?.[idx]?.size;
                    if (existing?.size_id) field.formControl.setValue(existing);

                    field.formControl.valueChanges.subscribe((selectedSize: any) => {
                      this.formConfig.model['delivery_challan_items'][idx]['size_id'] = selectedSize?.size_id;
                    });
                  }
                }
              },
              {
                key: 'color',
                type: 'select',
                templateOptions: {
                  label: 'Color',
                  dataKey: 'color_id',
                  hideLabel: true,
                  dataLabel: 'color_name',
                  placeholder: 'color',
                  options: [],
                  required: false,
                  lazy: { lazyOneTime: true }
                },
                hooks: {
                  onInit: (field: any) => {
                    const idx = +field.parent?.key;
                    const existing = this.dataToPopulate?.delivery_challan_items?.[idx]?.color;
                    if (existing) field.formControl.setValue(existing);

                    field.formControl.valueChanges.subscribe((selectedColor: any) => {
                      this.formConfig.model['delivery_challan_items'][idx]['color_id'] = selectedColor?.color_id;
                    });
                  }
                }
              },
              {
                type: 'input',
                key: 'total_boxes',
                templateOptions: {
                  type: 'number',
                  label: 'Total Boxes',
                  placeholder: 'Boxes',
                  hideLabel: true
                },
                hooks: {
                  onInit: (field: any) => {
                    const idx = +field.parent?.key;
                    const existing = this.dataToPopulate?.delivery_challan_items?.[idx]?.total_boxes;
                    if (existing) field.formControl.setValue(existing);
                  }
                }
              },
              {
                type: 'select',
                key: 'unit_options_id',
                templateOptions: {
                  label: 'Unit',
                  placeholder: 'Unit',
                  hideLabel: true,
                  dataLabel: 'unit_name',
                  dataKey: 'unit_options_id',
                  bindId: true,
                  required: false,
                  lazy: {
                    url: 'masters/unit_options',
                    lazyOneTime: true
                  }
                },
                hooks: {
                  onInit: (field: any) => {
                    const idx = +field.parent?.key;
                    const existing = this.dataToPopulate?.delivery_challan_items?.[idx]?.product?.unit_options;
                    if (existing) field.formControl.setValue(existing.unit_options_id);
                  }
                }
              },
              {
                type: 'input',
                key: 'quantity',
                templateOptions: {
                  type: 'number',
                  step: 0.01,
                  label: 'Qty',
                  placeholder: 'Qty',
                  min: 1,
                  hideLabel: true,
                  required: false
                },
                hooks: {
                  onInit: (field: any) => {
                    const idx = +field.parent?.key;
                    const existing = this.dataToPopulate?.delivery_challan_items?.[idx]?.quantity;
                    if (existing) field.formControl.setValue(existing);

                    field.formControl.valueChanges.subscribe((quantity: any) => {
                      if (!field.form?.controls) return;
                      const rate = Number(field.form.controls.rate?.value || 0);
                      const qty = Number(quantity || 0);
                      const discType = field.form.controls.discount_type?.value || 'percentage';
                      const discPct = Number(field.form.controls.discount?.value || 0);
                      const discAmt = Number(field.form.controls.discount_amount?.value || 0);
                      const gross = rate * qty;
                      const deduction = discType === 'amount' ? discAmt : gross * discPct / 100;
                      if (rate && qty) {
                        field.form.controls.amount?.setValue(+(gross - deduction).toFixed(2));
                      }
                      this.totalAmountCal();
                    });
                  }
                }
              },
              {
                type: 'input',
                key: 'rate',
                templateOptions: {
                  type: 'number',
                  label: 'Rate',
                  placeholder: 'Enter Rate',
                  hideLabel: true
                },
                hooks: {
                  onInit: (field: any) => {
                    const idx = +field.parent?.key;
                    const existing = this.dataToPopulate?.delivery_challan_items?.[idx]?.rate;
                    if (existing) field.formControl.setValue(existing);

                    field.formControl.valueChanges.subscribe((rate: any) => {
                      if (!field.form?.controls) return;
                      const qty = Number(field.form.controls.quantity?.value || 0);
                      const r = Number(rate || 0);
                      const discType = field.form.controls.discount_type?.value || 'percentage';
                      const discPct = Number(field.form.controls.discount?.value || 0);
                      const discAmt = Number(field.form.controls.discount_amount?.value || 0);
                      const gross = r * qty;
                      const deduction = discType === 'amount' ? discAmt : gross * discPct / 100;
                      if (r && qty) field.form.controls.amount?.setValue(+(gross - deduction).toFixed(2));
                      this.totalAmountCal();
                    });
                  }
                }
              },
              {
                type: 'select',
                key: 'discount_type',
                templateOptions: {
                  placeholder: 'Type',
                  label: 'Disc Type',
                  hideLabel: true,
                  options: [
                    { label: '%', value: 'percentage' },
                    { label: '₹', value: 'amount' }
                  ]
                },
                defaultValue: 'percentage',
                hooks: {
                  onInit: (field: any) => {
                    const idx = +field.parent?.key;
                    const existing = this.dataToPopulate?.delivery_challan_items?.[idx]?.discount_type;
                    if (existing) field.formControl.setValue(existing);

                    field.formControl.valueChanges.subscribe((type: any) => {
                      if (!field.form?.controls) return;
                      if (type === 'percentage') {
                        field.form.controls.discount_amount?.setValue(0, { emitEvent: false });
                      } else {
                        field.form.controls.discount?.setValue(0, { emitEvent: false });
                      }
                      this.totalAmountCal();
                    });
                  }
                }
              },
              {
                type: 'input',
                key: 'discount_amount',
                templateOptions: {
                  type: 'number',
                  step: 0.01,
                  placeholder: 'Disc ₹',
                  label: 'Disc ₹',
                  hideLabel: true
                },
                expressionProperties: {
                  'templateOptions.disabled': (model: any) => model.discount_type === 'percentage'
                },
                hooks: {
                  onInit: (field: any) => {
                    const idx = +field.parent?.key;
                    const existing = this.dataToPopulate?.delivery_challan_items?.[idx]?.discount_amount;
                    if (existing) field.formControl.setValue(existing);

                    field.formControl.valueChanges.subscribe((value: any) => {
                      if (!field.form?.controls) return;
                      if (field.model.discount_type === 'percentage') return;
                      const rate = Number(field.form.controls.rate?.value || 0);
                      const qty = Number(field.form.controls.quantity?.value || 0);
                      const total = rate * qty;
                      if (total > 0) {
                        const amt = Math.min(Number(value || 0), total);
                        const pct = (amt / total) * 100;
                        field.form.controls.discount?.setValue(+pct.toFixed(2), { emitEvent: false });
                        field.form.controls.amount?.setValue(+(total - amt).toFixed(2));
                      }
                      this.totalAmountCal();
                    });
                  }
                }
              },
              {
                type: 'input',
                key: 'discount',
                templateOptions: {
                  type: 'number',
                  step: 0.01,
                  label: 'Disc %',
                  placeholder: 'Disc%',
                  hideLabel: true
                },
                expressionProperties: {
                  'templateOptions.disabled': (model: any) => model.discount_type === 'amount'
                },
                hooks: {
                  onInit: (field: any) => {
                    const idx = +field.parent?.key;
                    const existing = this.dataToPopulate?.delivery_challan_items?.[idx]?.discount;
                    if (existing) field.formControl.setValue(existing);

                    field.formControl.valueChanges.subscribe((pct: any) => {
                      if (!field.form?.controls) return;
                      if (field.model.discount_type === 'amount') return;
                      const rate = Number(field.form.controls.rate?.value || 0);
                      const qty = Number(field.form.controls.quantity?.value || 0);
                      const gross = rate * qty;
                      const deduction = gross * Number(pct || 0) / 100;
                      field.form.controls.amount?.setValue(+(gross - deduction).toFixed(2));
                      this.totalAmountCal();
                    });
                  }
                }
              },
              {
                type: 'input',
                key: 'amount',
                templateOptions: {
                  type: 'number',
                  label: 'Amount',
                  placeholder: '0.00',
                  hideLabel: true
                },
                hooks: {
                  onInit: (field: any) => {
                    const idx = +field.parent?.key;
                    const existing = this.dataToPopulate?.delivery_challan_items?.[idx]?.amount;
                    if (existing) field.formControl.setValue(existing);

                    field.formControl.valueChanges.subscribe(() => {
                      this.totalAmountCal();
                    });
                  }
                }
              },
              {
                type: 'input',
                key: 'tax',
                templateOptions: {
                  type: 'number',
                  step: 0.01,
                  label: 'Tax %',
                  placeholder: '0.00',
                  hideLabel: true
                },
                hooks: {
                  onInit: (field: any) => {
                    const idx = +field.parent?.key;
                    const existing = this.dataToPopulate?.delivery_challan_items?.[idx]?.tax;
                    if (existing) field.formControl.setValue(existing);
                  }
                }
              },
              {
                type: 'input',
                key: 'cgst',
                templateOptions: {
                  type: 'number',
                  label: 'CGST',
                  placeholder: '0.00',
                  hideLabel: true
                }
              },
              {
                type: 'input',
                key: 'sgst',
                templateOptions: {
                  type: 'number',
                  label: 'SGST',
                  placeholder: '0.00',
                  hideLabel: true
                }
              },
              {
                type: 'input',
                key: 'igst',
                templateOptions: {
                  type: 'number',
                  label: 'IGST',
                  placeholder: '0.00',
                  hideLabel: true
                }
              },
              {
                type: 'input',
                key: 'remarks',
                templateOptions: {
                  label: 'Remarks',
                  placeholder: 'Remarks',
                  hideLabel: true
                }
              }
            ]
          }
        },

        // ===== TABS: Billing Details | Other Details | Dispatch Info | Customer Details =====
        {
          fieldGroupClassName: 'row col-12 m-0 custom-form-card',
          className: 'tab-form-list px-3',
          type: 'tabs',
          fieldGroup: [
            // Tab 1: Billing Details (matches Sale Order / Sale Invoice pattern)
            {
              className: 'col-12 p-0',
              props: { label: 'Billing Details' },
              fieldGroup: [
                {
                  fieldGroupClassName: 'ant-row',
                  key: 'delivery_challan',
                  fieldGroup: [
                    {
                      key: 'payment_term',
                      type: 'customer-payment-dropdown',
                      className: 'col-md-4 col-lg-3 col-sm-6 col-12',
                      templateOptions: {
                        label: 'Payment Term',
                        placeholder: 'Select Payment Term',
                        dataKey: 'payment_term_id',
                        dataLabel: 'name',
                        lazy: { url: 'masters/customer_payment_terms/', lazyOneTime: true }
                      },
                      hooks: {
                        onInit: (field: any) => {
                          field.formControl.valueChanges.subscribe((data: any) => {
                            if (data && data.payment_term_id) {
                              this.formConfig.model['delivery_challan']['payment_term_id'] = data.payment_term_id;
                            }
                          });
                          if (this.dataToPopulate?.delivery_challan?.payment_term && field.formControl) {
                            field.formControl.setValue(this.dataToPopulate.delivery_challan.payment_term);
                          }
                        }
                      }
                    },
                    {
                      key: 'discount',
                      type: 'input',
                      className: 'col-md-4 col-lg-3 col-sm-6 col-12',
                      templateOptions: { type: 'number', label: 'Discount %', placeholder: 'Enter Discount %' },
                      defaultValue: 0,
                      hooks: {
                        onInit: (field: any) => {
                          const v = this.dataToPopulate?.delivery_challan?.discount;
                          if (v !== undefined && v !== null && field.formControl) field.formControl.setValue(v);
                          field.formControl.valueChanges.subscribe(() => this.totalAmountCal());
                        }
                      }
                    },
                    {
                      key: 'tax_amount',
                      type: 'input',
                      className: 'col-md-4 col-lg-3 col-sm-6 col-12',
                      templateOptions: { type: 'number', label: 'Tax Amount', placeholder: 'Enter Tax Amount' },
                      defaultValue: 0,
                      hooks: {
                        onInit: (field: any) => {
                          const v = this.dataToPopulate?.delivery_challan?.tax_amount;
                          if (v !== undefined && v !== null && field.formControl) field.formControl.setValue(v);
                          field.formControl.valueChanges.subscribe(() => this.totalAmountCal());
                        }
                      }
                    },
                    {
                      key: 'cess_amount',
                      type: 'input',
                      className: 'col-md-4 col-lg-3 col-sm-6 col-12',
                      templateOptions: { type: 'number', label: 'Cess Amount', placeholder: 'Enter Cess Amount' },
                      defaultValue: 0,
                      hooks: {
                        onInit: (field: any) => {
                          const v = this.dataToPopulate?.delivery_challan?.cess_amount;
                          if (v !== undefined && v !== null && field.formControl) field.formControl.setValue(v);
                          field.formControl.valueChanges.subscribe(() => this.totalAmountCal());
                        }
                      }
                    },
                    {
                      key: 'transport_charges',
                      type: 'input',
                      className: 'col-md-4 col-lg-3 col-sm-6 col-12',
                      templateOptions: { type: 'number', label: 'Transport Charges', placeholder: 'Enter Transport Charges' },
                      defaultValue: 0,
                      hooks: {
                        onInit: (field: any) => {
                          const v = this.dataToPopulate?.delivery_challan?.transport_charges;
                          if (v !== undefined && v !== null && field.formControl) field.formControl.setValue(v);
                          field.formControl.valueChanges.subscribe(() => this.totalAmountCal());
                        }
                      }
                    },
                    {
                      key: 'round_off',
                      type: 'input',
                      className: 'col-md-4 col-lg-3 col-sm-6 col-12',
                      templateOptions: { type: 'number', label: 'Round Off', placeholder: 'Enter Round Off' },
                      defaultValue: 0,
                      hooks: {
                        onInit: (field: any) => {
                          const v = this.dataToPopulate?.delivery_challan?.round_off;
                          if (v !== undefined && v !== null && field.formControl) field.formControl.setValue(v);
                          field.formControl.valueChanges.subscribe(() => this.totalAmountCal());
                        }
                      }
                    }
                  ]
                }
              ]
            },
            // Tab 2: Other Details
            {
              className: 'col-12 p-0',
              props: { label: 'Other Details' },
              fieldGroup: [
                {
                  fieldGroupClassName: 'ant-row',
                  key: 'delivery_challan',
                  fieldGroup: [
                    {
                      key: 'ref_no',
                      type: 'input',
                      className: 'col-md-4 col-lg-3 col-sm-6 col-12',
                      templateOptions: { label: 'Ref No', placeholder: 'Enter Ref No' },
                      hooks: {
                        onInit: (field: any) => {
                          const v = this.dataToPopulate?.delivery_challan?.ref_no;
                          if (v && field.formControl) field.formControl.setValue(v);
                        }
                      }
                    },
                    {
                      key: 'ref_date',
                      type: 'date',
                      defaultValue: this.nowDate(),
                      className: 'col-md-4 col-lg-3 col-sm-6 col-12',
                      templateOptions: { type: 'date', label: 'Ref Date' },
                      hooks: {
                        onInit: (field: any) => {
                          const v = this.dataToPopulate?.delivery_challan?.ref_date;
                          if (v && field.formControl) field.formControl.setValue(v);
                        }
                      }
                    },
                  ]
                }
              ]
            },
            // Tab 2: Dispatch Info
            {
              className: 'col-12 p-0',
              props: { label: 'Dispatch Info' },
              fieldGroup: [
                {
                  fieldGroupClassName: 'ant-row',
                  key: 'delivery_challan',
                  fieldGroup: [
                    {
                      key: 'vehicle_name',
                      type: 'input',
                      className: 'col-md-4 col-lg-3 col-sm-6 col-12',
                      templateOptions: { label: 'Vehicle Name / No', placeholder: 'Enter Vehicle Name or Number' },
                      hooks: {
                        onInit: (field: any) => {
                          const v = this.dataToPopulate?.delivery_challan?.vehicle_name;
                          if (v && field.formControl) field.formControl.setValue(v);
                        }
                      }
                    },
                    {
                      key: 'driver_name',
                      type: 'input',
                      className: 'col-md-4 col-lg-3 col-sm-6 col-12',
                      templateOptions: { label: 'Driver Name', placeholder: 'Enter Driver Name' },
                      hooks: {
                        onInit: (field: any) => {
                          const v = this.dataToPopulate?.delivery_challan?.driver_name;
                          if (v && field.formControl) field.formControl.setValue(v);
                        }
                      }
                    },
                    {
                      key: 'lr_no',
                      type: 'input',
                      className: 'col-md-4 col-lg-3 col-sm-6 col-12',
                      templateOptions: { label: 'LR No', placeholder: 'Enter Lorry Receipt No' },
                      hooks: {
                        onInit: (field: any) => {
                          const v = this.dataToPopulate?.delivery_challan?.lr_no;
                          if (v && field.formControl) field.formControl.setValue(v);
                        }
                      }
                    },
                    {
                      key: 'total_boxes',
                      type: 'input',
                      className: 'col-md-4 col-lg-3 col-sm-6 col-12',
                      templateOptions: { type: 'number', label: 'Total Boxes', placeholder: 'Enter Total Boxes' },
                      hooks: {
                        onInit: (field: any) => {
                          const v = this.dataToPopulate?.delivery_challan?.total_boxes;
                          if (v !== undefined && v !== null && field.formControl) field.formControl.setValue(v);
                        }
                      }
                    }
                  ]
                }
              ]
            },
            // Tab 3: Address Details (billing/shipping — also used by CGST/SGST/IGST logic)
            {
              className: 'col-12 p-0',
              props: { label: 'Customer Details' },
              fieldGroup: [
                {
                  fieldGroupClassName: 'ant-row',
                  key: 'delivery_challan',
                  fieldGroup: [
                    {
                      key: 'billing_address',
                      type: 'textarea',
                      className: 'col-md-6 col-sm-12 col-12',
                      templateOptions: { label: 'Billing Address', placeholder: 'Enter Billing Address' },
                      hooks: {
                        onInit: (field: any) => {
                          const v = this.dataToPopulate?.delivery_challan?.billing_address;
                          if (v && field.formControl) field.formControl.setValue(v);
                        }
                      }
                    },
                    {
                      key: 'shipping_address',
                      type: 'textarea',
                      className: 'col-md-6 col-sm-12 col-12',
                      templateOptions: { label: 'Shipping Address', placeholder: 'Enter Shipping Address' },
                      hooks: {
                        onInit: (field: any) => {
                          const v = this.dataToPopulate?.delivery_challan?.shipping_address;
                          if (v && field.formControl) field.formControl.setValue(v);
                        }
                      }
                    },
                  ]
                }
              ]
            }
          ]
        }
      ]
    };
  }
}
