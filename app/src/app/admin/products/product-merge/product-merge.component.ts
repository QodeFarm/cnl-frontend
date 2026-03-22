import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';

declare var bootstrap: any;

@Component({
  selector: 'app-product-merge',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminCommmonModule, NzSpinModule],
  templateUrl: './product-merge.component.html',
  styleUrls: ['./product-merge.component.scss']
})
export class ProductMergeComponent implements OnInit {

  // ── Data ──
  products: any[] = [];
  isLoading = false;

  // ── Selection ──
  masterProductId: string | null = null;
  duplicateProductId: string | null = null;
  masterProduct: any = null;
  duplicateProduct: any = null;

  // ── Search ──
  masterSearchTerm = '';
  duplicateSearchTerm = '';

  // ── Merge state ──
  isMerging = false;
  mergeSuccess = false;
  mergeResult: any = null;

  constructor(
    private http: HttpClient,
    private notification: NzNotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  // ── Load all active, non-deleted products ──
  loadProducts(): void {
    this.isLoading = true;
    this.http.get('products/products/?no_page=true').subscribe({
      next: (res: any) => {
        this.products = res.data || [];
        this.isLoading = false;
      },
      error: () => {
        this.notification.error('Error', 'Failed to load products');
        this.isLoading = false;
      }
    });
  }

  // ── Filtered lists for dropdowns (max 50 visible for performance) ──
  get filteredMasterProducts(): any[] {
    let list = this.products;
    if (this.masterSearchTerm) {
      const term = this.masterSearchTerm.toLowerCase();
      list = list.filter(
        (p: any) =>
          (p.name || '').toLowerCase().includes(term) ||
          (p.code || '').toLowerCase().includes(term) ||
          (p.print_name || '').toLowerCase().includes(term)
      );
    }
    return list.slice(0, 50);
  }

  get filteredDuplicateProducts(): any[] {
    let list = this.products.filter(
      (p: any) => p.product_id !== this.masterProductId
    );
    if (this.duplicateSearchTerm) {
      const term = this.duplicateSearchTerm.toLowerCase();
      list = list.filter(
        (p: any) =>
          (p.name || '').toLowerCase().includes(term) ||
          (p.code || '').toLowerCase().includes(term) ||
          (p.print_name || '').toLowerCase().includes(term)
      );
    }
    return list.slice(0, 50);
  }

  // ── Selection handlers ──
  onMasterSelected(productId: string): void {
    this.masterProductId = productId;
    this.masterProduct = this.products.find(
      (p: any) => p.product_id === productId
    );
    // Clear duplicate if same product was selected
    if (this.duplicateProductId === productId) {
      this.duplicateProductId = null;
      this.duplicateProduct = null;
    }
  }

  onDuplicateSelected(productId: string): void {
    this.duplicateProductId = productId;
    this.duplicateProduct = this.products.find(
      (p: any) => p.product_id === productId
    );
  }

  clearMaster(): void {
    this.masterProductId = null;
    this.masterProduct = null;
    this.masterSearchTerm = '';
  }

  clearDuplicate(): void {
    this.duplicateProductId = null;
    this.duplicateProduct = null;
    this.duplicateSearchTerm = '';
  }

  // ── Merge preview data ──
  get canMerge(): boolean {
    return !!(this.masterProductId && this.duplicateProductId && !this.isMerging);
  }

  get projectedBalance(): number {
    const masterBal = this.masterProduct?.balance || 0;
    const dupBal = this.duplicateProduct?.balance || 0;
    return masterBal + dupBal;
  }

  // ── Confirmation modal ──
  openConfirmModal(): void {
    const modalEl = document.getElementById('mergeConfirmModal');
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  closeConfirmModal(): void {
    const modalEl = document.getElementById('mergeConfirmModal');
    if (modalEl) {
      const modal = bootstrap.Modal.getInstance(modalEl);
      if (modal) {
        modal.hide();
      }
    }
  }

  // ── Execute merge ──
  executeMerge(): void {
    if (!this.canMerge) return;

    this.isMerging = true;
    this.closeConfirmModal();

    this.http.post('products/merge/', {
      master_product_id: this.masterProductId,
      duplicate_product_id: this.duplicateProductId
    }).subscribe({
      next: (res: any) => {
        this.isMerging = false;
        this.mergeSuccess = true;
        this.mergeResult = res.data;
        this.notification.success(
          'Merge Successful',
          res.message || 'Product merged successfully'
        );
      },
      error: (err: any) => {
        this.isMerging = false;
        const msg = err?.error?.message || 'Merge failed. Please try again.';
        this.notification.error('Merge Failed', msg);
      }
    });
  }

  // ── Reset form for another merge ──
  resetForm(): void {
    this.masterProductId = null;
    this.duplicateProductId = null;
    this.masterProduct = null;
    this.duplicateProduct = null;
    this.masterSearchTerm = '';
    this.duplicateSearchTerm = '';
    this.mergeSuccess = false;
    this.mergeResult = null;
    this.loadProducts();
  }

  // ── Navigate back ──
  goBack(): void {
    this.router.navigate(['/admin/products']);
  }
}
