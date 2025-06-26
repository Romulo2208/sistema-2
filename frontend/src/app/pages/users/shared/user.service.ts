import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

import {User} from './user.model';
import {config} from '../../../app.conf';
import { ServerDataSource } from 'ng2-smart-table';
// import { Role } from '../../../acl/shared/role.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  
  

  private apiPath:string = `${config.URL_BACKEND}/users`;
  
  constructor(private http: HttpClient) { }


  getAllUser() {
    const url =  `${config.URL_BACKEND}/users`;
    return new ServerDataSource(this.http, { endPoint: url });
  }

  getById(id: number): Observable<User> {
    const url = `${this.apiPath}/${id}`;

    return this.http.get(url).pipe(
      catchError(this.handleError),
      map(this.jsonDataToUser)
    )
  }


  buscaCpf(cpf: number): Observable<any> {
    const url = `${config.URL_BACKEND}/userLdap/${cpf}`;    
    return this.http.get(url).pipe(
      catchError(this.handleError),
      tap()
    )
  }

  getQueryString(query_string):Observable<User[]>{

    const url =  `${config.URL_BACKEND}/users?${query_string}`;
    return this.http.get(url).pipe(
      catchError(this.handleError),
      map(this.jsonDataToUsers)
    )

  }


  create(user: User): Observable<any> {
    const url =  `${config.URL_BACKEND}/users`;
    return this.http.post(url, user).pipe(
      catchError(this.handleError),
      tap()
    )
  }

  update(user: User): Observable<any> {
    const url = `${this.apiPath}/${user.id}`;
    return this.http.put(url, user).pipe(
      catchError(this.handleError),
      tap()
    )
  }

  updateDataUser(user: User): Observable<User> {
    const url = `${this.apiPath}/update/${user.id}`;
    return this.http.put(url, user).pipe(
      catchError(this.handleError),
      map(() => user)
    )
  }
  

  delete(id: number): Observable<any> {
    const url = `${this.apiPath}/${id}`;

    return this.http.delete(url).pipe(
      catchError(this.handleError),
      tap()
    )
  }

  deleteBath(users_ids: Array<Number>): Observable<any> {
    const url =  `${config.URL_BACKEND}/users_bath`;
    return this.http.request('delete',url,{body:users_ids}).pipe(
      catchError(this.handleError),
      tap()
    )
  }





  // PRIVATE METHODS

  private jsonDataToUsers(jsonData: any): User[] {
    
    const users: User[] = [];
   
    jsonData.forEach(element => {
      const user = Object.assign(new User(), element);
      users.push(user) ;
    });

    return users;
  }

  private jsonDataToUser(jsonData: any): User {
    const data= jsonData;
    return data as User;
  }

  // private jsonDataToRoles(jsonData: any): Role[] {
  //   const roles: Role[] = [];

  //   // console.log("data: ",jsonData);
    
  //   const data= jsonData.roles;
    
  //    jsonData.forEach(element => {
  //      const role = Object.assign(new Role(), element);
  //      roles.push(role) 
  //    });

  //   return roles;

  // }


  
  private handleError(error: any): Observable<any>{
    return throwError(error);
  }
}
