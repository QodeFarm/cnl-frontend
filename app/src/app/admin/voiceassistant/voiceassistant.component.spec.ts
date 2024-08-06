import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoiceassistantComponent } from './voiceassistant.component';

describe('VoiceassistantComponent', () => {
  let component: VoiceassistantComponent;
  let fixture: ComponentFixture<VoiceassistantComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VoiceassistantComponent]
    });
    fixture = TestBed.createComponent(VoiceassistantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
