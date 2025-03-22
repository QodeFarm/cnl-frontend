import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TaTableConfig } from '@ta/ta-table';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';

@Component({
  selector: 'app-production-reports',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './production-reports.component.html',
  styleUrls: ['./production-reports.component.scss']
})
export class ProductionReportsComponent {
  isAccordionOpen = true;
  selectedReportKey: string | null = null;
  tableConfig: TaTableConfig | null = null;
  // totalRecords: number | null = null; 

  reportsConfig: { [key: string]: TaTableConfig } = {

    // CustomerSummaryReport: {
    //   apiUrl: 'customers/customers/?customer_summary_report=true',
    //   pageSize: 10,
    //   globalSearch: {
    //     keys: ['customer_name', 'total_sales', 'total_paid', 'outstanding_balance']
    //   },
    //   defaultSort: { key: 'created_at', value: 'descend' },
    //   cols: [
    //     {
    //       fieldKey: 'name',
    //       name: 'Customer Name',
    //       sort: true
    //     },
    //     {
    //       fieldKey: 'total_sales',
    //       name: 'Total Sales',
    //       sort: true
    //     },
    //     {
    //       fieldKey: 'total_paid',
    //       name: 'Total Paid',
    //       sort: false,
    //     },
    //     {
    //       fieldKey: 'outstanding_balance',
    //       name: 'Balance',
    //       sort: false,
    //     },
    //   ]
    // },
    //====================================== Bill of Materials (BOM) Report ===========================
    BillofMaterialsReport: {
      apiUrl: 'production/bom',
      pageSize: 10,
      globalSearch: {
        keys: ['bom', 'product', 'code','unit_name','sales_rate','dis_amount','mrp']
      },
      defaultSort: { key: 'created_at', value: 'descend' },
      cols: [
        {
          fieldKey: 'bom',
          name: 'BOM Name',
          sort: true,
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            return `${row.bom_name}`;
          },
        },
        {
          fieldKey: 'product',
          name: 'Product',
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            return `${row.product.name}`;
          },
          sort: true
        },
        {
          fieldKey: 'code',
          name: 'Code',
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            return `${row.product.code}`;
          },
          sort: true
        },
        {
          fieldKey: 'unit_name',
          name: 'Unit Name',
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            return `${row.product.unit_options.unit_name}`;
          },
          sort: true
        },
        {
          fieldKey: 'sales_rate',
          name: 'Sales Rate',
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            return `${row.product.sales_rate}`;
          },
          sort: true
        },
        {
          fieldKey: 'dis_amount',
          name: 'Discount Amount',
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            return `${row.product.dis_amount}`;
          },
          sort: true
        },
        {
          fieldKey: 'mrp',
          name: 'MRP',
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            return `${row.product.mrp}`;
          },
          sort: true
        },
      ]
    },
    //====================================== WorkOrderStatusReport ===========================
    WorkOrderStatusReport: {
      apiUrl: 'production/work_order/',
      pageSize: 10,
      globalSearch: {
        keys: ['product', 'status','quantity','completed_qty','pending_qty','start_date']
      },
      defaultSort: { key: 'created_at', value: 'descend' },
      cols: [
        // {
        //   fieldKey: 'work_order_id',
        //   name: 'Work Order Id',
        //   sort: true
        // },
        {
          fieldKey: 'product',
          name: 'Product',
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            return `${row.product.name}`;
          },
          sort: true
        },
        {
          fieldKey: 'status',
          name: 'Status',
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            return `${row.status.status_name}`;
          },
          sort: true
        },
        {
          fieldKey: 'quantity',
          name: 'Quantity',
          sort: true
        },
        {
          fieldKey: 'completed_qty',
          name: 'Completed Quantity',
          sort: true
        },
        {
          fieldKey: 'pending_qty',
          name: 'Pending Quantity',
          sort: true
        },
        {
          fieldKey: 'start_date',
          name: 'Start Date',
          sort: true
        },
      ]
    },
    //====================================== RawMaterialConsumptionReport ===========================
    RawMaterialConsumptionReport: {
      apiUrl: 'production/work_order/?raw_material_consumption_report=true',
      // pageSize: 10,
      // globalSearch: {
      //   keys: ['product_name', 'total_consumed_quantity','total_cost']
      // },
      // defaultSort: { key: 'created_at', value: 'descend' },
      // cols: [
      //   {
      //     fieldKey: 'product_name',
      //     name: 'Product',
      //     sort: true
      //   },
      //   {
      //     fieldKey: 'total_consumed_quantity',
      //     name: 'Quantity',
      //     sort: true
      //   },
      //   {
      //     fieldKey: 'total_cost',
      //     name: 'Cost',
      //     sort: true
      //   },
      // ]
    },

    //====================================== FinishedGoodsReport ===========================
    FinishedGoodsReport: {
      apiUrl: 'production/work_order/?finished_goods_report=true',
      pageSize: 10,
      globalSearch: {
        keys: ['code', 'status', 'completed_qty','unit_name','completed_qty','unit_name','color','size','end_date']
      },
      defaultSort: { key: 'created_at', value: 'descend' },
      cols: [
        // {
        //   fieldKey: 'work_order_id',
        //   name: 'Work Order Id',
        //   sort: true
        // },
        {
          fieldKey: 'code',
          name: 'Product Code',
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            return `${row.product.code}`;
          },
          sort: true
        },
        {
          fieldKey: 'status',
          name: 'Status',
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            return `${row.status.status_name}`;
          },
          sort: true
        },
        {
          fieldKey: 'completed_qty',
          name: 'Completed Quantity',
          sort: true
        },
        {
          fieldKey: 'unit_name',
          name: 'Unit Name',
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            return `${row.product.unit_options.unit_name}`;
          },
          sort: true
        },
        {
          fieldKey: 'color',
          name: 'Color',
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            return `${row.color.color_name}`;
          },
          sort: true
        },
        {
          fieldKey: 'size',
          name: 'Size',
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            return `${row.size.size_name}`;
          },
          sort: true
        },
        {
          fieldKey: 'end_date',
          name: 'End Date',
          sort: true
        },
      ]
    },

    //====================================== ProductionCostReport ===========================
    ProductionCostReport: {
      apiUrl: 'production/work_order/?production_cost_report=true',
      pageSize: 10,
      globalSearch: {
        keys: ['product_name', 'material_cost', 'labor_cost', 'machine_cost', 'total_production_cost']
      },
      // defaultSort: { key: 'created_at', value: 'descend' },
      cols: [

        {
          fieldKey: 'product_name',
          name: 'Product',
          sort: true
        },
        {
          fieldKey: 'material_cost',
          name: 'Material Cost',
          sort: true
        },
        {
          fieldKey: 'labor_cost',
          name: 'Labor Cost',
          sort: true
        },
        {
          fieldKey: 'total_production_cost',
          name: 'Production Cost',
          sort: true
        },

      ]
    },
    //====================================== MachineUtilizationReport ===========================
    MachineUtilizationReport: {
      apiUrl: 'production/work_order/?machine_utilization_report=true',
      pageSize: 10,
      globalSearch: {
        keys: ['machine_name', 'total_usage_hours', 'total_work_orders', 'avg_usage_per_work_order', 'downtime_hours']
      },
      defaultSort: { key: 'created_at', value: 'descend' },
      cols: [

        {
          fieldKey: 'machine_name',
          name: 'Machine Name',
          sort: true
        },
        {
          fieldKey: 'total_usage_hours',
          name: 'Total Usage Hours',
          sort: true
        },
        {
          fieldKey: 'total_work_orders',
          name: 'Total Work Orders',
          sort: true
        },
        {
          fieldKey: 'avg_usage_per_work_order',
          name: 'Avg Usage Per Work Order',
          sort: true
        },
        // {
        //   fieldKey: 'downtime_hours',
        //   name: 'Downtime Hours',
        //   sort: true
        // },

      ]
    },
    //====================================== WIPReport ===========================
    WIPReport: {
      apiUrl: 'production/work_order/?wip_report=true',
      pageSize: 10,
      globalSearch: {
        keys: ['product','code', 'color', 'quantity', 'completed_qty', 'pending_qty']
      },
      defaultSort: { key: 'created_at', value: 'descend' },
      cols: [
        {
          fieldKey: 'work_order_id',
          name: 'Work Order Id',
          sort: true
        },
        {
          fieldKey: 'product',
          name: 'Product',
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            return `${row.product.name}`;
          },
          sort: true
        },
        {
          fieldKey: 'code',
          name: 'Product Code',
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            return `${row.product.code}`;
          },
          sort: true
        },
        {
          fieldKey: 'color',
          name: 'Color',
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            return `${row.color.color_name}`;
          },
          sort: true
        },
        {
          fieldKey: 'size',
          name: 'Size',
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            return `${row.size.size_name}`;
          },
          sort: true
        },
        {
          fieldKey: 'status',
          name: 'Status',
          displayType: "map",
          mapFn: (currentValue: any, row: any, col: any) => {
            return `${row.status.status_name}`;
          },
          sort: true
        },
        {
          fieldKey: 'quantity',
          name: 'Quantity',
          sort: true
        },
        {
          fieldKey: 'completed_qty',
          name: 'Completed Quantity',
          sort: true
        },
        {
          fieldKey: 'pending_qty',
          name: 'Pending Quantity',
          sort: true
        },
        {
          fieldKey: 'start_date',
          name: 'Start Date',
          sort: true
        },
        {
          fieldKey: 'end_date',
          name: 'End Date',
          sort: true
        },

      ]
    },
  }
  toggleAccordion() {
    this.isAccordionOpen = !this.isAccordionOpen;
  }

  loading: boolean = false;
  error: string | null = null;

  selectReport(reportKey: string) {
    this.loading = true; // Show loading state
    this.error = null; // Clear any previous errors
    this.selectedReportKey = null;
    this.tableConfig = null;
    this.isAccordionOpen = true;

    if (reportKey) {
      this.selectedReportKey = reportKey;
      this.tableConfig = this.reportsConfig[reportKey];
      this.isAccordionOpen = false;
    }

    setTimeout(() => {
      this.loading = false; // Hide loading after data loads
    },); // Adjust timeout based on API response time
  }

  onDataLoaded(data: any[]) {
    if (!data || data.length === 0) {
      this.error = 'No data available for this report.';
    }
    this.loading = false;
  }

  // // ✅ Function to get total records from the table data
  // onDataLoaded(data: any[]) {
  //   this.totalRecords = data.length; // ✅ Update total records dynamically
  // }



}
