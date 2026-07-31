import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormControl, Validators } from '@angular/forms';

import { TaFormComponent } from './ta-form.component';

describe('TaFormComponent', () => {
  let component: TaFormComponent;
  let fixture: ComponentFixture<TaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ TaFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

// Constructed directly rather than through TestBed: the submit paths under test touch none of
// the injected services, and this keeps the regression check independent of the fixture above.
describe('TaFormComponent submit state', () => {
  let component: TaFormComponent;

  beforeEach(() => {
    component = new TaFormComponent(null as any, null as any, null as any, null as any);
    // Stands in for the <form> FormGroupDirective formly binds as parentForm.
    component.formlyOptions.parentForm = { submitted: false };
  });

  it('clears the submitted flags when the caller owns the save (no options.url)', () => {
    let receivedModel: any = null;
    component.options = { model: { a: 1 }, submit: { submittedFn: (m: any) => (receivedModel = m) } };

    component.onSubmit();

    expect(receivedModel).toEqual({ a: 1 });
    // Without the clear, a caller that blanks the model after saving repaints every
    // required field red on a form the user has not touched.
    expect(component.formlyOptions.formState.submitted).toBe(false);
    expect(component.form.touched).toBe(false);
    expect(component.formlyOptions.parentForm.submitted).toBe(false);
  });

  it('leaves the flags set when validation fails, so the errors stay visible', () => {
    component.options = { model: {}, submit: {} };
    component.form.addControl('customer_id', new UntypedFormControl(null, Validators.required));

    component.onSubmit();

    expect(component.formlyOptions.formState.submitted).toBe(true);
    expect(component.form.touched).toBe(true);
  });
});
