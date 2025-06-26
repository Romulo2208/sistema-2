import { NucleoService } from './../../nucleos/shared/nucleo.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { switchMap } from 'rxjs/operators';
import { AclService } from 'src/app/pages/acl/shared/acl.service';



import { User } from '../shared/user.model';
import { UserService } from '../shared/user.service';



@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  pageTitle: string;
  currentAction: string;

  list_roles: any[];
  list_comar: any[];
  list_nucleos_by_comar: any[] = [];
  

  userForm: FormGroup;
  
  user: User = new User();

  isReadyOnly = false;
  editPassword = false;
  
  


  constructor(
    private toastr: ToastrService,
    private userService: UserService,
    private nucleoService: NucleoService,
    private aclService:AclService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.loadRoles();
    this.setCurrentAction();
    this.buildUserForm();
    this.loadUser();
    this.loadComars();
   }



  private loadRoles(){
    this.aclService.getAllRoles().subscribe(
      res=>{
        this.list_roles = res;
      }
    );
  }


  private loadComars(){
    this.nucleoService.getAllComars().subscribe(
      res => {
        // console.log(res);
        this.list_comar = res;
      }
    )
  }



  private loadNucleoByComar(comars:any){

    //limpar o form

    //  console.log(comars)

    this.userForm.get('nucleos').setValue(null);

    this.list_nucleos_by_comar = [];
  
    comars.forEach(e => {
      let queryString  = `nucleos?comar_id_like=${e.id}&_limit=1000000000000000`
      this.nucleoService.getAllNucleoQueryString(queryString).subscribe(
        res =>{
          this.list_nucleos_by_comar = (res);
        }
      )
    })
  }



  // PRIVATE METHODS
  private setCurrentAction() {
    if (this.route.snapshot.url[0].path === 'new'){
      this.currentAction = 'new';
      this.pageTitle = 'Novo Usuário';
      this.editPassword = true;
    }else{
      this.currentAction = 'edit';
      this.pageTitle = 'Editando Usuário';
    }
  }

  private buildUserForm() {
    
    this.userForm = this.formBuilder.group({
      id: [null],
      cpf: [null],
      name: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      username: [null, [Validators.required]],
      password: [null],
      password_confirmation: [null],
      roles:   [null],
      permissions: [null],
      comars:[null],
      nucleos:[null],

    });

  }


  private updateValidators(){
    this.userForm.get('password').clearValidators();
    this.userForm.get('password_confirmation').clearValidators();
    this.userForm.get('password').setErrors(null);
    this.userForm.get('password_confirmation').setErrors(null);
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


getBuscarUsuario(){
  // this.formularioPronto = false;

   const cep: number = this.userForm.get('cpf').value;

   this.userService.buscaCpf(cep).subscribe(
     (usuario)=>{

       //console.log("Usuario retornado: ", usuario);
       this.preencheUsuario(usuario);
     }
   );

 }


 preencheUsuario(usuario){

  this.userForm.patchValue({
    name : usuario.name,
    email : usuario.email,
    username : usuario.username
  
  });
}


  private loadUser() {

    if(this.currentAction === 'new'){
     // this.canEditPassword = true;
    }


    if (this.currentAction === 'edit') {

      this.route.paramMap.pipe(
        switchMap(params => this.userService.getById(+params.get('id')))
      )
        .subscribe(
          (user) => {

            // console.log(user);
 
            this.userForm.patchValue(user); // binds loaded user data to UserForm

            const roles   = user.roles.map(e => {return e.id});
            const nucleos = user.nucleos.map(e => {return e.id});
            const comars  = user.comars.map(e => {return e.id});

            this.loadNucleoByComar(user.comars);

            if(roles.length > 0)
              this.userForm.get('roles').patchValue(roles[0]);
            
            this.userForm.get('nucleos').patchValue(nucleos)
            this.userForm.get('comars').patchValue(comars);


            /*
            if(!this.canEditPassword){
              //this.updateValidators();
            }
            */
          },
          (err) => {
            const msg_error = err.error.error;
            this.toastr.error(msg_error); 
          }
        )
    }
  }

  submitForm() {
   
    if (this.currentAction === 'new'){
      this.createUser();
    }else{ // currentAction == "edit"
      this.updateUser();
    }

  }



  private createUser() {

    const user: User = Object.assign(new User(), this.userForm.value);
    
    this.userService.create(user)
      .subscribe(
        res => {
          const msg = res.message;
          this.toastr.success(msg);
          this.router.navigate(["usuarios"]);
        },
        (err) => {
          const msg_error = err.error.error;
          this.toastr.error(msg_error); 
        }
      )

  }


  private updateUser() {
    const userForm= this.userForm.value;
    const user: User = Object.assign(new User(), userForm);

    if(!this.editPassword){
      delete user.password;
    }

    this.userService.update(user)
      .subscribe(
        res => {
          const msg = res.message;
          this.toastr.success(msg);
          this.router.navigate(["usuarios"]);
        },
        (err) => {
          const msg_error = err.error.error;
          this.toastr.error(msg_error); 
        }
      )
  }


}
