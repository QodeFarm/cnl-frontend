import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartTypeRegistry, Colors, registerables } from 'chart.js';
import { HttpClient } from '@angular/common/http'; // Import HttpClient
import { SiteConfigService } from '@ta/ta-core'; // Import SiteConfigService
import { REPORT_CONFIGS  } from '../utils/reports.config'; // Import report configurations
import { DashboardTilesService } from './dashboard-tiles.service';
import { ReportsService } from 'projects/ta-core/src/lib/services/reports.service';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {
// Replace static tile properties with dynamic
    tiles: any[] = [];
    isLoadingTiles: boolean = false;


  //for sale and purchase cards (Rs. 0 and 00% from last week)
  currentWeekSales: any;
  percentageSalesChange: any;
  currentWeekPurchase: any;
  percentagePurchaseChange: any;

    // Getter for baseUrl from SiteConfigService
  get baseUrl(): string {
    return this.siteConfigService.CONFIG?.baseUrl || '';
  }

//pramod -changes -------------------------
// Add after your existing properties
dynamicGraphs: any[] = [];  // For storing user-added dynamic graphs
isAddGraphModalOpen = false;
selectedReport = '';
selectedChartType: string = 'bar';
graphTitle = '';

// Add these methods to your DashboardComponent

// Get list of modules
getModuleList(): string[] {
    return Object.keys(this.reportsByModule || {});
}

// Get module icon
getModuleIcon(moduleName: string): string {
    return this.reportsByModule[moduleName]?.icon || '📊';
}

// Make sure reportsByModule is populated
loadReportsFromConfig() {
    this.isLoadingReports = true;
    
    // Transform REPORT_CONFIGS to reportsByModule format
    this.reportsByModule = {};
    this.availableReports = [];
    
    for (const moduleKey in REPORT_CONFIGS) {
        const module = REPORT_CONFIGS[moduleKey as keyof typeof REPORT_CONFIGS];
        
        this.reportsByModule[module.module] = {
            icon: module.icon,
            reports: module.reports.map((report: any) => ({
                ...report,
                moduleName: module.module
            }))
        };
        
        // Also add to flat availableReports
        module.reports.forEach((report: any) => {
            this.availableReports.push({
                ...report,
                moduleName: module.module,
                moduleIcon: module.icon
            });
        });
    }
    
    console.log('Reports by Module:', this.reportsByModule);
    console.log('Available Reports:', this.availableReports);
    
    this.isLoadingReports = false;
}

// Make sure onModuleSelect resets report
onModuleSelect(moduleValue: string) {
    this.selectedModule = moduleValue;
    this.selectedReport = ''; // Reset report when module changes
    console.log('Module selected:', moduleValue);
}

// Make sure onReportSelect works
onReportSelect(value: string) {
    this.selectedReport = value;
    console.log('Report selected:', value);
}

// Get categories for selected module
getCategoriesForModule(moduleName: string): string[] {
    if (!this.reportsByModule[moduleName]) return [];
    
    const categories = new Set<string>();
    this.reportsByModule[moduleName].reports.forEach((report: any) => {
        categories.add(report.category);
    });
    return Array.from(categories);
}

// Get reports by module and category
getReportsByModuleAndCategory(moduleName: string, category: string): any[] {
    if (!this.reportsByModule[moduleName]) return [];
    
    return this.reportsByModule[moduleName].reports.filter(
        (report: any) => report.category === category
    );
}

// Make sure generateGraph validates properly
generateGraph() {
    console.log('Selected Module:', this.selectedModule);
    console.log('Selected Report:', this.selectedReport);
    console.log('Selected Chart Type:', this.selectedChartType);
    
    if (!this.selectedModule) {
        alert('Please select a module');
        return;
    }
    
    if (!this.selectedReport) {
        alert('Please select a report');
        return;
    }
    
    if (!this.selectedChartType) {
        alert('Please select a chart type');
        return;
    }

    const report = this.availableReports.find(r => r.value === this.selectedReport);
    
    if (!report) {
        alert('Selected report not found');
        return;
    }

    const newGraph = {
        id: 'dynamic_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        title: this.graphTitle || report.label,
        reportType: this.selectedReport,
        chartType: this.selectedChartType,
        data: null,
        isLoading: true,
        chartInstance: null
    };

    this.dynamicGraphs.push(newGraph);
    this.saveDynamicGraphs();
    this.closeAddGraphModal();
    
    // Reset selections
    this.selectedModule = '';
    this.selectedReport = '';
    this.selectedChartType = 'bar';
    this.graphTitle = '';
    
    // Fetch data for this graph
    this.fetchDynamicGraphData(newGraph);
    
    // Auto-scroll to the new graph
    setTimeout(() => {
        this.scrollToGraph(newGraph.id);
    }, 1000);
}
// Add these to your component
selectedModule: string = '';
reportsByModule: any = {};

// Available reports configuration (add this)
availableReports = [
    {
        value: 'Sales_Over_the_Last_12_Months',  // This must match your API endpoint
        label: 'Sales (Last 12 Months)',
        endpoint: 'Sales_Over_the_Last_12_Months',
        labelField: 'month_year',
        dataField: 'total_sales'
    },
    {
        value: 'Purchase_Over_the_Last_12_Months',
        label: 'Purchases (Last 12 Months)',
        endpoint: 'Purchase_Over_the_Last_12_Months',
        labelField: 'month_year',
        dataField: 'monthly_purchases'
    },
    {
        value: 'Top_5_Itmes_Sold_In_Last_30_Days',
        label: 'Top 5 Items (Last 30 Days)',
        endpoint: 'Top_5_Itmes_Sold_In_Last_30_Days',
        labelField: 'product_name',
        dataField: 'total_sold_quantity'
    },
    {
        value: 'Top_5_Items_Groups_In_Last_6_Months',
        label: 'Top 5 Item Groups (Last 6 Months)',
        endpoint: 'Top_5_Items_Groups_In_Last_6_Months',
        labelField: 'item_group',
        dataField: 'total_amount'
    },
    {
        value: 'Top_5_Customers_In_Last_6_Months',
        label: 'Top 5 Customers (Last 6 Months)',
        endpoint: 'Top_5_Customers_In_Last_6_Months',
        labelField: 'CustomerName',
        dataField: 'TotalAmount'
    },
    {
        value: 'Top_5_Sold_Items_In_Current_FY',
        label: 'Top 5 Profit-Making Items',
        endpoint: 'Top_5_Sold_Items_In_Current_FY',
        labelField: 'item_name',
        dataField: 'total_amount'
    },
    {
        value: 'Compare_weekly_sales_and_growth',
        label: 'Weekly Sales Comparison',
        endpoint: 'Compare_weekly_sales_and_growth',
        labelField: 'week',
        dataField: 'current_week_sales'
    },
    {
        value: 'Compare_weekly_purchase_and_growth',
        label: 'Weekly Purchase Comparison',
        endpoint: 'Compare_weekly_purchase_and_growth',
        labelField: 'week',
        dataField: 'current_week_purchases'
    },
    {
        value: 'Sales_Order_Trend_Graph',
        label: 'Sales Order Trend',
        endpoint: 'Sales_Order_Trend_Graph',
        labelField: 'month_name_year',
        dataField: 'total_sales_orders'
    }
];

// Update your chartTypes array with proper values:
chartTypes = [
    { value: 'bar', label: 'Bar Chart', icon: '📊' },
    { value: 'line', label: 'Line Chart', icon: '📈' },
    { value: 'pie', label: 'Pie Chart', icon: '🥧' },
    { value: 'doughnut', label: 'Doughnut Chart', icon: '🍩' }
];

// Add this helper method to check if graph has data
hasGraphData(graph: any): boolean {
    return graph.data && 
           graph.data.labels && 
           graph.data.labels.length > 0 && 
           graph.data.datasets && 
           graph.data.datasets[0] && 
           graph.data.datasets[0].data.length > 0;
}

 // Add these new properties for delete confirmation modal
  showDeleteConfirmModal: boolean = false;
  graphToDelete: string | null = null;
  graphToDeleteTitle: string = '';

// Replace your existing removeDynamicGraph method with this:
removeDynamicGraph(graphId: string, graphTitle: string) {
    // Store the graph ID and title to delete
    this.graphToDelete = graphId;
    this.graphToDeleteTitle = graphTitle;
    
    // Show the confirmation modal
    this.showDeleteConfirmModal = true;
}

// Add new method to confirm deletion
confirmDelete() {
    if (this.graphToDelete) {
        const index = this.dynamicGraphs.findIndex(g => g.id === this.graphToDelete);
        if (index !== -1) {
            if (this.dynamicGraphs[index].chartInstance) {
                this.dynamicGraphs[index].chartInstance.destroy();
            }
            this.dynamicGraphs.splice(index, 1);
            this.saveDynamicGraphs();
        }
    }
    this.cancelDelete();
}

// Add new method to cancel deletion
cancelDelete() {
    this.showDeleteConfirmModal = false;
    this.graphToDelete = null;
    this.graphToDeleteTitle = '';
}

// Update your generateGraph method with better validation and debugging:
// generateGraph() {
//     console.log('Selected Report in generate:', this.selectedReport);
//     console.log('Selected Chart Type in generate:', this.selectedChartType);
    
//     // Check if report is selected
//     if (!this.selectedReport || this.selectedReport === '') {
//         alert('Please select a report');
//         return;
//     }
    
//     // Check if chart type is selected
//     if (!this.selectedChartType) {
//         alert('Please select a chart type');
//         return;
//     }

//     // Find the selected report
//     const report = this.availableReports.find(r => r.value === this.selectedReport);
//     console.log('Found report:', report);
    
//     if (!report) {
//         alert('Selected report not found');
//         return;
//     }

//     // Create new graph
//     const newGraph = {
//         id: 'dynamic_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
//         title: this.graphTitle || report.label,
//         reportType: this.selectedReport,
//         chartType: this.selectedChartType,
//         data: null,
//         isLoading: true,
//         chartInstance: null
//     };

//     console.log('Creating graph:', newGraph);
    
//     this.dynamicGraphs.push(newGraph);
//     this.closeAddGraphModal();
//     this.saveDynamicGraphs();
    
//     // Fetch data
//     this.fetchDynamicGraphData(newGraph);
// }

// generateGraph() {
//     console.log('Selected Report in generate:', this.selectedReport);
//     console.log('Selected Chart Type in generate:', this.selectedChartType);
    
//     if (!this.selectedReport || this.selectedReport === '') {
//         alert('Please select a report');
//         return;
//     }
    
//     if (!this.selectedChartType) {
//         alert('Please select a chart type');
//         return;
//     }

//     const report = this.availableReports.find(r => r.value === this.selectedReport);
    
//     if (!report) {
//         alert('Selected report not found');
//         return;
//     }

//     const newGraph = {
//         id: 'dynamic_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
//         title: this.graphTitle || report.label,
//         reportType: this.selectedReport,
//         chartType: this.selectedChartType,
//         data: null,
//         isLoading: true,
//         chartInstance: null
//     };

//     this.dynamicGraphs.push(newGraph);
//     this.saveDynamicGraphs();
//     this.closeAddGraphModal();
    
//     // Fetch data for this graph
//     this.fetchDynamicGraphData(newGraph);
    
//     // Auto-scroll to the new graph after it's rendered
//     setTimeout(() => {
//         this.scrollToGraph(newGraph.id);
//     }, 500);
// }

// Add scroll method
// Add this method to your component
scrollToGraph(graphId: string) {
    // Small delay to ensure the graph is rendered
    setTimeout(() => {
        const element = document.getElementById(`graph-card-${graphId}`);
        if (element) {
            // Scroll the element into view smoothly
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'center',  // Center the element in the viewport
                inline: 'nearest'
            });
            
            // Add a temporary highlight effect
            element.classList.add('graph-highlight');
            
            // Remove highlight after 2 seconds
            setTimeout(() => {
                element.classList.remove('graph-highlight');
            }, 2000);
            
            console.log('Scrolled to graph:', graphId);
        } else {
            console.log('Graph element not found yet, retrying...');
            // If element not found, retry after a delay
            setTimeout(() => this.scrollToGraph(graphId), 300);
        }
    }, 500); // Wait 500ms for graph to render
}
// Add these methods to your DashboardComponent

