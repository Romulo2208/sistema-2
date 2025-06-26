import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../shared/user.service';
import { UserHelper } from '../shared/user-helper';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from '../shared/user.model';
import { ServerDataSource } from 'ng2-smart-table';
import { LoginService } from '../../login/login.service';


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  public data = [];
  source: ServerDataSource;
  private selectedRows: any = [];
  public settings;

  
  usuarioSelecionado:User;
  eventoSelecionado:string;

  updatePasswordForm: FormGroup;
  
  constructor(
    private toastr: ToastrService,
    private userService: UserService,
    private loginService: LoginService,
    private router: Router,
    private formBuilder: FormBuilder,
  ) { 


  }

  ngOnInit() {

    const is_admin          = this.loginService.hasRole('admin');
    const p_is_coordenador  = this.loginService.hasRole('coordenador_geral');

    this.settings = UserHelper.getSettingsTable(is_admin, p_is_coordenador);
    this.loadData();

    this.buildUpdatePasswordForm();
  }


  private buildUpdatePasswordForm() {
    
    this.updatePasswordForm = this.formBuilder.group({
      id: [null, Validators.required],
      password: [null, [Validators.minLength(6)]],
      confirmPassword: [null, Validators.required],
    },{
      validator: this.MustMatch('password', 'confirmPassword')
    });

  }


  private MustMatch(controlName: string, matchingControlName: string) {

    return (formGroup: FormGroup) => {

        const control         = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
            // return if another validator has already found an error on the matchingControl
            return;
        }

        // set error on matchingControl if validation fails
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
}


  private loadData() {
    this.source = this.userService.getAllUser();
  }


  public onDelete(event) {
    const user = event.data;
    const mustDelete = confirm('Deseja realmente excluir o usuário "' + user.name +'"?');

    if (mustDelete) {
      this.userService.delete(user.id).subscribe(
        (res) => { 
            const msg = res.message;
            this.data = this.data.filter(element => element != user); 
            this.toastr.success(msg); 
            this.source.remove(user);
            //this.loadData();
        },
        (err) => {
          const msg_error = err.error.error;
          this.toastr.error(msg_error); 
        });
    }
    
  }


  public onEdit(event) {
    const user = event.data;
    this.router.navigate(['usuarios', user.id, 'edit']);
  }

  public onCreate(event) {
    this.router.navigate(['usuarios/new']);
  }

  onUserRowSelect(event): void {
    this.selectedRows = event.selected;
    console.log(event)
  }

  deleteBath(event){
     if (!this.selectedRows.length) {
      this.toastr.error('Selecione algum registro!');
      return false;
    }
    let users_id = this.selectedRows.map(user => user.id);
    this.userService.deleteBath(users_id).subscribe(
      res => {
        this.toastr.success(res.message);
        this.source.refresh();
        this.selectedRows=[]; 
        
      },
      error => {
        this.toastr.error(error.error.error);
        console.log(error);
        
      }
    )
  }
  
}
