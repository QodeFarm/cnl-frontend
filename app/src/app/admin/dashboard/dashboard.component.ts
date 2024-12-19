import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartTypeRegistry, registerables } from 'chart.js';
import { HttpClient } from '@angular/common/http'; // Import HttpClient


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {
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

  @ViewChild('salesChartCanvas') salesChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('purchaseChartCanvas') purchaseChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('receivablesChartCanvas') receivablesChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('payablesChartCanvas') payablesChartCanvas!: ElementRef<HTMLCanvasElement>; 
  @ViewChild('liquidityChartCanvas') liquidityChartCanvas!: ElementRef<HTMLCanvasElement>; 

  // For 2nd row charts 
  @ViewChild('chartTop6Items') chartTop6ItemsCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chartDirectExpenses') chartDirectExpensesCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chartOperationalExpenses') chartOperationalExpensesCanvas!: ElementRef<HTMLCanvasElement>;

  //3rd row
  @ViewChild('chartTop6ItemsIn6MonthsCanvas') chartTop6ItemsIn6MonthsCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chartTop6ProfitMakingItemsCanvas') chartTop6ProfitMakingItemsCanvas!: ElementRef<HTMLCanvasElement>;

  //2nd-row Right-side-chart
  @ViewChild('chartLast6MonthsCashflowCanvas') chartLast6MonthsCashflowCanvas!: ElementRef<HTMLCanvasElement>;


  constructor(private http: HttpClient) {} // Inject HttpClient
  private fetchDataAndInitializeChart(
    endpoint: string,
    dataConfig: { labelsTarget: string[]; dataTarget: number[]; labelField: string; dataField: string }) {
    const apiUrl = `http://127.0.0.1:8000/api/v1/dashboard/${endpoint}/`; // Replace with your API endpoint
    this.http.get(apiUrl).subscribe((response: any) => {
      // Update labels and data using provided field names and response data
      dataConfig.labelsTarget.length = 0; // Clear existing data
      dataConfig.dataTarget.length = 0;
      response.forEach((item: any) => {
        dataConfig.labelsTarget.push(item[dataConfig.labelField]);
        dataConfig.dataTarget.push(item[dataConfig.dataField]);
      });
    });
  }

  salesData = {
    labels: [],
    datasets: [{
      label: 'Sales ($)',
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
      label: 'Purchase ($)',
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
      label: 'Receivables ($)',
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
      label: 'Payables ($)',
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
      label: 'Liquidity ($)',
      data: [692700, 729400, 437900, -243544, 549000],
      backgroundColor: '#00FFFF',
      borderColor: '#008B8B',
      borderWidth: 1,
      barThickness: 20,
    }]
  };

  // For 2nd row charts 
  top6ItemsData = {
    labels: ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6'],
    datasets: [{
      label: 'Top Items Sold',
      data: [30, 20, 15, 10, 15, 10],
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
      hoverBorderWidth: 3,
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
      hoverBorderWidth: 3,
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
      hoverBorderWidth: 3,
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

  //2nd row Row Charts
  //Data for Top 6 Items Groups sales in Last 6 Months
  top6ItemsIn6MonthsData = {
    chart_title : 'wq',
    labels: ['Food Containers', 'Print Buckets', 'Plates', 'Cups', 'Boxes', 'Others'], // Labels
    datasets: [{
      label: 'Sales (in $)',
      data: [90 , 78, 30, 28, 20, 15],
      backgroundColor: '#4e73df',
      borderColor: '#4e73df',
      borderWidth: 1,
      barThickness: 20,
    }]
  };

  //Data for Top 6 Profit making Items In last FY
  top6ProfitMakingItemsData = {
    labels: ['1000ML Container', 'Vishnu Wine 3.6', 'Lunch Box', 'Wrap', 'Tumbler', 'Jar'],    // Labels
    datasets: [{
      label: 'Profit (in $)',
      data: [10, 9.5, 9, 8.5, 8, 7.5],
      backgroundColor: '#1cc88a',
      borderColor: '#1cc88a',
      borderWidth: 1,
      barThickness: 20,
    }]
  };

  Last6MonthsCashflowData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], // Labels
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

  ngOnInit() {
    Chart.register(...registerables);
  }

  // For 2nd row charts 
  ngAfterViewInit() {
    // Initialize all three charts after view is rendered
    this.initializeChart(this.chartTop6ItemsCanvas, this.top6ItemsData, 'pie','Top 6 Items Sold in 30 Days');
    this.initializeChart(this.chartDirectExpensesCanvas, this.directExpensesData, 'pie' ,'Last 6 Months Direct Expenses');
    this.initializeChart(this.chartOperationalExpensesCanvas, this.operationalExpensesData, 'pie' ,'Last 6 Months Operational Expenses');
    
    // 3rd charts charts  Last6MonthsCashflowData
    this.initializeChart(this.chartTop6ItemsIn6MonthsCanvas, this.top6ItemsIn6MonthsData, 'bar', 'Top 6 Item Grp Sales(Last 6 Months)'); // Top 6 Items in 6 Months
    this.initializeChart(this.chartTop6ProfitMakingItemsCanvas, this.top6ProfitMakingItemsData, 'bar', 'Top 6 Profit making Items In last FY'); // Top 6 Profit Making Items
    this.initializeChart(this.chartLast6MonthsCashflowCanvas, this.Last6MonthsCashflowData, 'bar', "Last 6 Month's Cashflow"); // Top 6 Profit Making Items

    this.fetchDataAndInitializeChart('Sales_Over_the_Last_12_Months',{
      labelsTarget: this.salesData.labels,
      dataTarget: this.salesData.datasets[0].data,
      labelField: 'month_year',
      dataField: 'total_sales',
    });
    this.fetchDataAndInitializeChart('Purchase_Over_the_Last_12_Months',{
      labelsTarget: this.purchaseData.labels,
      dataTarget: this.purchaseData.datasets[0].data,
      labelField: 'month_year',
      dataField: 'monthly_purchases',
    });  

    this.fetchDataAndInitializeChart('Top_10_Itmes_Sold_In_Last_30_Days',{
        labelsTarget: this.top6ItemsData.labels,
        dataTarget: this.top6ItemsData.datasets[0].data,
        labelField: 'product_name',
        dataField: 'total_sold_quantity',
      });
    
    this.fetchDataAndInitializeChart('Top_6_Items_Groups_In_Last_6_Months',{
      labelsTarget: this.top6ItemsIn6MonthsData.labels,
      dataTarget: this.top6ItemsIn6MonthsData.datasets[0].data,
      labelField: 'month_year',
      dataField: 'monthly_sales',
    });
    
    this.fetchDataAndInitializeChart('Top_6_Sold_Items_In_Current_FY',{
      labelsTarget: this.top6ProfitMakingItemsData.labels,
      dataTarget: this.top6ProfitMakingItemsData.datasets[0].data,
      labelField: 'item_name',
      dataField: 'total_amount',
    });

  }

  ngOnDestroy() {
    this.destroyChart(this.salesChart, chart => this.salesChart = null);
    this.destroyChart(this.purchaseChart, chart => this.purchaseChart = null);
    this.destroyChart(this.receivablesChart, chart => this.receivablesChart = null);
    this.destroyChart(this.payablesChart, chart => this.payablesChart = null);
    this.destroyChart(this.liquidityChart, chart => this.liquidityChart = null);

  }

  // For 2nd & 3rd row charts 
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
          ticks: {
            display: false, // Hide labels on the X-axis
          },
          grid: {
            display: false, // Hide grid lines on X-axis
          },
        },
      };
    }
  
    return new Chart(ctx, {
      type,
      data,
      options: chartOptions,
    });
  }
}
