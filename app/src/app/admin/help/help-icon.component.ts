import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { HelpService } from './help.service';

/**
 * Small reusable "?" button for a screen header.
 * Usage:  <app-help-icon topic="customers"></app-help-icon>
 * Clicking opens the User Guide tab on that topic.
 */
@Component({
  selector: 'app-help-icon',
  standalone: true,
  template: `
    <button type="button" class="help-icon-btn" title="Help for this screen" (click)="open()" aria-label="Help for this screen">
      <i class="fas fa-question-circle"></i>
    </button>
  `,
  styles: [`
    .help-icon-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      vertical-align: middle;
      background: transparent;
      border: 0;
      padding: 0;
      margin: 0;
      color: #142768;
      cursor: pointer;
      line-height: 1;
      transition: color .15s ease;
    }
    .help-icon-btn i {
      display: block;
      font-size: 1rem;
    }
    .help-icon-btn:hover { color: #0d6efd; }
  `]
})
export class HelpIconComponent {
  /** A topic id from help-content.ts, e.g. 'customers' or 'sale-order'. */
  @Input() topic!: string;

  constructor(private helpService: HelpService, private router: Router) {}

  open(): void {
    if (this.topic) { this.helpService.openTopic(this.topic); }
    this.router.navigateByUrl('/admin/help');
  }
}
