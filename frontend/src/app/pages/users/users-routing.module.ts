import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserListComponent } from './user-list/user-list.component';
import { UserFormComponent } from './user-form/user-form.component';

const routes: Routes = [
  {path:'',         component: UserListComponent },
  {path:'new',      component: UserFormComponent,   data: { breadcrumb: 'Novo Usuário',}},
  {path:':id/edit', component: UserFormComponent,   data: { breadcrumb: 'Editar Usuário' }},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
