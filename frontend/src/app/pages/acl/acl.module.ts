import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { AclRoutingModule } from './acl-routing.module';
import { RolesComponent } from './roles/roles.component';
import { PermissionsComponent } from './permissions/permissions.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PermissionsRolesComponent } from './permissions-roles/permissions-roles.component';
import { PermissionsUsersComponent } from './permissions-users/permissions-users.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { EmptyEditorComponent } from './shared/empty-editor.component';
import { ModulesComponent } from './modules/modules.component';

@NgModule({
  declarations: [RolesComponent, PermissionsComponent, PermissionsRolesComponent, PermissionsUsersComponent, EmptyEditorComponent, ModulesComponent],

  imports: [
    CommonModule,
    Ng2SmartTableModule,
    AclRoutingModule,
    ReactiveFormsModule,
    NgSelectModule,
    ReactiveFormsModule
  ],
  entryComponents: [
    EmptyEditorComponent,
  ]
})
export class AclModule { }
