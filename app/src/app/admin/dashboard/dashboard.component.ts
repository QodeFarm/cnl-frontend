import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartTypeRegistry, registerables } from 'chart.js';

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
  payablesChart:any;
  liquidityChart:any;

  @ViewChild('salesChartCanvas') salesChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('purchaseChartCanvas') purchaseChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('receivablesChartCanvas') receivablesChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('payablesChartCanvas') payablesChartCanvas!: ElementRef<HTMLCanvasElement>; 
  @ViewChild('liquidityChartCanvas') liquidityChartCanvas!: ElementRef<HTMLCanvasElement>; 

  salesData = {
    labels: ['May-2024', 'Jun-2024', 'Jul-2024', 'Aug-2024', 'Sep-2024', 'Oct-2024'],
    datasets: [{
      label: 'Sales ($)',
      data: [10500, 12000, 9500, -11000, 11500, 13000],
      backgroundColor: '#4e73df',
      borderColor: '#4e73df',
      borderWidth: 1,
      barThickness: 20,
    }]
  };

  purchaseData = {
    labels: ['May-2024', 'Jun-2024', 'Jul-2024', 'Aug-2024', 'Sep-2024', 'Oct-2024'],
    datasets: [{
      label: 'Purchase ($)',
      data: [8000, 9500, 8700, 9100, 9700, 10000],
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
        'pie', // Donut chart type
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

  ngAfterViewInit() {}

  ngOnDestroy() {
    this.destroyChart(this.salesChart, chart => this.salesChart = null);
    this.destroyChart(this.purchaseChart, chart => this.purchaseChart = null);
    this.destroyChart(this.receivablesChart, chart => this.receivablesChart = null);
    this.destroyChart(this.payablesChart, chart => this.payablesChart = null);
    this.destroyChart(this.liquidityChart, chart => this.liquidityChart = null);
  }
}
