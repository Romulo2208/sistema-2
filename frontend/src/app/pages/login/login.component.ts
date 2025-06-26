import { config } from './../../app.conf';
import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, AbstractControl, FormBuilder, Validators} from '@angular/forms';
import { LoginService } from './login.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent {
  public router: Router;
  public form:FormGroup;
  public username:AbstractControl;
  public password:AbstractControl;

  public urlBackend:string = `${config.URL_BACKEND}/certificado`;


  constructor(router:Router, fb:FormBuilder, private loginService:LoginService, private toastr:ToastrService) {
      this.router = router;
      this.form = fb.group({
          'username': ['', Validators.compose([Validators.required])],
          'password': ['', Validators.compose([Validators.required, Validators.minLength(6)])]
      });

      this.username = this.form.controls['username'];
      this.password = this.form.controls['password'];
  }

  public onSubmit(values:Object):void {

    this.loginService.login(values['username'], values['password']).subscribe(
        (res)   => {this.toastr.success("Login com Sucesso!")},
        (erro)  => {
          this.toastr.error(` ${erro.error.status} ${erro.error.message}! `, "Falha na autenticação");},
        ()      => {this.router.navigate(['/'])}
    );

  }

  ngAfterViewInit(){
      document.getElementById('preloader').classList.add('hide');                 
  }

}
