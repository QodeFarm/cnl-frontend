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
  salesChart: any;
  purchaseChart: any;

  @ViewChild('salesChartCanvas') salesChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('purchaseChartCanvas') purchaseChartCanvas!: ElementRef<HTMLCanvasElement>;

  salesData = {
    labels: ['May-2024', 'Jun-2024', 'Jul-2024', 'Aug-2024', 'Sep-2024', 'Oct-2024'],
    datasets: [{
      label: 'Sales ($)',
      data: [10500, 12000, 9500, 11000, 11500, 13000],
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
  

  closeSalesModal() {
    this.isSalesModalOpen = false;
    this.destroyChart(this.salesChart, chart => this.salesChart = null);
  }

  closePurchaseModal() {
    this.isPurchaseModalOpen = false;
    this.destroyChart(this.purchaseChart, chart => this.purchaseChart = null);
  }

  ensureChartCreatedWithDelay(
    canvasRef: ElementRef<HTMLCanvasElement>,
    data: any,
    type: keyof ChartTypeRegistry, // Explicitly use keyof ChartTypeRegistry
    assignChart: (chart: any) => void,
    delay: number = 100
  ) {
    setTimeout(() => {
      if (!canvasRef?.nativeElement) {
        console.error('Canvas element is not available');
        return; // Safeguard against undefined canvas
      }
      const ctx = this.getCanvasContext(canvasRef);
      if (ctx) {
        assignChart(new Chart(ctx, {
          type,
          data,
          options: {
            responsive: true,
            scales: {
              x: { beginAtZero: true },
              y: { beginAtZero: true }
            }
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
  }
}
