import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KpiConfig } from '../../models/widget.models';

@Component({
  selector: 'app-kpi-card-widget',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="kpi-card" [class.clickable]="!!config.clickAction" (click)="onClick()">
      <div class="kpi-header">
        <span class="kpi-indicator" [ngClass]="'ind-' + config.indicator"></span>
        <span class="kpi-label">{{ config.label }}</span>
      </div>
      <div class="kpi-value-row">
        <span class="kpi-value">{{ config.value }}</span>
        <span class="kpi-trend" *ngIf="config.trend" [ngClass]="'trend-' + config.trend">
          <span class="trend-arrow">{{ config.trend === 'up' ? '↑' : config.trend === 'down' ? '↓' : '→' }}</span>
          <span class="trend-text" *ngIf="config.trendValue">{{ config.trendValue }}</span>
        </span>
      </div>
      <p class="kpi-subtitle">{{ config.subtitle }}</p>
    </div>
  `,
  styleUrls: ['./kpi-card-widget.component.scss']
})
export class KpiCardWidgetComponent {
  @Input() config!: KpiConfig;

  onClick() {
    // Parent handles click via (click) on host — this is just for cursor style
  }
}
