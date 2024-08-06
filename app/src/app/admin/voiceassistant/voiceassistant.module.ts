import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VoiceassistantRoutingModule } from './voiceassistant-routing.module';
import { VoiceassistantComponent } from './voiceassistant.component';


@NgModule({
  declarations: [
    VoiceassistantComponent
  ],
  imports: [
    CommonModule,
    VoiceassistantRoutingModule
  ]
})
export class VoiceassistantModule { }
