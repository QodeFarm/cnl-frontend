import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';

@Component({
  selector: 'app-inventory-scan',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  templateUrl: './inventory-scan.component.html',
  styleUrls: ['./inventory-scan.component.scss']
})
export class InventoryScanComponent implements AfterViewInit {

  @ViewChild('barcodeInput') barcodeInput!: ElementRef;

  barcode = '';
  qty = 1;
  mode: 'IN' | 'OUT' = 'IN';
  message = '';
  success = false;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.mode = params['mode'] === 'OUT' ? 'OUT' : 'IN';
      console.log('Mode detected:', this.mode);
    });
  }



  ngAfterViewInit() {
    this.barcodeInput.nativeElement.focus();
  }

  onKey(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.scan();
    }
  }


  scan() {
    if (!this.barcode.trim() || this.qty <= 0) return;

    const payload = {
      barcode: this.barcode.trim(),
      mode: this.mode,
      qty: this.qty
    };

    this.http.post<any>('products/barcode-scan/', payload)
      .subscribe({
        next: (res) => {
          this.success = true;
          this.message = `${res.product_name} → Balance: ${res.current_balance}`;
          this.resetUI();
        },
        error: (err) => {
          this.success = false;
          this.message = err.error?.error || 'Scan failed';
          this.resetUI();
        }
      });
  }

  resetUI() {
    this.barcode = '';
    this.qty = 1;
    setTimeout(() => this.barcodeInput?.nativeElement.focus(), 100);
  }
}