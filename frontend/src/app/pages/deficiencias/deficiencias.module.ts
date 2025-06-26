import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeficienciasRoutingModule } from './deficiencias-routing.module';
import { DeficienciaListComponent } from './deficiencia-list/deficiencia-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxMaskModule } from 'ngx-mask';

@NgModule({
  declarations: [DeficienciaListComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Ng2SmartTableModule,
    NgSelectModule,
    FormsModule,
    NgxMaskModule.forRoot(),
    DeficienciasRoutingModule
  ],
 
})
export class DeficienciasModule { }
