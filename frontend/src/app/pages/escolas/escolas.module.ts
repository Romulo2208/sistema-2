import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EscolasRoutingModule } from './escolas-routing.module';
import { BeneficiarioFormComponent } from '../beneficiarios/beneficiario-form/beneficiario-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { BeneficiariosModule } from '../beneficiarios/beneficiarios.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    EscolasRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    ToastrModule,
    BeneficiariosModule
  ], 
  exports: []
})
export class EscolasModule { 
}
