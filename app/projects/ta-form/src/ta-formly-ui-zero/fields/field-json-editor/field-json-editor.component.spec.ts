import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldJsonEditorComponent } from './field-json-editor.component';

describe('FieldJsonEditorComponent', () => {
  let component: FieldJsonEditorComponent;
  let fixture: ComponentFixture<FieldJsonEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FieldJsonEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldJsonEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
