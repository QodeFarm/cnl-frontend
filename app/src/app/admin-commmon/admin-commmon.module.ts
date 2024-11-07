import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NzListModule } from 'ng-zorro-antd/list';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSegmentedModule } from 'ng-zorro-antd/segmented';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TaTableModule } from '@ta/ta-table';
import { TaCurdModule } from '@ta/ta-curd';
import { TaFormComponent, TaFormModule } from '@ta/ta-form';
import { RouterModule } from '@angular/router';
import { HasPermissionDirective } from './permision.directive';
const module = [NzListModule,
  CommonModule,
  RouterModule,
  NzSkeletonModule,
  NzLayoutModule,
  NzGridModule,
  NzAvatarModule,
  NzIconModule,
  NzButtonModule,
  NzImageModule,
  NzCardModule,
  NzSegmentedModule,
  FormsModule,
  ReactiveFormsModule,
  TaTableModule,
  TaFormComponent,
  TaCurdModule
];

@NgModule({
  declarations: [HasPermissionDirective],
  imports: [
    module
  ],
  exports: [module, HasPermissionDirective]
})
export class AdminCommmonModule { }
