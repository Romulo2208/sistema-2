import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { fromEvent, Subscription, timer } from 'rxjs';
import { LoginService } from 'src/app/pages/login/login.service';



@Component({
  selector: 'app-user-welcome',
  templateUrl: './user-welcome.component.html',
  styleUrls: ['./user-welcome.component.scss']
})
export class UserWelcomeComponent implements OnInit{


  time_expiration_formatted;

  countDown:Subscription;

  @ViewChild('meuInput') divHello: ElementRef;


  constructor(private loginService:LoginService) { 

  }


  ngOnInit(): void {
      
    let time_expiration_token         = this.loginService.getTimeTokenExpiration() -  moment().unix();
    const time_created_token            = this.loginService.getTimeTokenCreated();

    this.countDown = timer(0, 1000)
      .subscribe(() => {
        time_expiration_token = --time_expiration_token;
        this.time_expiration_formatted = moment.utc(time_expiration_token*1000).format('HH:mm:ss');

        if(time_expiration_token <= 0){
            this.loginService.logout();
        }
      })

  }

  login(){
    this.loginService.handleLogin();
  }

  user(){
     return this.loginService.getUserLogged();
  }


  logout(){
    this.loginService.logout();
  }

  isUserLogged(){
    return this.loginService.isUserLogged()
  }

}
