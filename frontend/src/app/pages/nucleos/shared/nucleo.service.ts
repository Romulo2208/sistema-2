import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { map, catchError, tap } from "rxjs/operators";

import {config} from '../../../app.conf';
import { ServerDataSource } from 'ng2-smart-table';
import { Municipio } from './municipio.model';
import { Nucleo } from './nucleo.model';



@Injectable({
  providedIn: 'root'
})
export class NucleoService {

  
  constructor(private http: HttpClient) { }


  getAllNucleoNg(){
    const url = `${config.URL_BACKEND}/nucleos`;
    return new ServerDataSource(this.http, { endPoint: url });
  }


  getAllNucleo(): Observable<Nucleo[]> {
    const url = `${config.URL_BACKEND}/nucleos?_limit=1000000000000000`;
    return this.http.get(url).pipe(
      catchError(this.handleError),
      map(this.jsonDataToNucleos)
    );
  }

  getAllNucleoQueryString(queryString:string): Observable<Nucleo[]> {
    const url = `${config.URL_BACKEND}/${queryString}`;
    return this.http.get(url).pipe(
      catchError(this.handleError),
      map(this.jsonDataToNucleos)
    );
  }


  get(p_id: number): Observable<any> {
    const url = `${config.URL_BACKEND}/nucleos/${p_id}`;
    return this.http.get(url).pipe(
      catchError(this.handleError),
      map(this.jsonDataToNucleo)
    )
  }

  
  getAllRegiao(){

    const url = `${config.URL_BACKEND}/regioes`;

    return this.http.get(url).pipe(
      catchError(this.handleError),
      tap()
    )
      
  }


  getAllComars(){

    const url = `${config.URL_BACKEND}/comars`;

    return this.http.get(url).pipe(
      catchError(this.handleError),
      tap()
    )
      
  }

  getTotalNucleos(){
    const url = `${config.URL_BACKEND}/dashboard/nucleos`;
    return this.http.get(url).pipe(
      catchError(this.handleError)
    );
  }
  

  getUFByRegiao(p_regiao:string){

    const url = `${config.URL_BACKEND}/ufs?regiao=${p_regiao}`;

    return this.http.get(url).pipe(
      catchError(this.handleError),
      tap()
    )
      
  }



  getMunicipioByUF(p_uf:string){

    const url = `${config.URL_BACKEND}/municipios?uf=${p_uf}`;

    return this.http.get(url).pipe(
      catchError(this.handleError),
      map(this.jsonDataToMunicipios)
    )
      
  }



  getAllDiasSemana():Observable<any[]>{
    const url = `${config.URL_BACKEND}/dias?_limit=1000000000000000`;
    return this.http.get(url).pipe(
      catchError(this.handleError),
      tap()
    );
  }

  getAllTurnos():Observable<any[]>{
    const url = `${config.URL_BACKEND}/turnos?_limit=1000000000000000`;
    return this.http.get(url).pipe(
      catchError(this.handleError),
      tap()
    );
  }

  getAllDiaTurnos():Observable<any[]>{
    const url = `${config.URL_BACKEND}/diaTurno?_limit=1000000000000000`;
    return this.http.get(url).pipe(
      catchError(this.handleError),
      tap()
    );
  }


  





  createNucleo(municipio: Municipio): Observable<any> {
    const url = `${config.URL_BACKEND}/nucleos`;
    return this.http.post(url, municipio).pipe(
      catchError(this.handleError),
      tap()
    )
  }


  updateNucleo(nucleo: Nucleo): Observable<any> {
    const url = `${config.URL_BACKEND}/nucleos/${nucleo.id}`;
    return this.http.put(url, nucleo).pipe(
      catchError(this.handleError),
      tap()
    )
  }


  deleteNucleo(p_id_municipio: number): Observable<any> {
    const url = `${config.URL_BACKEND}/nucleos/${p_id_municipio}`;
    return this.http.delete(url).pipe(
      catchError(this.handleError),
      tap()
    )
  }


  private jsonDataToNucleo(jsonData: any): Nucleo {
      const data= jsonData;
      return data as Nucleo;
  }


  private jsonDataToNucleos(jsonData: any): Nucleo[] {
    
    const list: Nucleo[] = [];
   
    jsonData.forEach(element => {
      const data = element;
      data.dias_turnos = (element.dias_turnos)? JSON.parse(element.dias_turnos):null;

      const nucleo = Object.assign(new Nucleo(), data);
      list.push(nucleo) 
    });

    return list;
  }

  
  private jsonDataToMunicipios(jsonData: any): Municipio[] {
    
    const list: Municipio[] = [];
   
    jsonData.forEach(element => {
      const municipio = Object.assign(new Municipio(), element);
      list.push(municipio) 
    });

    return list;
  }




  
  private handleError(error: any): Observable<any> {
    console.log("ERRO NA REQUISIÇÃO => ", error);
    return throwError(error);
  }




}
