import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BeneficiarioFormComponent } from './beneficiario-form/beneficiario-form.component';
import { BeneficiarioListComponent } from './beneficiario-list/beneficiario-list.component';
import { BeneficiarioListInativoComponent } from './beneficiario-list-inativo/beneficiario-list-inativo.component';

const routes: Routes = [

  {path:'',           component:BeneficiarioListComponent,        data: { breadcrumb: 'Beneficiários' }},
  {path:'new',        component:BeneficiarioFormComponent,        data: { breadcrumb: 'Registrar novo Beneficiário' }},
  {path:'edit/:id',   component:BeneficiarioFormComponent,        data: { breadcrumb: 'Editar Beneficiário' }},
  {path:'inativos',   component:BeneficiarioListInativoComponent, data: { breadcrumb: 'Inativos' }},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BeneficiariosRoutingModule { }
