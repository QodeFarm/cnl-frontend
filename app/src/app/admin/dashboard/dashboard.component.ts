import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartTypeRegistry, Colors, registerables } from 'chart.js';
import { HttpClient } from '@angular/common/http'; // Import HttpClient
import { SiteConfigService } from '@ta/ta-core'; // Import SiteConfigService


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {

  //for sale and purchase cards (Rs. 0 and 00% from last week)
  currentWeekSales: any;
  percentageSalesChange: any;
  currentWeekPurchase: any;
  percentagePurchaseChange: any;

    // Getter for baseUrl from SiteConfigService
  get baseUrl(): string {
    return this.siteConfigService.CONFIG?.baseUrl || '';
  }
  
  ngOnInit() {
    Chart.register(...registerables);
    this.fetchTasks();
    this.fetchWorkOrders(); 
    this.fourthRowSmallTableData('Product_Not_Sold_In_30_Days_For_Table')
    this.fourthRowSmallTableData('Customers_With_No_Sales_In_30_Days_For_Table')  
    this.fourthRowSmallTableData('Pending_For_Table')

    this.loadCurrentYearFinancialData();
  }


  isSalesModalOpen: boolean = false;
  isPurchaseModalOpen: boolean = false;
  isReceivablesModalOpen: boolean = false;
  isPayablesModalOpen: boolean = false;
  isLiquidityModelOpen: boolean = false; // For Cash/Bank 

  salesChart: any;
  purchaseChart: any;
  receivablesChart: any;
  payablesChart: any;
  liquidityChart: any;

  products : string[] = [];  //for Small tables
  customers : string[] = [];
  pendings : string[] = [];

  taskList: Array<any> = []; // Store processed task data  
  workOrders: Array<any> = []; // Store processed work order data

  @ViewChild('salesChartCanvas') salesChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('purchaseChartCanvas') purchaseChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('receivablesChartCanvas') receivablesChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('payablesChartCanvas') payablesChartCanvas!: ElementRef<HTMLCanvasElement>; 
  @ViewChild('liquidityChartCanvas') liquidityChartCanvas!: ElementRef<HTMLCanvasElement>; 

  @ViewChild('chartTop5Items') chartTop5ItemsCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chartDirectExpenses') chartDirectExpensesCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chartOperationalExpenses') chartOperationalExpensesCanvas!: ElementRef<HTMLCanvasElement>;

  @ViewChild('chartTop5ItemsIn6MonthsCanvas') chartTop5ItemsIn6MonthsCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chartTop5CustomersOf6MonthsCanvas') chartTop5CustomersOf6MonthsCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chartTop5ProfitMakingItemsCanvas') chartTop5ProfitMakingItemsCanvas!: ElementRef<HTMLCanvasElement>;

  @ViewChild('chartLast6MonthsCashflowCanvas') chartLast6MonthsCashflowCanvas!: ElementRef<HTMLCanvasElement>;

  @ViewChild('SalesOrderTrendChartCanvas') salesTrendsChartCanvas!: ElementRef<HTMLCanvasElement>;


  // constructor(private http: HttpClient) {} 
  constructor(private http: HttpClient, private siteConfigService: SiteConfigService) {} 


  //For Charts
  private fetchDataAndInitializeChart(
    endpoint: string,
    dataConfig: { labelsTarget: string[]; dataTarget: number[]; labelField: string; dataField: string }
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const apiUrl = this.baseUrl + 'dashboard/' + endpoint + '/'; 
      this.http.get(apiUrl).subscribe(
        (response: any) => {
          dataConfig.labelsTarget.length = 0; // Clear existing data
          dataConfig.dataTarget.length = 0;
          response.data.forEach((item: any) => {
            dataConfig.labelsTarget.push(item[dataConfig.labelField]);
            dataConfig.dataTarget.push(item[dataConfig.dataField]);
          });
          resolve(); // Resolve the promise when data is updated
        },
        error => reject(error) // Reject the promise in case of error
      );
    });
  }

  salesData = {
    labels: [],
    datasets: [{
      label: 'Sales (₹)',
      data: [],
      backgroundColor: '#4e73df',
      borderColor: '#4e73df',
      borderWidth: 1,
      barThickness: 20,
    }]
  };

  purchaseData = {
    labels: [],
    datasets: [{
      label: 'Purchase (₹)',
      data: [],
      backgroundColor: '#1cc88a',
      borderColor: '#1cc88a',
      borderWidth: 1,
      barThickness: 20,
    }]
  };

  receivablesData = {
    labels: ['Due Soon', 'Overdue', 'Paid'],
    datasets: [{
      label: 'Receivables (₹)',
      data: [3000, 1500, 7000],
      backgroundColor: ['#87CEEB', '#FF7F50', '#3CB371'],
      hoverBackgroundColor: ['#4682B4', '#D05E40', '#2E8B57'],
      borderColor: '#000000',
      borderWidth: 1,
    }]
  };

  payablesData = {
    labels: ['Advance', 'Pending', 'Not Due'],
    datasets: [{
      label: 'Payables (₹)',
      data: [5600, 43000, 23000],
      backgroundColor: ['#87CEEB', '#FF7F50', '#3CB371'],
      hoverBackgroundColor: ['#4682B4', '#D05E40', '#2E8B57'],
      borderColor: '#000000',
      borderWidth: 1,
    }]
  };

  liquidityData = {
    labels: ['SBI Bank', 'CBI Bank', 'Punjab Bank', 'Axis Bank', 'HDFC Bank'],
    datasets: [{
      label: 'Liquidity (₹)', 
      data: [692700, 729400, 437900, -243544, 549000],
      backgroundColor: '#00FFFF',
      borderColor: '#008B8B',
      borderWidth: 1,
      barThickness: 20,
    }]
  };

  top5ItemsData = {
    labels: [],
    datasets: [{
      label: 'Top Items Sold',
      data: [],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
      hoverBackgroundColor: [
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(255, 206, 86, 0.5)',
        'rgba(75, 192, 192, 0.5)',
        'rgba(153, 102, 255, 0.5)',
        'rgba(255, 159, 64, 0.5)'
      ],
      borderColor: 'black',
      borderWidth: 1,
      hoverBorderWidth: 2,
    }]
  };

  directExpensesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Direct Expenses',
      data: [500, 700, 600, 800, 650, 720],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
      hoverBackgroundColor: ['rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(255, 206, 86, 0.5)',
        'rgba(75, 192, 192, 0.5)',
        'rgba(153, 102, 255, 0.5)',
        'rgba(255, 159, 64, 0.5)'],
      borderColor: 'black',
      borderWidth: 1,
      hoverBorderWidth: 2,
    }]
  };

  operationalExpensesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Operational Expenses',
      data: [400, 450, 470, 490, 520, 550],
      backgroundColor: ['#FF9F40', '#FF6384', '#9966FF', '#4BC0C0', '#36A2EB', '#FFCE56'],
      hoverBackgroundColor: ['rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(255, 206, 86, 0.5)',
        'rgba(75, 192, 192, 0.5)',
        'rgba(153, 102, 255, 0.5)',
        'rgba(255, 159, 64, 0.5)'],
      borderColor: 'black',
      borderWidth: 1,
      hoverBorderWidth: 2,
    }]
  };

  openSalesModal() {
    this.isSalesModalOpen = true;
    setTimeout(() => {
      this.ensureChartCreatedWithDelay(
        this.salesChartCanvas,
        this.salesData,
        'bar',
        chart => this.salesChart = chart
      );
    }, 100); // Delay to ensure modal and canvas are rendered
  }
  
  openPurchaseModal() {
    this.isPurchaseModalOpen = true;
    setTimeout(() => {
      this.ensureChartCreatedWithDelay(
        this.purchaseChartCanvas,
        this.purchaseData,
        'bar',
        chart => this.purchaseChart = chart
      );
    }, 100); // Delay to ensure modal and canvas are rendered  
  }

  openReceivablesModal() {
    this.isReceivablesModalOpen = true;
    setTimeout(() => {
      this.ensureChartCreatedWithDelay(
        this.receivablesChartCanvas,
        this.receivablesData,
        'pie',
        chart => this.receivablesChart = chart
      );
    }, 100);
  }

  openPayablesModal() {
    this.isPayablesModalOpen = true;
    setTimeout(() => {
      this.ensureChartCreatedWithDelay(
        this.payablesChartCanvas,
        this.payablesData,
        'doughnut', // Donut chart type
        chart => this.payablesChart = chart
      );
    }, 100);
  }  

  openLiquidityModal() {
    this.isLiquidityModelOpen = true;
    setTimeout(() => {
      this.ensureChartCreatedWithDelay(
        this.liquidityChartCanvas,
        this.liquidityData,
        'bar',
        chart => this.liquidityChart = chart
      );
    }, 100); // Delay to ensure modal and canvas are rendered
  }

  // Data for Top 5 Items Groups sales in Last 6 Months
  top5ItemsIn6MonthsData = {
    chart_title : 'wq',
    labels: [], // Labels
    datasets: [{
      label: 'Sales (in ₹)',
      data: [],
      backgroundColor: '#4e73df',
      borderColor: '#4e73df',
      borderWidth: 1,
      barThickness: 20,
    }]
  };

  //Data for Top 5 Profit making Items In last FY
  top5ProfitMakingItemsData = {
    labels: [],    // Labels
    datasets: [{
      label: 'Profit (in ₹)',
      data: [ ],
      backgroundColor: '#1cc88a',
      borderColor: '#1cc88a',
      borderWidth: 1,
      barThickness: 20,
    }]
  };

  //Top 5 buyers(Customers)
  top5CustomersData = {
    labels: [],    // Labels
    datasets: [{
      label: 'Spending (in ₹)',
      data: [ ],
      backgroundColor: '#1cc88a',
      borderColor: '#1cc88a',
      borderWidth: 1,
      barThickness: 20,
    }]
  };

  Last6MonthsCashflowData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], 
    datasets: [{
      label: 'Inflow',
      data: [90 , 78, 30, 28, 20, 15],
      backgroundColor: '#4e73df',
      borderColor: '#4e73df',
      borderWidth: 1,
      barThickness: 20,
    },
    {
      label: 'Outflow',
      data: [78 , 92, 46, 19, 38, 27],
      backgroundColor: '#ff5e94',
      borderColor: '#4e73df',
      borderWidth: 1,
      barThickness: 20,
    }]
  };

  closeSalesModal() {
    this.isSalesModalOpen = false;
    this.destroyChart(this.salesChart, chart => this.salesChart = null);
  }

  closePurchaseModal() {
    this.isPurchaseModalOpen = false;
    this.destroyChart(this.purchaseChart, chart => this.purchaseChart = null);
  }

  closeReceivablesModal() {
    this.isReceivablesModalOpen = false;
    this.destroyChart(this.receivablesChart, chart => this.receivablesChart = null);
  }

  closePayablesModal() {
    this.isPayablesModalOpen = false;
    this.destroyChart(this.payablesChart, chart => this.payablesChart = null);
  }

  closeLiquidityModal() {
    this.isLiquidityModelOpen = false;
    this.destroyChart(this.liquidityChart, chart => this.liquidityChart = null);
  }

  ensureChartCreatedWithDelay(
    canvasRef: ElementRef<HTMLCanvasElement>,
    data: any,
    type: keyof ChartTypeRegistry,
    assignChart: (chart: any) => void,
    delay: number = 100
  ) {
    setTimeout(() => {
      if (!canvasRef?.nativeElement) {
        console.error('Canvas element is not available');
        return;
      }
      const ctx = this.getCanvasContext(canvasRef);
      if (ctx) {
        assignChart(new Chart(ctx, {
          type,
          data,
          options: {
            responsive: true,
            maintainAspectRatio: true,
          }
        }));
      }
    }, delay);
  }

  destroyChart(chartInstance: any, resetChartRef: (chart: null) => void) {
    if (chartInstance) {
      chartInstance.destroy();
      resetChartRef(null);
    }
  }

  private getCanvasContext(canvasRef: ElementRef<HTMLCanvasElement>): CanvasRenderingContext2D | null {
    const canvasElement = canvasRef?.nativeElement;
    if (!canvasElement) {
      console.error('Canvas element is not available');
      return null;
    }
    const ctx = canvasElement.getContext('2d');
    if (!ctx) {
      console.error('Failed to get the canvas context');
    }
    return ctx;
  }


  ngAfterViewInit() {
    // Initialize all three charts after view is rendered
    this.initializeChart(this.chartDirectExpensesCanvas, this.directExpensesData, 'pie' ,'Last 6 Months Direct Expenses');
    this.initializeChart(this.chartOperationalExpensesCanvas, this.operationalExpensesData, 'pie' ,'Last 6 Months Operational Expenses');
    
    //Last6MonthsCashflowData
    this.initializeChart(this.chartLast6MonthsCashflowCanvas, this.Last6MonthsCashflowData, 'bar', "Last 6 Month's Cashflow"); // Top 6 Profit Making Items

    Promise.all([
      this.fetchDataAndRenderChart("Compare_weekly_purchase_and_growth"),
      this.fetchDataAndRenderChart("Compare_weekly_sales_and_growth"), 
      this.fetchDataAndRenderChart("Sales_Order_Trend_Graph"),
      this.fetchDataAndInitializeChart('Sales_Over_the_Last_12_Months', {
        labelsTarget: this.salesData.labels,
        dataTarget: this.salesData.datasets[0].data,
        labelField: 'month_year',
        dataField: 'total_sales',
      }),
      this.fetchDataAndInitializeChart('Purchase_Over_the_Last_12_Months', {
        labelsTarget: this.purchaseData.labels,
        dataTarget: this.purchaseData.datasets[0].data,
        labelField: 'month_year',
        dataField: 'monthly_purchases',
      }),      
      this.fetchDataAndInitializeChart('Top_5_Itmes_Sold_In_Last_30_Days', {
        labelsTarget: this.top5ItemsData.labels,
        dataTarget: this.top5ItemsData.datasets[0].data,
        labelField: 'product_name',
        dataField: 'total_sold_quantity',
      }),
      this.fetchDataAndInitializeChart('Top_5_Items_Groups_In_Last_6_Months', {
        labelsTarget: this.top5ItemsIn6MonthsData.labels,
        dataTarget: this.top5ItemsIn6MonthsData.datasets[0].data,
        labelField: 'item_group',
        dataField: 'total_amount',
      }),
      this.fetchDataAndInitializeChart('Top_5_Sold_Items_In_Current_FY', {
        labelsTarget: this.top5ProfitMakingItemsData.labels,
        dataTarget: this.top5ProfitMakingItemsData.datasets[0].data,
        labelField: 'item_name',
        dataField: 'total_amount',
      }),
      this.fetchDataAndInitializeChart('Top_5_Customers_In_Last_6_Months', {
        labelsTarget: this.top5CustomersData.labels,
        dataTarget: this.top5CustomersData.datasets[0].data,
        labelField: 'CustomerName',
        dataField: 'TotalAmount',
      }),
    ])
      .then(() => {
        // Initialize charts after all data is fetched
        this.initializeChart(this.chartTop5ItemsCanvas, this.top5ItemsData, 'pie', 'Top 5 Items Sold In Last 30 days');
        this.initializeChart(this.chartTop5ItemsIn6MonthsCanvas, this.top5ItemsIn6MonthsData, 'pie', 'Top 5 Items (Last 6 Months)');
        this.initializeChart(this.chartTop5CustomersOf6MonthsCanvas, this.top5CustomersData, 'bar', 'Top 5 Customers (Last 6 Months)');
        this.initializeChart(this.chartTop5ProfitMakingItemsCanvas, this.top5ProfitMakingItemsData, 'bar', 'Top 5 Profit-Making Items');
      })
      .catch(error => {
        console.error('Error loading chart data:', error);
    });
  }

  ngOnDestroy() {
    this.destroyChart(this.salesChart, chart => this.salesChart = null);
    this.destroyChart(this.purchaseChart, chart => this.purchaseChart = null);
    this.destroyChart(this.receivablesChart, chart => this.receivablesChart = null);
    this.destroyChart(this.payablesChart, chart => this.payablesChart = null);
    this.destroyChart(this.liquidityChart, chart => this.liquidityChart = null);
  }

  private initializeChart(canvas: ElementRef<HTMLCanvasElement>, data: any, type: keyof ChartTypeRegistry, chart_title: string  ): Chart | null {
    const ctx = canvas?.nativeElement?.getContext('2d');
    if (!ctx) {
      console.error('Canvas context not found for chart.');
      return null;
    }  
    const chartOptions: any = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false, // Hide legend
        },
        tooltip: {
          enabled: true, // Enable tooltips
        },
        title: {
          display: true,
          text: chart_title,
          color: '#2c2e35',  
          font: {
            size: 12,
            family: 'tahoma',
            weight: 'bold',
          },
        }
      },
    };  
    // Conditionally apply the scales option only when the chart type is 'bar'
    if (type === 'bar') {
      chartOptions.scales = {
        x: {
          stacked: true,
          ticks: {
            display: false, // Hide labels on the X-axis
          },
          grid: {
            display: false, // Hide grid lines on X-axis
          },
        },
        y: {
          stacked: true,
          beginAtZero: true,
          ticks: {
              callback: function(value) {
                  if (value >= 1e7) { // If the value is over a Cr
                      return (value / 1e7) + 'Cr'; // Convert to Cr

                  } else if (value >= 1e5) { 
                      return (value / 1e5) + 'L'; 

                  } else if (value >= 1e3) { 
                    return (value / 1e3) + 'K';

                  } else {
                      return value;
                  }
              }
          }
        }
      };
    }
  
    return new Chart(ctx, {
      type,
      data,
      options: chartOptions,
    });
  }

  fetchTasks(): void {
    const apiUrl = `${this.baseUrl}tasks/task/`;
    this.http.get(apiUrl).subscribe(
      (response: any) => {
        if (response?.data) {
          this.taskList = response.data.map((task: any) => ({
            name: task.group?.group_name || `${task.user?.first_name || ''} ${task.user?.last_name || ''}`.trim(),
            title: task.title,
            status: task.status.status_name,
            priority: task.priority.priority_name,
          }));
        }
      },
      (error) => {
        alert('Error fetching tasks');
      }
    );
  }
  
  fetchWorkOrders(): void {
    const apiUrl = `${this.baseUrl}production/work_order/`;
    this.http.get(apiUrl).subscribe(
      (response: any) => {
        if (response?.data) {
          this.workOrders = response.data.map((workOrder: any) => ({
            name: workOrder.product?.name || 'Unknown Product',
            quantity: workOrder.quantity || 0,
            completed_qty: workOrder.completed_qty || 0,
            pending_qty: workOrder.pending_qty || 0,
            status_name: workOrder.status?.status_name || 'Unknown Status',
          }));
        }
      },
      (error) => {
        alert('Error fetching work orders:');
      }
    );
  }

  // Reusable function to fetch data from any endpoint and populate the SMALL table which is present in 4th row
  fourthRowSmallTableData(endpoint: string) {
    this.http.get<any>(this.baseUrl +  'dashboard/' +  endpoint + '/').subscribe(
      (response) => {
        if (response && response.data && endpoint == "Product_Not_Sold_In_30_Days_For_Table") {
          this.products = response.data.map(item => item.product_name);

        } else if (response && response.data && endpoint === "Customers_With_No_Sales_In_30_Days_For_Table") {
          this.customers = response.data.map(item => item.customer_name);

        } else if (response && response.data && endpoint === "Pending_For_Table") {
          this.pendings = response.data.map((order: any) => ({
            order_type: `${order.order_type}(${order.order_count})`,  
            total_value: order.total_value
          }));

        } else {
          alert('Invalid response format');
        }
      },
      (error) => {
        alert('Error fetching products:');
      }
    );
  }

  //chart for sales order trends
  fetchDataAndRenderChart(endpoint): void {
    const apiUrl = this.baseUrl + 'dashboard/' + endpoint + '/'; // Replace with your actual API URL createSalesOrderTrendChart

    this.http.get(apiUrl).subscribe((response: any) => {
      if (response && response.data && response.data.length > 0) {
        response.data.forEach((item: any) => {
          if (this.currentWeekPurchase === undefined && item.current_week_purchases !== undefined) {
            this.currentWeekPurchase = item.current_week_purchases !== null ? item.current_week_purchases : 0;
          }
    
          if (this.percentagePurchaseChange === undefined && item.percentage_purchase_change !== undefined) {
            this.percentagePurchaseChange = item.percentage_purchase_change !== null ? item.percentage_purchase_change : 0;
          }
    
          if (this.currentWeekSales === undefined && item.current_week_sales !== undefined) {
            this.currentWeekSales = item.current_week_sales !== null ? item.current_week_sales : 0;
          }
    
          if (this.percentageSalesChange === undefined && item.percentage_change !== undefined) {
            this.percentageSalesChange = item.percentage_change !== null ? item.percentage_change : 0; 
          }
        });
      }    
      if (response && response.data) {
        const chartLabels = response.data.map((item: any) => item.month_name_year);
        const totalSalesOrders = response.data.map((item: any) => item.total_sales_orders);
        const invoicesConverted = response.data.map((item: any) => item.invoices_converted);
        const returnsConverted = response.data.map((item: any) => item.returns_converted);
        const pendingSalesOrders = response.data.map((item: any) => item.pending_sales_orders);

        this.createSalesOrderTrendChart(chartLabels, totalSalesOrders, invoicesConverted, returnsConverted, pendingSalesOrders, "Sale Order Trends");
      }
    });
  }

  createSalesOrderTrendChart(labels: string[], total: number[], invoices: number[], returns: number[], pending: number[], chart_title: string ): void {
    
    const canvas = this.salesTrendsChartCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Total Sales Orders',
              data: total,
              backgroundColor: '#ff5e94',
              borderColor: '#4e73df',
              borderWidth: 1,
              barThickness: 20,
            },
            {
              label: 'Invoices Converted',
              data: invoices,
              backgroundColor: 'rgba(54, 162, 235, 0.8)',
              borderColor: '#4e73df',
              borderWidth: 1,
              barThickness: 20,
            },
            {
              label: 'Returns Converted',
              data: returns,
              backgroundColor: 'rgba(255, 99, 132, 0.8)',
              borderColor: '#4e73df',
              borderWidth: 1,
              barThickness: 20,
            },
            {
              label: 'Pending Sales Orders',
              data: pending,
              backgroundColor: 'rgba(255, 206, 86, 0.8)',
              borderColor: '#4e73df',
              borderWidth: 1,
              barThickness: 20,
            },
          ],
        },
        options: {
          plugins: {
            tooltip: {
              mode: 'index',
              intersect: false,
            },
            legend: {
              display: false,
            },
            title: {
              display: true,
              text: chart_title,
              color: '#2c2e35',  
              font: {
                size: 12,
                family: 'tahoma',
                weight: 'bold',
              },
            }
          },
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              stacked: true,
              ticks: {
                display: false, // Hide labels on the X-axis
              },
              grid: {
                display: false, // Hide grid lines on X-axis
              },
            },
            y: {
              stacked: true,
              beginAtZero: true,
            }
          },
        },
      });
    }
  }


