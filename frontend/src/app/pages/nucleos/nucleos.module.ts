import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NucleosRoutingModule } from './nucleos-routing.module';
import { NucleoListComponent } from './nucleo-list/nucleo-list.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NucleoFormComponent } from './nucleo-form/nucleo-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { DirectivesModule } from 'src/app/theme/directives/directives.module';




@NgModule({
  declarations: [NucleoListComponent, NucleoFormComponent],
  imports: [
    CommonModule,
    NucleosRoutingModule,
    Ng2SmartTableModule,
    ReactiveFormsModule,
    NgSelectModule,
    FormsModule
  ],
  schemas:[
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class NucleosModule { }