onReportChange(value: string) {
    console.log('Report changed to:', value);
    this.selectedReport = value;
}

onChartTypeChange(type: string) {
    console.log('Chart type changed to:', type);
    this.selectedChartType = type;
}
// Update your fetchDynamicGraphData method with better error handling:
// fetchDynamicGraphData(graph: any) {
//     console.log('Fetching data for graph:', graph);
    
//     const report = this.availableReports.find(r => r.value === graph.reportType);
//     console.log('Report found:', report);
    
//     if (!report) {
//         console.error('Report not found for type:', graph.reportType);
//         graph.isLoading = false;
//         return;
//     }

//     const apiUrl = `${this.baseUrl}dashboard/${report.endpoint}/`;
//     console.log('API URL:', apiUrl);
    
//     this.http.get(apiUrl).subscribe({
//         next: (response: any) => {
//             console.log('API Response:', response);
            
//             if (response?.data && response.data.length > 0) {
//                 // Make sure field names match exactly
//                 const labels = response.data.map((item: any) => {
//                     // Handle different field name possibilities
//                     return item[report.labelField] || 
//                            item[report.labelField.toLowerCase()] || 
//                            item[Object.keys(item)[0]]; // Fallback to first key
//                 });
                
//                 const values = response.data.map((item: any) => {
//                     return item[report.dataField] || 
//                            item[report.dataField.toLowerCase()] || 
//                            0;
//                 });
                
