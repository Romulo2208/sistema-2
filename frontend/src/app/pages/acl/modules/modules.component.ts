import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Observable, throwError } from 'rxjs';
import { ServerDataSource } from 'ng2-smart-table';
import { AclService } from '../shared/acl.service';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AclHelper } from '../shared/acl-helper';
import { Module } from '../shared/module.model';
import { Role } from '../shared/role.model';
import { Permission } from '../shared/permission.model';
import { LoginService } from '../../login/login.service';


@Component({
  selector: 'app-modules',
  templateUrl: './modules.component.html',
  styleUrls: ['./modules.component.scss']
})
export class ModulesComponent implements OnInit {

  selected_module:Module;
  roles: Role[] = [];

  public settings = AclHelper.getModulesTable();
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
    this.source = this.aclService.getAllModulesNg();

    // carrega todas as permissoes
    this.aclService.getAllRoles().subscribe(
      res=>{
        this.roles = res;
      }
    );

  }

  private buildFormAddPermission() {
    this.addPermissionForm = this.formBuilder.group({
      module_id: [null, [Validators.required]],
      roles: [null, [Validators.required]],
    });
  }


  

  onCreate(event) {
    if(!this.loginService.hasRole('admin')){
      this.toastr.warning("Sem permissão para executar esta ação");
      return;
    }
    this.aclService.createModule(event.newData).subscribe(
      (res) => {
        const msg = res.message;
        this.toastr.success(msg);
        const newModule = res.module;
        this.source.add(newModule);
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

    this.aclService.editModule(event.newData).subscribe(
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

    if (window.confirm(`Deseja remover Módulo: ${event.data.name}?`)) {

      this.aclService.deleteModule(event.data).subscribe(
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

    this.selected_module = Object.assign(new Module(), event.data);

    this.addPermissionForm.get('module_id').setValue(this.selected_module.id);

    this.aclService.getRolesOfModule(this.selected_module.id).subscribe(

      res=>{

        const roles_id = [];
        
        res.forEach(role =>{
          roles_id.push(role.id);
        });

        this.addPermissionForm.get('roles').setValue(roles_id);

      }
    );

  }



  SyncRole(){
    
    const data = this.addPermissionForm.value;

    this.aclService.syncRolesInModule(data).subscribe(
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
