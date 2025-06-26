import { Injectable, Injector } from '@angular/core'
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http'
import { Observable } from 'rxjs/Observable'
import { LoginService } from '../login/login.service';



@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private injector: Injector) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const loginService = this.injector.get(LoginService);
    const str = request.url;
    const res = (str.split("ws/"));
    

    if (res[1]) {
      
      let cep = (res[1].split('/'))[0]
      if (request.url == `https://viacep.com.br/ws/${cep}/json/`) {
        return next.handle(request)
      }
    }

    if (loginService.isUserLogged()) {

      const authRequest = request.clone({ setHeaders: { 'Authorization': `Bearer ${loginService.getToken()}` } })
      return next.handle(authRequest);

    }

    return next.handle(request)
    
  }

}