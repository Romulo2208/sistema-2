import { Component, OnInit } from "@angular/core";
import { LoginService } from "../login/login.service";

@Component({
    template: ''
  })
  
  export class LogoutComponent implements OnInit {
  
    constructor(private loginService:LoginService) {}
  
    ngOnInit() {
      this.loginService.logout();
    }
  
  }