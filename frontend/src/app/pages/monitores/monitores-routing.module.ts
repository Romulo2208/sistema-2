import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MonitorFormComponent } from './monitor-form/monitor-form.component';
import { MonitorListComponent } from './monitor-list/monitor-list.component';


const routes: Routes = [

  {path:'',           component:MonitorListComponent,        data: { breadcrumb: 'Monitores' }},
  {path:'new',        component:MonitorFormComponent,        data: { breadcrumb: 'Registrar novo monitor' }},
  {path:'edit/:id',   component:MonitorFormComponent,        data: { breadcrumb: 'Editar Monitor' }},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MonitoresRoutingModule { }
