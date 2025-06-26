import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { DirectivesModule } from '../../theme/directives/directives.module';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxMaskModule } from 'ngx-mask';
import { UsersRoutingModule } from './users-routing.module';
import { UserListComponent } from './user-list/user-list.component';
import { UserFormComponent } from './user-form/user-form.component';


@NgModule({
  declarations: [UserListComponent, UserFormComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    Ng2SmartTableModule,
    DirectivesModule,
    NgSelectModule,
    ReactiveFormsModule,
    FormsModule,
    NgxMaskModule.forRoot(),
  ]
})
export class UsersModule { }
