import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SalesInvoiceListComponent } from './salesinvoice-list.component';



describe('SalesinvoiceListComponent', () => {
  let component: SalesInvoiceListComponent;
  let fixture: ComponentFixture<SalesInvoiceListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalesInvoiceListComponent]
    });
    fixture = TestBed.createComponent(SalesInvoiceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
