import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  isModalOpen: boolean = false;
  salesChart: any;  // To hold the chart instance

  @ViewChild('salesChartCanvas') salesChartCanvas!: ElementRef<HTMLCanvasElement>;

  // Dummy sales data for the last 6 months
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

  // Function to open the modal
  openModal() {
    this.isModalOpen = true;
    // Create chart after a small delay to ensure the modal and canvas are fully rendered
    setTimeout(() => {
      this.createChart();
    }, 100);  // 100ms delay to ensure the modal is rendered
  }

  // Function to close the modal
  closeModal() {
    this.isModalOpen = false;
    this.destroyChart(); // Destroy chart instance when modal is closed
  }

  // Function to create the chart
  createChart() {
    // Check if the chart already exists and destroy it if necessary
    if (this.salesChart) {
      this.salesChart.destroy(); // Destroy existing chart to avoid multiple instances
    }

    // Ensure the canvas element exists before accessing it
    const canvasElement = this.salesChartCanvas?.nativeElement;
    if (canvasElement) {
      const ctx = canvasElement.getContext('2d');
      if (ctx) {
        this.salesChart = new Chart(ctx, {
          type: 'bar',
          data: this.salesData,
          options: {
            responsive: true,
            scales: {
              x: {
                beginAtZero: true
              },
              y: {
                beginAtZero: true
              }
            }
          }
       });
      } else {
        console.error('Failed to get the canvas context');
      }
    } else {
      console.error('Canvas element is not available');
    }
  }

  // Function to destroy the chart
  destroyChart() {
    if (this.salesChart) {
      this.salesChart.destroy();
    }
  }

  ngOnInit() {
    Chart.register(...registerables); // Register all the required Chart.js components
  }

  ngAfterViewInit() {
    // Ensure that the chart is created after view initialization, but only when modal is open
    if (this.isModalOpen && this.salesChartCanvas?.nativeElement) {
      this.createChart();
    }
  }

  ngOnDestroy() {
    this.destroyChart(); // Clean up the chart when component is destroyed
  }
}