//                 console.log('Processed Labels:', labels);
//                 console.log('Processed Values:', values);
                
//                 graph.data = {
//                     labels: labels,
//                     datasets: [{
//                         label: report.label,
//                         data: values,
//                         backgroundColor: this.getChartColors(graph.chartType, values.length),
//                         borderColor: '#000000',
//                         borderWidth: 1
//                     }]
//                 };
                
//                 graph.isLoading = false;
                
//                 setTimeout(() => {
//                     this.renderDynamicGraph(graph);
//                 }, 100);
//             } else {
//                 console.error('No data in response');
//                 graph.isLoading = false;
//                 // Set empty data to show error state
//                 graph.data = null;
//             }
//         },
//         error: (error) => {
//             console.error('Error fetching graph data:', error);
//             graph.isLoading = false;
//             graph.data = null;
//         }
//     });
// }

fetchDynamicGraphData(graph: any) {
    console.log('Fetching data for graph:', graph);
    
    const report = this.availableReports.find(r => r.value === graph.reportType);
    console.log('Report found:', report);
    
    if (!report) {
        console.error('Report not found for type:', graph.reportType);
        graph.isLoading = false;
        return;
    }

    // Use endpoint only (since we transformed apiUrl to endpoint)
    const apiUrl = `${this.baseUrl}${report.endpoint}`;
    console.log('API URL:', apiUrl);
    
    this.http.get(apiUrl).subscribe({
        next: (response: any) => {
            console.log('API Response:', response);
            
            // Handle different response structures
            let responseData = [];
            
            if (response?.data && Array.isArray(response.data)) {
                responseData = response.data;
            } else if (Array.isArray(response)) {
                responseData = response;
            } else if (response?.results && Array.isArray(response.results)) {
                responseData = response.results;
            } else {
                console.error('Unexpected response structure:', response);
                graph.isLoading = false;
                graph.data = null;
                return;
            }
            
            if (responseData.length > 0) {
                // Extract labels and values based on report configuration
                const labels = responseData.map((item: any) => {
                    // Try different possible label fields
                    return item[report.labelField] || 
                           item[report.labelField?.toLowerCase()] ||
                           item['name'] || 
                           item['invoice_no'] ||
                           item['customer'] ||
                           item['customerName'] ||
                           item['product'] ||
                           item['product_name'] ||
                           item['date'] ||
                           item['month'] ||
                           item[Object.keys(item)[0]] || 
                           'Unknown';
                });
                
                const values = responseData.map((item: any) => {
                    // Try different possible value fields
                    let value = item[report.dataField] || 
                                item[report.dataField?.toLowerCase()] ||
                                item['total_amount'] || 
                                item['total_sales'] || 
                                item['amount'] || 
                                item['value'] || 
                                item['total'] ||
                                item['total_orders'] ||
                                item['total_value'] ||
                                0;
                    
                    // Convert to number if it's a string
                    if (typeof value === 'string') {
                        value = parseFloat(value) || 0;
                    }
                    
                    return value || 0;
                });
                
                console.log('Processed Labels:', labels);
                console.log('Processed Values:', values);
                
                graph.data = {
                    labels: labels,
                    datasets: [{
                        label: report.label || graph.title,
                        data: values,
                        backgroundColor: this.getChartColors(graph.chartType, values.length),
                        borderColor: '#000000',
                        borderWidth: 1
                    }]
                };
                
                graph.isLoading = false;
                
                setTimeout(() => {
                    this.renderDynamicGraph(graph);
                }, 100);
            } else {
                console.log('No data in response');
                graph.isLoading = false;
                graph.data = null;
            }
        },
        error: (error) => {
            console.error('Error fetching graph data:', error);
            graph.isLoading = false;
            graph.data = null;
        }
    });
}
// Add these methods to your existing DashboardComponent class

