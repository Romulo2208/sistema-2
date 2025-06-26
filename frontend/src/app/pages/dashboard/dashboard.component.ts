import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { LoginService } from '../login/login.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent {

  constructor(private loginService:LoginService) { }

  user(){
    return this.loginService.getUserLogged();
 }

 showBeneficiariosAcesso(){
  return this.loginService.hasRole('coordenador_nucleo') ||
         this.loginService.hasRole('gestor_regional');
}


}
