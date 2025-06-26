import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { config } from 'src/app/app.conf';
import { Escola } from './escola.model';

@Injectable({
  providedIn: 'root'
})
export class EscolaService {

  constructor(private http: HttpClient) { }


  getAllEscola(): Observable<Escola[]>{
    const url = `${config.URL_BACKEND}/escolas`;
    const escolas = this.http.get(url).pipe(
      catchError(this.handleError), 
      tap());
    return escolas
  }

  getQueryStringEscolas(query): Observable<Escola[]>{
    const url = `${config.URL_BACKEND}/escolas?${query}`;
    const escolas = this.http.get(url).pipe(
      catchError(this.handleError), 
      tap());
    return escolas
  }

  create(escola: Escola): Observable<Escola>{
    const url = `${config.URL_BACKEND}/escolas`;
    
    return this.http.post(url, escola).pipe(
      catchError(this.handleError),
      tap()
    );
  }



  
  private handleError(error: any): Observable<any> {
    console.log("ERRO NA REQUISIÇÃO => ", error);
    return throwError(error);
  }
}
