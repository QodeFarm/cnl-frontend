import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VoiceassistantComponent } from './voiceassistant.component';

const routes: Routes = [{
  path : '',
  component: VoiceassistantComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VoiceassistantRoutingModule { }
