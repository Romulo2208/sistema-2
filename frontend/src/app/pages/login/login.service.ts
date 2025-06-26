import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, filter } from 'rxjs/operators';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { config } from 'src/app/app.conf';
import jwt_decode from "jwt-decode";


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  urlPath = config.URL_BACKEND;
  //userLogged: User;
  urlNavigate: string;

  constructor(private http: HttpClient, private router: Router) {
    this.router.events.pipe(
      filter(evt => evt instanceof NavigationEnd)
    ).subscribe((e: NavigationEnd) => this.urlNavigate = e.url);
  }

  isUserLogged(): boolean {
    return !!this.getUserLogged() && !this.tokenExpired();
  }


  getToken() {
    return JSON.parse(localStorage.getItem(config.KEY_LOCAL_STORAGE));
  }

  tokenExpired() {
    return (Math.floor((new Date).getTime() / 1000)) >= this.getDecodedAccessToken().exp;
  }

  getUserLogged() {
    return JSON.parse(localStorage.getItem(config.KEY_USER));
  }


  setExpirationIn(time_in_seconds){
    localStorage.setItem(config.KEY_EXPIRES_IN, JSON.stringify(time_in_seconds));
  }

  getExpirationIn(){
    return JSON.parse(localStorage.getItem(config.KEY_EXPIRES_IN));
  }

  getTimeTokenExpiration(){
    return this.getDecodedAccessToken().exp;
  }

  getTimeTokenCreated(){
    return this.getDecodedAccessToken().iat;
  }


  getModule() {
    const modules = localStorage.getItem(config.KEY_MODULES);
    
    if(modules === null){
      return "";
    }

    return  JSON.parse(atob(JSON.parse(localStorage.getItem(config.KEY_MODULES))));
  }


  login(username: string, password: string): any {
    //console.log('url login: ', `${this.urlPath}/api/login`);
    return this.http.post(`${this.urlPath}/login`, { username, password })
      .pipe(
        tap((auth: any) => {
          // console.log(auth.access_token);
          localStorage.setItem(config.KEY_LOCAL_STORAGE, JSON.stringify(auth.access_token));
          localStorage.setItem(config.KEY_USER, JSON.stringify(auth.user));
          localStorage.setItem(config.KEY_EXPIRES_IN, JSON.stringify(auth.expires_in));
          localStorage.setItem(config.KEY_MODULES, JSON.stringify(auth.modules));
        })
      );

  }

  handleLogin(path = this.urlNavigate) {
    this.router.navigate(['/login', path])
  }

  logout() {
    // this.userLogged=undefined;
    // console.log('logout()');
    localStorage.removeItem(config.KEY_LOCAL_STORAGE);
    localStorage.removeItem(config.KEY_EXPIRES_IN);
    localStorage.removeItem(config.KEY_USER);
    localStorage.removeItem(config.KEY_MODULES);
    
    this.router.navigate(['/login']);
  }


  getDecodedAccessToken(): any {
    return jwt_decode(JSON.parse(localStorage.getItem(config.KEY_LOCAL_STORAGE)));
  }


  hasPermission(p_permisssion: string):boolean{
    
    const token = this.getUserLogged();

    const token_decoded = this.getDecodedAccessToken();

    const permissions_user_backend = token_decoded.permissions;

    //  console.log("Token decoded:",token_decoded);
    // console.log("Permissões do usuário enviadas do backend:",permissions_user_backend);

    for(const permission of permissions_user_backend){
      if(permission.slug === p_permisssion){
        // console.log(`Usuario validado. Deveira ter a permissão:${p_permisssion} e possui a permissão:${permission.slug}`);
        return true;
      }
    }

    return false;
  }

  hasRole(p_role: string):boolean{
 
    const token = this.getUserLogged();

    const token_decoded = this.getDecodedAccessToken();

    const roles_user_backend = token_decoded.roles;

    // console.log("Token decoded:",token_decoded);
    // console.log("Roles enviadas do backend:",roles_user_backend);

    for(const role of roles_user_backend){
      if(role.slug === p_role){
        // console.log(`Usuario validado. Deveira ter a role:${p_role} e possui a role:${role.slug}`);
        return true;
      }
    }

    return false;
  }

}