// Open modal to add new graph
openAddGraphModal() {
  this.isAddGraphModalOpen = true;
  this.selectedReport = '';
  this.selectedChartType = 'bar';
  this.graphTitle = '';

  console.log('Modal opened');
}

// Add this method to handle report selection
// onReportSelect(value: string) {
//     console.log('Report selected:', value);
//     this.selectedReport = value;
// }

// Add this debugging method to check if your template is binding correctly

checkSelection() {
    console.log('Current values:', {
        selectedReport: this.selectedReport,
        selectedChartType: this.selectedChartType
    });
    alert(`Report: ${this.selectedReport || 'None'}\nChart: ${this.selectedChartType}`);
}

closeAddGraphModal() {
  this.isAddGraphModalOpen = false;
}

// Add these helper methods to your component

// Get report label by value
getReportLabel(reportValue: string): string {
    console.log('Getting label for report:', reportValue);
    const report = this.availableReports.find(r => r.value === reportValue);
    return report ? report.label : reportValue;
}

// Get chart type label
getChartTypeLabel(chartType: string): string {
    console.log('Getting label for chart type:', chartType);
    // Handle case sensitivity - your chartType might be 'Line' but your chartTypes use 'line'
    const type = this.chartTypes.find(t => 
        t.value.toLowerCase() === chartType.toLowerCase()
    );
    return type ? type.label : chartType;
}

