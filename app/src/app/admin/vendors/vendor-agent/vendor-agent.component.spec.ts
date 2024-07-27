import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorAgentComponent } from './vendor-agent.component';

describe('VendorAgentComponent', () => {
  let component: VendorAgentComponent;
  let fixture: ComponentFixture<VendorAgentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VendorAgentComponent]
    });
    fixture = TestBed.createComponent(VendorAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
