import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

import { config } from '../../../app.conf';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ServerDataSource } from 'ng2-smart-table';

import { Deficiencia } from '../../beneficiarios/shared/deficiencia.model';

@Injectable({
  providedIn: 'root'
})

export class DeficienciaService {

  constructor(private http: HttpClient) { }


  getAll():Observable<Deficiencia[]> {
    
    const url = `${config.URL_BACKEND}/deficiencias`;

    return this.http.get(url).pipe(
      catchError(this.handleError),
      map(this.jsonDataToDeficiencias)
    );

  }

  getAllNg() {
    const url = `${config.URL_BACKEND}/deficiencias`;
    return new ServerDataSource(this.http, { endPoint: url });
  }

  //--- Crud 
  create(newDeficiencia: any): Observable<any> {
    const url = `${config.URL_BACKEND}/deficiencias`;
    return this.http.post(url, newDeficiencia).pipe(
      catchError(this.handleError),
      tap()
    )
  }


  edit(deficiencia: any): Observable<any> {
    const url = `${config.URL_BACKEND}/deficiencias/${deficiencia.id}`;
    return this.http.put(url, deficiencia).pipe(
      catchError(this.handleError),
      tap()
    )
  }

  delete(deficiencia: any): Observable<any> {
    const url = `${config.URL_BACKEND}/deficiencias/${deficiencia.id}`;
    return this.http.delete(url).pipe(
      catchError(this.handleError),
      tap()
    )
  }

  //-----



  private jsonDataToDeficiencias(jsonData: any): Deficiencia[] {
    const list: Deficiencia[] = [];

    jsonData.forEach(element => { const deficiencia = Object.assign(new Deficiencia(), element); list.push(deficiencia) });
    
    return list;
  }



  private handleError(error: any): Observable<any> {
  //  console.log("ERRO NA REQUISIÇÃO => ", error);
    return throwError(error);
  }
}