// Also add this method for report descriptions (optional)
getReportDescription(reportValue: string): string {
    const descriptions: {[key: string]: string} = {
        'Sales_Over_the_Last_12_Months': 'Monthly sales trend for the last 12 months',
        'Purchase_Over_the_Last_12_Months': 'Monthly purchase trend for the last 12 months',
        'Top_5_Items_Sold_In_Last_30_Days': 'Best selling items in the last 30 days',
        'Top_5_Items_Groups_In_Last_6_Months': 'Top performing item groups in last 6 months',
        'Top_5_Customers_In_Last_6_Months': 'Highest spending customers in last 6 months',
        'Top_5_Sold_Items_In_Current_FY': 'Most profitable items in current financial year',
        'Compare_weekly_sales_and_growth': 'Compare current week sales with previous periods',
        'Compare_weekly_purchase_and_growth': 'Compare current week purchases with previous periods',
        'Sales_Order_Trend_Graph': 'Track sales orders, invoices, and returns'
    };
    return descriptions[reportValue] || '';
}

// Generate and add new graph
// generateGraph() {
//   if (!this.selectedReport || !this.selectedChartType) {
//     alert('Please select report and chart type');
//     return;
//   }

//   const report = this.availableReports.find(r => r.value === this.selectedReport);
//   if (!report) return;

//   const newGraph = {
//     id: 'dynamic_' + Date.now(),
//     title: this.graphTitle || report.label,
//     reportType: this.selectedReport,
//     chartType: this.selectedChartType,
//     data: null,
//     isLoading: true,
//     chartInstance: null
//   };

//   this.dynamicGraphs.push(newGraph);
//   this.closeAddGraphModal();
  
//   // Fetch data for this graph
//   this.fetchDynamicGraphData(newGraph);
// }

// Fetch data for dynamic graph
// fetchDynamicGraphData(graph: any) {
//   const report = this.availableReports.find(r => r.value === graph.reportType);
//   if (!report) return;

//   const apiUrl = `${this.baseUrl}dashboard/${report.endpoint}/`;
  
//   this.http.get(apiUrl).subscribe({
//     next: (response: any) => {
//       if (response?.data) {
//         // Prepare chart data
//         const labels = response.data.map((item: any) => item[report.labelField]);
//         const values = response.data.map((item: any) => item[report.dataField] || 0);
        
//         graph.data = {
//           labels: labels,
//           datasets: [{
//             label: report.label,
//             data: values,
//             backgroundColor: this.getChartColors(graph.chartType, values.length),
//             borderColor: '#000000',
//             borderWidth: 1
//           }]
//         };
        
//         graph.isLoading = false;
        
