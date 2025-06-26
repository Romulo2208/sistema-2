import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EscolaFormComponent } from './escola-form/escola-form.component';

const routes: Routes = [
  {path:'new',        component:EscolaFormComponent,        data: { breadcrumb: 'Registrar nova escola' }},
];

@NgModule({
  imports: [RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class EscolasRoutingModule { }
