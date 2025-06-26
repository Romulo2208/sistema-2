import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Observable, throwError } from 'rxjs';
import { ServerDataSource } from 'ng2-smart-table';
import { AclService } from '../shared/acl.service';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AclHelper } from '../shared/acl-helper';
import { Role } from '../shared/role.model';
import { Permission } from '../shared/permission.model';
import { LoginService } from '../../login/login.service';


@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {

  selected_role:Role;
  permissions: Permission[] = [];

  public settings = AclHelper.getRolesTable();
  source: ServerDataSource;
  addPermissionForm: FormGroup;


  constructor(
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private aclService: AclService,
    private loginService: LoginService
  ) { }

  ngOnInit() {
    this.loadData();
    this.buildFormAddPermission();
  }

  
  loadData() {
    // carregar as roles
    this.source = this.aclService.getAllRolesNg();

    // carrega todas as permissoes
    this.aclService.getAllPermissions().subscribe(
      res=>{
        this.permissions = res;
      }
    );

  }

  private buildFormAddPermission() {
    this.addPermissionForm = this.formBuilder.group({
      role_id: [null, [Validators.required]],
      permissions: [null, [Validators.required]],
    });
  }


  

  onCreate(event) {
    if(!this.loginService.hasRole('admin')){
      this.toastr.warning("Sem permissão para executar esta ação");
      return;
    }
    this.aclService.createRole(event.newData).subscribe(
      (res) => {
        const msg = res.message;
        this.toastr.success(msg);
        const newRole = res.role;
        this.source.add(newRole);
      },
      (err) => {
        const msg_error = err.error.error;
        this.toastr.error(msg_error); 
      }
    )

    event.confirm.resolve();

  }

  onEdit(event) {
    if(!this.loginService.hasRole('admin')){
      this.toastr.warning("Sem permissão para executar esta ação");
      return;
    }

    this.aclService.editRole(event.newData).subscribe(
      (res) => {
        const msg = res.message;
        this.toastr.success(msg);
        const role = res.role;
        this.source.update(event.data, role);
      },
      (err) => {
        const msg_error = err.error.error;
        this.toastr.error(msg_error); 
      }
      
    )

    event.confirm.resolve();
  }

  onDelete(event) {
    
    if(!this.loginService.hasRole('admin')){
      this.toastr.warning("Sem permissão para executar esta ação");
      return;
    }

    if (window.confirm(`Deseja remover Persmissão: ${event.data.name}?`)) {

      this.aclService.deleteRole(event.data).subscribe(
        (res) => {
          const msg = res.message;
          this.toastr.success(msg);
          this.source.remove(event.data);
        },
        (err) => {
          const msg_error = err.error.error;
          this.toastr.error(msg_error); 
        }
      );

      event.confirm.resolve();

    }

  }


  onRowSelect(event) {

    this.selected_role = Object.assign(new Role(), event.data);

    this.addPermissionForm.get('role_id').setValue(this.selected_role.id);

    this.aclService.getPermissionsOfRole(this.selected_role.id).subscribe(
      res=>{

        const permissions_id = [];
        
        res.forEach(permission =>{
          permissions_id.push(permission.id);
        });

        this.addPermissionForm.get('permissions').setValue(permissions_id);

      }
    );

  }



  SyncPermissionsRole(){
    
    const data = this.addPermissionForm.value;

    this.aclService.syncPermissionsInRole(data).subscribe(
      res=>{

        const msg = res.message;
        this.loadData();
        this.toastr.success(msg);

      },
      err=>{
        const msg_error = err.error.error;
        this.toastr.error(msg_error); 
      }
    );
      
 
  }



  setValorRegraClicada(regraSelecionada) {
    //console.log(regraSelecionada);
    this.addPermissionForm.patchValue({ role_id: regraSelecionada.id });
  }



}
