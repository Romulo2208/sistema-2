import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RelatoriosRoutingModule } from './relatorios-routing.module';
import { RelatorioBeneficiariosComponent } from './relatorio-beneficiarios/relatorio-beneficiarios.component';
import { RelatorioBeneficiariosEscolaComponent } from './relatorio-beneficiarios-escola/relatorio-beneficiarios-escola.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxMaskModule } from 'ngx-mask';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import {MatDialogModule} from '@angular/material/dialog';
import { SelectTurnosComponent } from './select-turnos/select-turnos.component';

@NgModule({
  declarations: [RelatorioBeneficiariosComponent, RelatorioBeneficiariosEscolaComponent, SelectTurnosComponent],
  entryComponents: [SelectTurnosComponent],
  imports: [
    CommonModule,
    RelatoriosRoutingModule,
    ReactiveFormsModule,
    Ng2SmartTableModule,
    NgSelectModule,
    FormsModule,
    NgxMaskModule.forRoot(),
    MatDialogModule,
  ],
  schemas:[
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class RelatoriosModule { }
