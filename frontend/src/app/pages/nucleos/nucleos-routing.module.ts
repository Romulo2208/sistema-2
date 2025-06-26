import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NucleoFormComponent } from './nucleo-form/nucleo-form.component';
import { NucleoListComponent } from './nucleo-list/nucleo-list.component';

const routes: Routes = [
  {path:'',           component:NucleoListComponent, data: { breadcrumb: 'Todos os Núcleos' }},
  {path:'new',        component:NucleoFormComponent, data: { breadcrumb: 'Criar Novo Núcleo' }},
  {path:'edit/:id',   component:NucleoFormComponent, data: { breadcrumb: 'Editar Núcleo' }}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NucleosRoutingModule { }
