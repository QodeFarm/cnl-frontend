import { NgModule } from '@angular/core';
import { TaCoreComponent } from './ta-core.component';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { TaCoreService } from './ta-core.service';
import { TaActionService } from './services/ta-action.service';
import { ScriptService } from './services/script.service';
import { TaImgPipe } from './pipe/ta-img.pipe';
import { ConcatPipe } from './pipe/concat.pipe';
@NgModule({
  declarations: [
    TaCoreComponent,
    TaImgPipe,
    ConcatPipe
  ],
  imports: [
    NzNotificationModule
  ],
  providers: [TaCoreService, TaActionService,ScriptService],
  exports: [
    TaCoreComponent,TaImgPipe,ConcatPipe
  ]
})
export class TaCoreModule { }