//         // Render after DOM update
//         setTimeout(() => {
//           this.renderDynamicGraph(graph);
//         }, 100);
//       }
//     },
//     error: (error) => {
//       console.error('Error fetching graph data:', error);
//       graph.isLoading = false;
//     }
//   });
// }

// Render dynamic graph
renderDynamicGraph(graph: any) {
  const canvasId = `dynamic-graph-${graph.id}`;
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
  
  if (!canvas || !graph.data) return;

  // Destroy existing chart if any
  if (graph.chartInstance) {
    graph.chartInstance.destroy();
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: graph.chartType !== 'bar' },
      title: {
        display: true,
        text: graph.title,
        color: '#2c2e35',
        font: { size: 12 }
      }
    }
  };

  if (graph.chartType === 'bar' || graph.chartType === 'line') {
    options['scales'] = {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: number) => {
            if (value >= 1e7) return (value/1e7) + 'Cr';
            if (value >= 1e5) return (value/1e5) + 'L';
            if (value >= 1e3) return (value/1e3) + 'K';
            return value;
          }
        }
      }
    };
  }

  graph.chartInstance = new Chart(ctx, {
    type: graph.chartType,
    data: graph.data,
    options: options
  });
}

// Helper method for colors
getChartColors(type: string, count: number): string | string[] {
  const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];
  
  if (type === 'pie' || type === 'doughnut') {
    return Array(count).fill(0).map((_, i) => colors[i % colors.length]);
  }
  
  return colors[0]; // Single color for bar/line charts
}

// // Remove dynamic graph
// removeDynamicGraph(graphId: string) {
//   const index = this.dynamicGraphs.findIndex(g => g.id === graphId);
//   if (index !== -1) {
//     if (this.dynamicGraphs[index].chartInstance) {
//       this.dynamicGraphs[index].chartInstance.destroy();
//     }
//     this.dynamicGraphs.splice(index, 1);
//   }
// }

// Save dynamic graphs layout
saveDynamicGraphs() {
  const graphsToSave = this.dynamicGraphs.map(g => ({
    id: g.id,
    title: g.title,
    reportType: g.reportType,
    chartType: g.chartType
  }));
  localStorage.setItem('dynamicDashboard', JSON.stringify(graphsToSave));
}

// Load saved dynamic graphs
loadDynamicGraphs() {
  const saved = localStorage.getItem('dynamicDashboard');
  if (saved) {
    try {
      const graphs = JSON.parse(saved);
      graphs.forEach((g: any) => {
        const graph = {
          ...g,
          data: null,
          isLoading: true,
          chartInstance: null
        };
        this.dynamicGraphs.push(graph);
        this.fetchDynamicGraphData(graph);
      });
    } catch (e) {
      console.error('Failed to load saved graphs', e);
    }
  }
}

    // availableReports: any[] = [];
    reportsByCategory: any = {};
    selectedCategory: string = '';

//pramod - changes end-------------------------
  
  ngOnInit() {
    Chart.register(...registerables);
    this.fetchTasks();
    this.fetchWorkOrders(); 
    this.fourthRowSmallTableData('Product_Not_Sold_In_30_Days_For_Table')
    this.fourthRowSmallTableData('Customers_With_No_Sales_In_30_Days_For_Table')  
    this.fourthRowSmallTableData('Pending_For_Table')

    this.loadCurrentYearFinancialData();
    this.loadReportsFromConfig();
    this.loadTileData();
  }

loadTileData() {
        this.isLoadingTiles = true;
        this.tilesService.getTileData().subscribe({
            next: (response: any) => {
                console.log('Tile data loaded:', response);
                
                if (response?.data) {
                    this.tiles = response.data.map((tile: any) => ({
                        id: tile.id,
                        title: tile.title,
                        value: tile.current_value,
                        change: tile.percentage_change,
                        icon: tile.icon,
                        color: tile.color,
                        modalType: tile.modal_type, // 'sales', 'purchase', 'receivables', etc.
                        trend: tile.trend // 'up' or 'down'
                    }));
                    
                    // Also update individual properties if needed for existing modals
                    this.updateIndividualTileProperties();
                }
                
                this.isLoadingTiles = false;
            },
            error: (error) => {
                console.error('Error loading tiles:', error);
                this.isLoadingTiles = false;
                this.loadFallbackTiles();
            }
        });
    }

    loadFallbackTiles() {
        // Fallback data if API fails
        this.tiles = [
            {
                id: 'sales',
                title: 'Sales',
                value: this.currentWeekSales || 0,
                change: this.percentageSalesChange || 0,
                modalType: 'sales',
                trend: this.percentageSalesChange > 0 ? 'up' : 'down'
            },
            {
                id: 'purchase',
                title: 'Purchase',
                value: this.currentWeekPurchase || 0,
                change: this.percentagePurchaseChange || 0,
                modalType: 'purchase',
                trend: this.percentagePurchaseChange > 0 ? 'up' : 'down'
            },
            {
                id: 'receivables',
                title: 'Receivables',
                value: 0,
                change: 0,
                modalType: 'receivables',
                trend: 'neutral'
            },
            {
                id: 'payables',
                title: 'Payables',
                value: 0,
                change: 0,
                modalType: 'payables',
                trend: 'neutral'
            },
            {
                id: 'cashbank',
                title: 'Cash/Bank',
                value: 0,
                change: 0,
                modalType: 'liquidity',
                trend: 'neutral'
            }
        ];
        
        this.updateIndividualTileProperties();
    }

    updateIndividualTileProperties() {
        // Update existing properties for backward compatibility
        const salesTile = this.tiles.find(t => t.modalType === 'sales');
        if (salesTile) {
            this.currentWeekSales = salesTile.value;
            this.percentageSalesChange = salesTile.change;
        }
        
        const purchaseTile = this.tiles.find(t => t.modalType === 'purchase');
        if (purchaseTile) {
            this.currentWeekPurchase = purchaseTile.value;
            this.percentagePurchaseChange = purchaseTile.change;
        }
    }

    openTileModal(tile: any) {
        switch(tile.modalType) {
            case 'sales':
                this.openSalesModal();
                break;
            case 'purchase':
                this.openPurchaseModal();
                break;
            case 'receivables':
                this.openReceivablesModal();
                break;
            case 'payables':
                this.openPayablesModal();
                break;
            case 'liquidity':
                this.openLiquidityModal();
                break;
            default:
                console.log('Unknown tile type:', tile.modalType);
        }
    }


isLoadingReports: boolean = false;
// loadReportsFromConfig() {
//     this.isLoadingReports = true;
    
//     // Transform REPORT_CONFIGS to match expected format
//     this.availableReports = Object.values(REPORT_CONFIGS).map((report: any) => ({
//         value: report.value,
//         label: report.label,
//         endpoint: report.apiUrl || report.endpoint,  // Use apiUrl or endpoint
//         labelField: report.labelField,
//         dataField: report.dataField,
//         module: report.module,
//         category: report.category
//     }));
    
//     // Group by category for the dropdown
//     this.reportsByCategory = this.availableReports.reduce((acc: any, report: any) => {
//         if (!acc[report.category]) {
//             acc[report.category] = [];
//         }
//         acc[report.category].push(report);
//         return acc;
//     }, {});
    
//     console.log('Loaded reports:', this.availableReports);
//     console.log('Reports by category:', this.reportsByCategory);
    
//     this.isLoadingReports = false;
// }
  

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
  constructor(private http: HttpClient, private siteConfigService: SiteConfigService, private reportsService: ReportsService,
        private tilesService: DashboardTilesService,  // Add this
        @Inject(PLATFORM_ID) private platformId: Object
      ) {
        Chart.register(...registerables);
    }

