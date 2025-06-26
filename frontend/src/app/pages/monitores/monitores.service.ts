import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from "rxjs";
import { map, catchError, tap } from "rxjs/operators";

import {config} from '../../app.conf';
import { ServerDataSource } from 'ng2-smart-table';

@Injectable({
  providedIn: 'root'
})
export class MonitoresService {

  constructor(private http: HttpClient) { }


  getAllMonitoresNg(){
    const url = `${config.URL_BACKEND}/monitors`;
    return new ServerDataSource(this.http, { endPoint: url });
  }


  get(p_id: number): Observable<any> {
    const url = `${config.URL_BACKEND}/monitors/${p_id}`;
    return this.http.get(url).pipe(
      catchError(this.handleError),
      tap()
    )
  }

  createMonitor(monitor: any): Observable<any> {
    const url = `${config.URL_BACKEND}/monitors`;   
    return this.http.post(url, monitor).pipe(
      catchError(this.handleError),
      tap()
    )
  }


  deleteMonitor(p_id: number): Observable<any> {
    const url = `${config.URL_BACKEND}/monitors/${p_id}`;
    return this.http.delete(url).pipe(
      catchError(this.handleError),
      tap()
    )
  }

  deleteBath(monitors_ids: Array<Number>): Observable<any> {
    const url =  `${config.URL_BACKEND}/monitors_bath`;
    return this.http.request('delete',url,{body:monitors_ids}).pipe(
      catchError(this.handleError),
      tap()
    )
  }

  updateMonitor(monitor: any): Observable<any> {
    
    const url = `${config.URL_BACKEND}/monitors/${monitor.id}`;   
    return this.http.put(url, monitor).pipe(
      catchError(this.handleError),
      tap()
    )
  }


  upload(documentos: File, monitor_id:number): Observable<HttpEvent<any>> {

    const formData: FormData = new FormData();
    formData.set('monitor_id', ''+monitor_id);
    formData.append('file', documentos);

    const url = `${config.URL_BACKEND}/monitors/upload-file`;

    const req = new HttpRequest('POST', url, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

  getFiles(monitor_id:number): Observable<any> {
    const url = `${config.URL_BACKEND}/monitors/getFiles/${monitor_id}`;
    return this.http.get(url).pipe(
      catchError(this.handleError),
      tap()
    )
  }


  downloadFile(file, monitor_id):Observable<Blob>{
    const url = `${config.URL_BACKEND}/monitors/downloadFile/${file}/${monitor_id}`;
    return this.http.get(url, {
      responseType: 'blob'
    });
  }

  deleteFile(file, monitor_id): Observable<any>{
    const url = `${config.URL_BACKEND}/monitors/deleteFile/${file}/${monitor_id}`;
    return this.http.get(url).pipe(
      catchError(this.handleError),
      tap()
    )
  }


  
  private handleError(error: any): Observable<any> {
    console.log("ERRO NA REQUISIÇÃO => ", error);
    return throwError(error);
  }



}
