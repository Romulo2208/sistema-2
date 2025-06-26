import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BeneficiariosRoutingModule } from './beneficiarios-routing.module';
import { BeneficiarioFormComponent } from './beneficiario-form/beneficiario-form.component';
import { BeneficiarioListComponent } from './beneficiario-list/beneficiario-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxMaskModule } from 'ngx-mask';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { BeneficiarioListInativoComponent } from './beneficiario-list-inativo/beneficiario-list-inativo.component';
import {MatDialogModule} from '@angular/material/dialog';
import { EscolaFormComponent } from '../escolas/escola-form/escola-form.component';
import { ModalShowComponent } from './modal-show/modal-show.component';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [BeneficiarioFormComponent, BeneficiarioListComponent, BeneficiarioListInativoComponent, EscolaFormComponent, ModalShowComponent],
  entryComponents: [EscolaFormComponent, ModalShowComponent],
  imports: [
    CommonModule,
    BeneficiariosRoutingModule,
    ReactiveFormsModule,
    Ng2SmartTableModule,
    NgSelectModule,
    FormsModule,
    NgxMaskModule.forRoot(),
    MatDialogModule,
    NgbModalModule
  ],
  schemas:[
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class BeneficiariosModule { }
