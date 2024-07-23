import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaFileUploadComponent } from './ta-file-upload.component';

describe('TaFileUploadComponent', () => {
  let component: TaFileUploadComponent;
  let fixture: ComponentFixture<TaFileUploadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TaFileUploadComponent]
    });
    fixture = TestBed.createComponent(TaFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
