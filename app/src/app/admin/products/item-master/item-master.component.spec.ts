import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemMasterComponent } from './item-master.component';

describe('ItemMasterComponent', () => {
  let component: ItemMasterComponent;
  let fixture: ComponentFixture<ItemMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ItemMasterComponent]
    });
    fixture = TestBed.createComponent(ItemMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
