import { Component, OnInit } from '@angular/core';
import { ServerDataSource } from 'ng2-smart-table';
import { AclHelper } from '../shared/acl-helper';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AclService } from '../shared/acl.service';
import { LoginService } from '../../login/login.service';


@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss']
})
export class PermissionsComponent implements OnInit {

  public settings = AclHelper.getSettingsTable();
  source: ServerDataSource;


  constructor(
    private toastr: ToastrService,
    private http: HttpClient,
    private router: Router,
    private aclService: AclService,
    private loginService: LoginService) { }

  ngOnInit() {
    this.loadData();
  }

  loadData(){
    this.source = this.aclService.getAllPermissionsNg();
  }


  onCreate(event) {

    if(!this.loginService.hasRole('admin')){
      this.toastr.warning("Sem permissão para executar esta ação");
      return;
    }

    this.aclService.createPermission(event.newData).subscribe(
      (res) => {
        const msg = res.message;
        this.toastr.success(msg);
        const newPermission = res.permission;
        this.source.add(newPermission);
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
   
    this.aclService.editPermission(event.newData).subscribe(
      (res) => {
        const msg = res.message;
        this.toastr.success(msg);
        const permission = res.permission;
        this.source.update(event.data, permission);
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

      this.aclService.deletePermission(event.data).subscribe(
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



}
