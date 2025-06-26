import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeficienciaListComponent } from './deficiencia-list/deficiencia-list.component';

const routes: Routes = [
  {path:'',           component:DeficienciaListComponent, data: { breadcrumb: 'Deficiências' }},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeficienciasRoutingModule { }
