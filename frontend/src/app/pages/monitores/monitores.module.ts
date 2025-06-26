import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MonitoresRoutingModule } from './monitores-routing.module';
import { MonitorFormComponent } from './monitor-form/monitor-form.component';
import { MonitorListComponent } from './monitor-list/monitor-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgxMaskModule } from 'ngx-mask';

@NgModule({
  declarations: [MonitorFormComponent, MonitorListComponent],
  imports: [
    CommonModule,
    MonitoresRoutingModule,
    ReactiveFormsModule,
    Ng2SmartTableModule,
    NgSelectModule,
    FormsModule,
    NgxMaskModule.forRoot(),
  ],
  schemas:[
    CUSTOM_ELEMENTS_SCHEMA
  ]
  
})
export class MonitoresModule { }
