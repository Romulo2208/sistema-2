import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

import { config } from '../../../app.conf';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ServerDataSource } from 'ng2-smart-table';
import {Permission} from './permission.model';
import {Role} from './role.model';

@Injectable({
  providedIn: 'root'
})

export class AclService {

  constructor(private http: HttpClient) { }


  getAllRoles():Observable<Role[]> {
    
    const url = `${config.URL_BACKEND}/roles`;

    return this.http.get(url).pipe(
      catchError(this.handleError),
      map(this.jsonDataToRoles)
    );

  }

  getAllRolesNg() {
    const url = `${config.URL_BACKEND}/roles`;
    return new ServerDataSource(this.http, { endPoint: url });
  }



  getAllPermissions(): Observable<Permission[]> {
    const url = `${config.URL_BACKEND}/permissions`;

    return this.http.get(url).pipe(
      catchError(this.handleError),
      map(this.jsonDataToPermissions)
    );

  }

  getAllPermissionsNg() {
    const url = `${config.URL_BACKEND}/permissions`;
    return new ServerDataSource(this.http, { endPoint: url });
  }


  //-- Sincrinizar as permissões de uma role
  syncPermissionsInRole(permission:any):Observable<any>{
    const url = `${config.URL_BACKEND}/permissions/sync-permissions-role`;

    return this.http.post(url, permission).pipe(
      catchError(this.handleError),
      tap()
    );

  }

  // --- Lista todas as permissões de uma role
  getPermissionsOfRole(id): Observable<Permission[]> {

    const url = `${config.URL_BACKEND}/roles/getPermissions/${id}`;
    return this.http.get(url).pipe(
      catchError(this.handleError),
      map(this.jsonDataToPermissions)
    )
  }






  //--- Crud Permissions
  createPermission(newPermission: any): Observable<any> {
    const url = `${config.URL_BACKEND}/permissions`;
    return this.http.post(url, newPermission).pipe(
      catchError(this.handleError),
      tap()
    )
  }


  editPermission(permission: any): Observable<any> {
    const url = `${config.URL_BACKEND}/permissions/${permission.id}`;
    return this.http.put(url, permission).pipe(
      catchError(this.handleError),
      tap()
    )
  }

  deletePermission(permission: any): Observable<any> {
    const url = `${config.URL_BACKEND}/permissions/${permission.id}`;
    return this.http.delete(url).pipe(
      catchError(this.handleError),
      tap()
    )
  }

  //--- Crud ROLES

  createRole(newRole: any): Observable<any> {
    const url = `${config.URL_BACKEND}/roles`;
    return this.http.post(url, newRole).pipe(
      catchError(this.handleError),
      tap()
    )
  }


  editRole(role: any): Observable<any> {
    const url = `${config.URL_BACKEND}/roles/${role.id}`;
    return this.http.put(url, role).pipe(
      catchError(this.handleError),
      tap()
    )
  }

  deleteRole(role: any): Observable<any> {
    const url = `${config.URL_BACKEND}/roles/${role.id}`;
    return this.http.delete(url).pipe(
      catchError(this.handleError),
      tap()
    )
  }



  //-- CRUD Modules
  getAllModulesNg() {
    const url = `${config.URL_BACKEND}/modules`;
    return new ServerDataSource(this.http, { endPoint: url });
  }

  createModule(newModule: any): Observable<any> {
    const url = `${config.URL_BACKEND}/modules`;
    return this.http.post(url, newModule).pipe(
      catchError(this.handleError),
      tap()
    )
  }


  editModule(module: any): Observable<any> {
    const url = `${config.URL_BACKEND}/modules/${module.id}`;
    return this.http.put(url, module).pipe(
      catchError(this.handleError),
      tap()
    )
  }

  deleteModule(role: any): Observable<any> {
    const url = `${config.URL_BACKEND}/modules/${role.id}`;
    return this.http.delete(url).pipe(
      catchError(this.handleError),
      tap()
    )
  }


  // --- Lista todas as permissões de uma role
  getRolesOfModule(id): Observable<Role[]> {

    const url = `${config.URL_BACKEND}/modules/getRoles/${id}`;
    return this.http.get(url).pipe(
      catchError(this.handleError),
      map(this.jsonDataToRoles)
    )
  }


  //-- Sincrinizar as permissões de uma role
  syncRolesInModule(role:any):Observable<any>{
    const url = `${config.URL_BACKEND}/modules/sync-role`;

    return this.http.post(url, role).pipe(
      catchError(this.handleError),
      tap()
    );

  }

  //-----




  private jsonDataToPermissions(jsonData: any): Permission[] {
    const permissionList: Permission[] = [];

    jsonData.forEach(element => { const permission = Object.assign(new Permission(), element); permissionList.push(permission) });
    
    return permissionList;
  }

  
  private jsonDataToRoles(jsonData: any): Role[] {
    const roleList: Role[] = [];

    //console.log(jsonData);

    jsonData.forEach(element => { const role = Object.assign(new Role(), element); roleList.push(role) });
    
    return roleList;
  }


  



  private jsonDataToRecadastramento(jsonData: any) {
    return jsonData;
  }

  private handleError(error: any): Observable<any> {
  //  console.log("ERRO NA REQUISIÇÃO => ", error);
    return throwError(error);
  }
}