// Add this method to your component
onResize() {
    // Redraw charts when window resizes
    this.dynamicGraphs.forEach(graph => {
        if (graph.chartInstance) {
            graph.chartInstance.resize();
        }
    });
}


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
        
        // Load saved dynamic graphs after main charts are ready
        setTimeout(() => {
          this.loadDynamicGraphs();
        }, 500);
      })
      .catch(error => {
        console.error('Error loading chart data:', error);
    });
  }

  // ngAfterViewInit() {
  //   // Initialize all three charts after view is rendered
  //   this.initializeChart(this.chartDirectExpensesCanvas, this.directExpensesData, 'pie' ,'Last 6 Months Direct Expenses');
  //   this.initializeChart(this.chartOperationalExpensesCanvas, this.operationalExpensesData, 'pie' ,'Last 6 Months Operational Expenses');
    
  //   //Last6MonthsCashflowData
  //   this.initializeChart(this.chartLast6MonthsCashflowCanvas, this.Last6MonthsCashflowData, 'bar', "Last 6 Month's Cashflow"); // Top 6 Profit Making Items

  //   Promise.all([
  //     this.fetchDataAndRenderChart("Compare_weekly_purchase_and_growth"),
  //     this.fetchDataAndRenderChart("Compare_weekly_sales_and_growth"), 
  //     this.fetchDataAndRenderChart("Sales_Order_Trend_Graph"),
  //     this.fetchDataAndInitializeChart('Sales_Over_the_Last_12_Months', {
  //       labelsTarget: this.salesData.labels,
  //       dataTarget: this.salesData.datasets[0].data,
  //       labelField: 'month_year',
  //       dataField: 'total_sales',
  //     }),
  //     this.fetchDataAndInitializeChart('Purchase_Over_the_Last_12_Months', {
  //       labelsTarget: this.purchaseData.labels,
  //       dataTarget: this.purchaseData.datasets[0].data,
  //       labelField: 'month_year',
  //       dataField: 'monthly_purchases',
  //     }),      
  //     this.fetchDataAndInitializeChart('Top_5_Itmes_Sold_In_Last_30_Days', {
  //       labelsTarget: this.top5ItemsData.labels,
  //       dataTarget: this.top5ItemsData.datasets[0].data,
  //       labelField: 'product_name',
  //       dataField: 'total_sold_quantity',
  //     }),
  //     this.fetchDataAndInitializeChart('Top_5_Items_Groups_In_Last_6_Months', {
  //       labelsTarget: this.top5ItemsIn6MonthsData.labels,
  //       dataTarget: this.top5ItemsIn6MonthsData.datasets[0].data,
  //       labelField: 'item_group',
  //       dataField: 'total_amount',
  //     }),
  //     this.fetchDataAndInitializeChart('Top_5_Sold_Items_In_Current_FY', {
  //       labelsTarget: this.top5ProfitMakingItemsData.labels,
  //       dataTarget: this.top5ProfitMakingItemsData.datasets[0].data,
  //       labelField: 'item_name',
  //       dataField: 'total_amount',
  //     }),
  //     this.fetchDataAndInitializeChart('Top_5_Customers_In_Last_6_Months', {
  //       labelsTarget: this.top5CustomersData.labels,
  //       dataTarget: this.top5CustomersData.datasets[0].data,
  //       labelField: 'CustomerName',
  //       dataField: 'TotalAmount',
  //     }),
  //   ])
  //     .then(() => {
  //       // Initialize charts after all data is fetched
  //       this.initializeChart(this.chartTop5ItemsCanvas, this.top5ItemsData, 'pie', 'Top 5 Items Sold In Last 30 days');
  //       this.initializeChart(this.chartTop5ItemsIn6MonthsCanvas, this.top5ItemsIn6MonthsData, 'pie', 'Top 5 Items (Last 6 Months)');
  //       this.initializeChart(this.chartTop5CustomersOf6MonthsCanvas, this.top5CustomersData, 'bar', 'Top 5 Customers (Last 6 Months)');
  //       this.initializeChart(this.chartTop5ProfitMakingItemsCanvas, this.top5ProfitMakingItemsData, 'bar', 'Top 5 Profit-Making Items');
  //     })
  //     .catch(error => {
  //       console.error('Error loading chart data:', error);
  //   });
  // }

  // ngOnDestroy() {
  //   this.destroyChart(this.salesChart, chart => this.salesChart = null);
  //   this.destroyChart(this.purchaseChart, chart => this.purchaseChart = null);
  //   this.destroyChart(this.receivablesChart, chart => this.receivablesChart = null);
  //   this.destroyChart(this.payablesChart, chart => this.payablesChart = null);
  //   this.destroyChart(this.liquidityChart, chart => this.liquidityChart = null);
  // }
ngOnDestroy() {
    this.destroyChart(this.salesChart, chart => this.salesChart = null);
    this.destroyChart(this.purchaseChart, chart => this.purchaseChart = null);
    this.destroyChart(this.receivablesChart, chart => this.receivablesChart = null);
    this.destroyChart(this.payablesChart, chart => this.payablesChart = null);
    this.destroyChart(this.liquidityChart, chart => this.liquidityChart = null);
    
    // Cleanup dynamic graphs
    if (this.dynamicGraphs && this.dynamicGraphs.length > 0) {
      this.dynamicGraphs.forEach(graph => {
        if (graph.chartInstance) {
          graph.chartInstance.destroy();
        }
      });
    }
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
