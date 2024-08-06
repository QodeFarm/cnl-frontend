import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickpacksComponent } from './quickpacks.component';

describe('QuickpacksComponent', () => {
  let component: QuickpacksComponent;
  let fixture: ComponentFixture<QuickpacksComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuickpacksComponent]
    });
    fixture = TestBed.createComponent(QuickpacksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
