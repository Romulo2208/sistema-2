import { CanLoad, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Route, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { LoginService } from '../login/login.service';
import { HttpClient } from '@angular/common/http';

import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/map';

@Injectable()
export class LoggedinGuard implements CanActivate, CanLoad{

    constructor(private loginService:LoginService, private router: Router, private http: HttpClient){

    }



    canActivate(route:ActivatedRouteSnapshot, state:RouterStateSnapshot):boolean{

        // console.log(this.loginService.getModule());
  
        if(!this.loginService.isUserLogged()){
            this.router.navigate(['/login']);
            return false;
        }
   
        return this.Can(route.data.module_slug);
       
    }

  
    canLoad(route:Route):boolean{
        
        return this.Can(route.data.module_slug);
      
    }


    Can(module_slug:string){

        const modules = this.loginService.getModule();

        //dashboard é a base do painel
        if(module_slug === 'dashboard'){
            return true;
        }

        for(let module of modules){
            if(module === module_slug){
                return true;
            }
        }

        return false;

    }


}