//Financial report in Dashboar 

@ViewChild('financialPieChart') financialPieChart!: ElementRef;
  financialChart: Chart | undefined;
  
  // Current year data
  currentYear = new Date().getFullYear();
  financialData = {
    totalIncome: 0,
    totalExpenses: 0,
    netProfit: 0
  };

loadCurrentYearFinancialData() {
    const fromDate = `${this.currentYear}-01-01`;
    const toDate = `${this.currentYear}-12-31`;
    
    // 1. Fetch Sales Invoices
    this.http.get<any>(`sales/sale_invoice_order/?summary=true&from_date=${fromDate}&to_date=${toDate}`).subscribe({
      next: (res) => {
        const salesInvoices = res?.data?.reduce((sum: number, item: any) => sum + (+item.total_amount || 0), 0) || 0;
        
        // 2. Fetch Sales Credit Notes (Refunds)
        this.http.get<any>(`sales/sale_credit_note/?summary=true&from_date=${fromDate}&to_date=${toDate}`).subscribe({
          next: (creditRes) => {
            const salesCreditNotes = creditRes?.data?.reduce((sum: number, item: any) => sum + (+item.total_amount || 0), 0) || 0;
            
            // 3. Fetch Sales Debit Notes (Additional Charges)
            this.http.get<any>(`sales/sale_debit_note/?summary=true&from_date=${fromDate}&to_date=${toDate}`).subscribe({
              next: (debitRes) => {
                const salesDebitNotes = debitRes?.data?.reduce((sum: number, item: any) => sum + (+item.total_amount || 0), 0) || 0;
                
                // 4. Fetch Purchase Invoices
                this.http.get<any>(`purchase/purchase_order/?summary=true&from_date=${fromDate}&to_date=${toDate}`).subscribe({
                  next: (purchaseRes) => {
                    const purchaseInvoices = purchaseRes?.data?.reduce((sum: number, item: any) => sum + (+item.total_amount || 0), 0) || 0;
                    
                    // 5. Fetch General Expenses (if applicable)
                    // this.http.get<any>(`expenses/general/?summary=true&from_date=${fromDate}&to_date=${toDate}`).subscribe({
                    //   next: (expenseRes) => {
                    //     const generalExpenses = expenseRes?.data?.reduce((sum: number, item: any) => sum + (+item.amount || 0), 0) || 0;
                        
                    //     // 6. Fetch Salaries (if applicable)
                    //     this.http.get<any>(`payroll/salaries/?summary=true&from_date=${fromDate}&to_date=${toDate}`).subscribe({
                    //       next: (salaryRes) => {
                    //         const salaries = salaryRes?.data?.reduce((sum: number, item: any) => sum + (+item.amount || 0), 0) || 0;
                            
                            // Calculate final values
                            this.financialData = {
                              // salesInvoices: salesInvoices,
                              // salesCreditNotes: salesCreditNotes,
                              // salesDebitNotes: salesDebitNotes,
                              // purchaseInvoices: purchaseInvoices,
                              // generalExpenses: generalExpenses,
                              // salaries: salaries,
                              totalIncome: salesInvoices + salesDebitNotes - salesCreditNotes,
                              totalExpenses: purchaseInvoices + 0 + 0,
                              netProfit: (salesInvoices + salesDebitNotes - salesCreditNotes) - (purchaseInvoices + 0 + 0)
                            };
                            
                            this.createFinancialPieChart();
                          // },
                      //     error: (err) => console.error('Error fetching salaries:', err)
                      //   });
                      // },
                    //   error: (err) => console.error('Error fetching expenses:', err)
                    // });
                  },
                  error: (err) => console.error('Error fetching purchases:', err)
                });
              },
              error: (err) => console.error('Error fetching debit notes:', err)
            });
          },
          error: (err) => console.error('Error fetching credit notes:', err)
        });
      },
      error: (err) => console.error('Error fetching sales invoices:', err)
    });
  }

  createFinancialPieChart() {
    const ctx = this.financialPieChart.nativeElement.getContext('2d');
    if (!ctx) return;

    if (this.financialChart) {
      this.financialChart.destroy();
    }

    this.financialChart = new Chart(ctx, {
      type: 'pie',
      data: {
        // labels: ['Income', 'Expenses', 'Profit'],
        datasets: [{
          data: [
            this.financialData.totalIncome, 
            this.financialData.totalExpenses,
            this.financialData.netProfit
          ],
          backgroundColor: [
            'rgba(75, 192, 192, 0.7)',
            'rgba(255, 99, 132, 0.7)',
            'rgba(54, 162, 235, 0.7)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.raw || 0;
                return `${label}: ₹${value.toLocaleString()}`;
              }
            }
          },
          title: {
            display: true,
            text: `Financial Year (${this.currentYear})`,
            // font: { size: 14 },
            // color: '#000000' // Black color
            color: '#2c2e35',  
            font: {
              size: 12,
              family: 'tahoma',
              weight: 'bold',
            },
          }
        }
      }
    });
  }
}
