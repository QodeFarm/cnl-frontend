import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickpacksListComponent } from './quickpacks-list.component';

describe('QuickpacksListComponent', () => {
  let component: QuickpacksListComponent;
  let fixture: ComponentFixture<QuickpacksListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuickpacksListComponent]
    });
    fixture = TestBed.createComponent(QuickpacksListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
