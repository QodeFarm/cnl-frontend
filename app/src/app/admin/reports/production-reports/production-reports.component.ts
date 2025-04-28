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

    ProductionSummaryReport: {
      apiUrl: 'production/work_order/?production_summary_report=true', 
      pageSize: 10,
      globalSearch: {
        keys: ['product', 'quantity', 'completed_qty', 'completion_percentage', 'status.status_name']
      },
      export: {downloadName: 'ProductionSummaryReport'},
      defaultSort: { key: 'start_date', value: 'descend' },
      cols: [
        {
          fieldKey: 'product',
          name: 'Product',
          displayType: 'map',
          mapFn: (currentValue: any, row: any) => {
            return row?.product?.name || 'N/A';
          },
          sort: true
        },
        {
          fieldKey: 'quantity',
          name: 'Ordered Qty',
          sort: true
        },
        {
          fieldKey: 'completed_qty',
          name: 'Completed Qty',
          sort: true
        },
        {
          fieldKey: 'completion_percentage',
          name: 'Completion (%)',
          sort: true
        },
        {
          fieldKey: 'status_name',
          name: 'Status',
          displayType: 'map',
          mapFn: (currentValue: any, row: any) => {
            return row?.status?.status_name || 'N/A';
          },
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
        }
      ]
    },
    //====================================== Bill of Materials (BOM) Report ===========================
    BillofMaterialsReport: {
    apiUrl: 'production/bom/?bom_report=true',
    pageSize: 10,
    globalSearch: {
      keys: ['bom_name', 'product.name', 'notes']
    },
    export: {downloadName: 'BillofMaterialsReport'},
    defaultSort: { key: 'created_at', value: 'descend' },
    cols: [
      {
        fieldKey: 'bom_name',
        name: 'BOM Name',
        sort: true
      },
      {
        fieldKey: 'product',
        name: 'Product',
        displayType: 'map',
        mapFn: (currentValue: any, row: any) => {
          return row?.product?.name || 'N/A';
        },
        sort: true
      },
        // {
        //   fieldKey: 'code',
        //   name: 'Code',
        //   displayType: "map",
        //   mapFn: (currentValue: any, row: any, col: any) => {
        //     return `${row.product.code}`;
        //   },
        //   sort: true
        // },
        // {
        //   fieldKey: 'unit_name',
        //   name: 'Unit Name',
        //   displayType: "map",
        //   mapFn: (currentValue: any, row: any, col: any) => {
        //     return `${row.product.unit_options.unit_name}`;
        //   },
        //   sort: true
        // },
        // {
        //   fieldKey: 'sales_rate',
        //   name: 'Sales Rate',
        //   displayType: "map",
        //   mapFn: (currentValue: any, row: any, col: any) => {
        //     return `${row.product.sales_rate}`;
        //   },
        //   sort: true
        // },
        // {
        //   fieldKey: 'dis_amount',
        //   name: 'Discount Amount',
        //   displayType: "map",
        //   mapFn: (currentValue: any, row: any, col: any) => {
        //     return `${row.product.dis_amount}`;
        //   },
        //   sort: true
        // },
        // {
        //   fieldKey: 'mrp',
        //   name: 'MRP',
        //   displayType: "map",
        //   mapFn: (currentValue: any, row: any, col: any) => {
        //     return `${row.product.mrp}`;
        //   },
        //   sort: true
        // },
      {
        fieldKey: 'notes',
        name: 'Notes',
        sort: false
      },
      {
        fieldKey: 'created_at',
        name: 'Created At',
        sort: true
      }
    ]
  },
    //====================================== WorkOrderStatusReport ===========================
    WorkOrderStatusReport: {
      apiUrl: 'production/work_order/?work_order_status_report=true',
    pageSize: 10,
    globalSearch: {
      keys: ['work_order_id', 'product.name', 'quantity', 'completed_qty', 'completion_percentage', 'status.status_name', 'start_date', 'end_date']
    },
    export: {downloadName: 'WorkOrderStatusReport'},
    defaultSort: { key: 'start_date', value: 'descend' },
    cols: [
      {
        fieldKey: 'work_order_id',
        name: 'Work Order ID',
        sort: true
      },
      {
        fieldKey: 'product',
        name: 'Product',
        displayType: 'map',
        mapFn: (currentValue: any, row: any) => {
          return row?.product?.name || 'N/A';
        },
        sort: true
      },
      {
        fieldKey: 'quantity',
        name: 'Ordered Qty',
        sort: true
      },
      {
        fieldKey: 'completed_qty',
        name: 'Completed Qty',
        sort: true
      },
      {
        fieldKey: 'completion_percentage',
        name: 'Completion (%)',
        sort: true
      },
      {
        fieldKey: 'status_name',
        name: 'Status',
        displayType: 'map',
        mapFn: (currentValue: any, row: any) => {
          return row?.status?.status_name || 'N/A';
        },
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
      }
    ]
  },
    //====================================== RawMaterialConsumptionReport ===========================
    RawMaterialConsumptionReport: {
      apiUrl: 'production/bom/?raw_material_consumption_report=true',
      pageSize: 10,
      globalSearch: {
        keys: ['product_name', 'total_consumed_quantity', 'total_cost', 'avg_unit_cost', 'last_consumption_date']
      },
      export: {downloadName: 'RawMaterialConsumptionReport'},
      defaultSort: { key: 'total_consumed_quantity', value: 'descend' },
      cols: [
        {
          fieldKey: 'product_name',
          name: 'Raw Material',
          sort: true
        },
        {
          fieldKey: 'total_consumed_quantity',
          name: 'Total Consumed Quantity',
          sort: true
        },
        {
          fieldKey: 'total_cost',
          name: 'Total Cost',
          sort: true
        },
        {
          fieldKey: 'avg_unit_cost',
          name: 'Avg. Unit Cost',
          sort: true
        },
        {
          fieldKey: 'last_consumption_date',
          name: 'Last Consumption Date',
          sort: true
        }
      ]
    },

    //====================================== FinishedGoodsReport ===========================
    FinishedGoodsReport: {
      apiUrl: 'production/work_order/?finished_goods_report=true', // adjust this endpoint as needed
      pageSize: 10,
      globalSearch: {
        keys: ['product.name', 'quantity', 'completed_qty', 'completion_percentage']
      },
      export: {downloadName: 'FinishedGoodsReport'},
      defaultSort: { key: 'start_date', value: 'descend' },
      cols: [
        // {
        //   fieldKey: 'work_order_id',
        //   name: 'Work Order ID',
        //   sort: true
        // },
        {
          fieldKey: 'product',
          name: 'Product',
          displayType: 'map',
          mapFn: (currentValue: any, row: any) => {
            return row?.product?.name || 'N/A';
          },
          sort: true
        },
        {
          fieldKey: 'quantity',
          name: 'Ordered Qty',
          sort: true
        },
        {
          fieldKey: 'completed_qty',
          name: 'Completed Qty',
          sort: true
        },
        {
          fieldKey: 'completion_percentage',
          name: 'Completion (%)',
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
        }
      ]
    },

    //====================================== ProductionCostReport ===========================
    ProductionCostReport: {
      apiUrl: 'production/work_order/?production_cost_report=true',
      pageSize: 10,
      globalSearch: {
        keys: ['product', 'total_quantity', 'total_cost', 'avg_unit_cost']
      },
      export: {downloadName: 'ProductionCostReport'}, 
      defaultSort: { key: 'product', value: 'ascend' },
      cols: [
        {
          fieldKey: 'product',
          name: 'Product',
          sort: true
        },
        {
          fieldKey: 'total_quantity',
          name: 'Total Quantity',
          sort: true
        },
        {
          fieldKey: 'total_cost',
          name: 'Total Cost',
          sort: true
        },
        {
          fieldKey: 'avg_unit_cost',
          name: 'Avg Unit Cost',
          sort: true
        }
      ]
    },
    //====================================== MachineUtilizationReport ===========================
    MachineUtilizationReport: {
      apiUrl: 'production/work_order/?machine_utilization_report=true',
      pageSize: 10,
      globalSearch: {
        keys: ['machine_name', 'total_usage_hours', 'total_work_orders', 'avg_usage_per_work_order', 'downtime_hours']
      },
      export: {downloadName: 'MachineUtilizationReport'},
      // defaultSort: { key: 'created_at', value: 'descend' },
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
      export: {downloadName: 'WIPReport'},  
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
