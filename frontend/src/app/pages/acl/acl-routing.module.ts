import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RolesComponent } from './roles/roles.component'
import { PermissionsComponent } from './permissions/permissions.component'
import { PermissionsRolesComponent } from './permissions-roles/permissions-roles.component';
import { PermissionsUsersComponent } from './permissions-users/permissions-users.component';
import { ModulesComponent } from './modules/modules.component';


const routes: Routes = [
  
  { path: 'roles',              component: RolesComponent,              data: { breadcrumb: 'Roles' } },
  { path: 'permissions',        component: PermissionsComponent,        data: { breadcrumb: 'Permissões' } },
  { path: 'permissions-roles',  component: PermissionsRolesComponent,   data: { breadcrumb: 'Permissões dos Grupos' } },
  { path: 'permissions-users',  component: PermissionsUsersComponent,   data: { breadcrumb: 'Permissões para Usuários' } },
  { path: 'modules',            component: ModulesComponent,            data: { breadcrumb: 'Módulos Frontend' } },

  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AclRoutingModule { }
