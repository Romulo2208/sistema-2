import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { map, catchError, tap } from "rxjs/operators";

import {config} from '../../../app.conf';
import { ServerDataSource } from 'ng2-smart-table';
import { Deficiencia } from './deficiencia.model';
import { Beneficiario } from './beneficiario.model';
import { Endereco } from './endereco.model';




@Injectable({
  providedIn: 'root'
})
export class BeneficiarioService {

  
  constructor(private http: HttpClient) { }


  getAllBeneficiarioNg(){
    const url = `${config.URL_BACKEND}/beneficiarios`;
    return new ServerDataSource(this.http, { endPoint: url });
  }

  getAllBeneficiarioInativo(){
    const url = `${config.URL_BACKEND}/beneficiarios?ativo_like=false`;
    return new ServerDataSource(this.http, { endPoint: url });
  }


  getAllDeficiencia():Observable<Deficiencia[]>{
    const url = `${config.URL_BACKEND}/deficiencias`;
    return this.http.get(url).pipe(
      catchError(this.handleError),
      map(this.jsonDataToDeficiencias)
    )
  }


  getTotalBeneficiarios(){
    const url = `${config.URL_BACKEND}/dashboard/beneficiarios`;
    return this.http.get(url).pipe(
      catchError(this.handleError)
    );
  }

  getTotalBeneficiariosAcesso(){
    const url = `${config.URL_BACKEND}/dashboard/beneficiarios-acesso`;
    return this.http.get(url).pipe(
      catchError(this.handleError)
    );
  }


  get(p_id: number): Observable<Beneficiario> {
    const url = `${config.URL_BACKEND}/beneficiarios/${p_id}`;
    return this.http.get(url).pipe(
      map(this.jsonDataToBeneficiario),
      catchError(this.handleError),
      
    )
  }

  getDocs(cpf: number): Observable<Beneficiario> {
    const url = `${config.URL_BACKEND}/beneficiarios/getFiles/${cpf}`;
    return this.http.get(url).pipe(
      catchError(this.handleError),
      tap()
    )
  }

  buscaUsuario(id: number): Observable<any> {
    const url = `${config.URL_BACKEND}/beneficiarios/${id}`;
    return this.http.get(url).pipe(
      catchError(this.handleError),
      tap()
    )
  }

  getAllRegiao(){

    const url = `${config.URL_BACKEND}/regioes`;

    return this.http.get(url).pipe(
      catchError(this.handleError),
      tap()
    )
      
  }

  

  getUFByRegiao(p_regiao:string){

    const url = `${config.URL_BACKEND}/ufs?regiao=${p_regiao}`;

    return this.http.get(url).pipe(
      catchError(this.handleError),
      tap()
    )
      
  }

  createBeneficiario(beneficiario: Beneficiario): Observable<any> {
    const url = `${config.URL_BACKEND}/beneficiarios`;    
    return this.http.post(url, beneficiario).pipe(
      catchError(this.handleError),
      tap()
    )
  }



  buscaCep(cep: number): Observable<any> {
    const url = `https://viacep.com.br/ws/${cep}/json/`;
    return this.http.get(url).pipe(
      catchError(this.handleError),
      tap()
    )
  }


  updateBeneficiario(beneficiario: Beneficiario): Observable<any> {
    const url = `${config.URL_BACKEND}/beneficiarios/${beneficiario.id}`;
    return this.http.put(url, beneficiario).pipe(
      catchError(this.handleError),
      tap()
    )
  }

  updateEndereco(beneficiario: Beneficiario): Observable<any> {
    const url = `${config.URL_BACKEND}/beneficiarios/${beneficiario.id}/endereco`;
    return this.http.put(url, beneficiario.endereco).pipe(
      catchError(this.handleError),
      tap()
    )
  }

  updateUniforme(beneficiario: Beneficiario): Observable<any> {
    const url = `${config.URL_BACKEND}/beneficiarios/${beneficiario.id}/uniforme`;
    return this.http.put(url, beneficiario.uniforme).pipe(
      catchError(this.handleError),
      tap()
    )
  }

  
  deleteBeneficiario(p_id_beneficiario: number): Observable<any> {
    const url = `${config.URL_BACKEND}/beneficiarios/${p_id_beneficiario}`;
    return this.http.delete(url).pipe(
      catchError(this.handleError),
      tap()
    )
  }

  desativarBeneficiario(p_id_beneficiario: number,justificativa:string='Motivo padrão'): Observable<any> {
    const url = `${config.URL_BACKEND}/beneficiarios/desativar/${p_id_beneficiario}`;
    return this.http.patch(url, {id:p_id_beneficiario,justificativa:justificativa}).pipe(
      catchError(this.handleError),
      tap()
    )
  }

  desativarBathBeneficiario(beneficiarios_id: Array<number> ,justificativa:string='Motivo padrão'): Observable<any> {
    const url = `${config.URL_BACKEND}/beneficiarios/desativarBath`;
    return this.http.patch(url, {ids:beneficiarios_id,justificativa:justificativa}).pipe(
      catchError(this.handleError),
      tap()
    )
  }

  reativarBeneficiario(p_id_beneficiario: number): Observable<any> {
    const url = `${config.URL_BACKEND}/beneficiarios/reativar/${p_id_beneficiario}`;
    return this.http.patch(url, p_id_beneficiario).pipe(
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

  downloadDoc(userID, tipo, arquivo): Observable<any> {
    const url = `${config.URL_BACKEND}/beneficiarios/downloadFile/${tipo}/${userID}/${arquivo}`;
    return this.http.get(url, {
      responseType: 'blob'
    });
  }




  uploadAvatar(documentos: File, beneficiario_id:number): Observable<HttpEvent<any>> {

    const formData: FormData = new FormData();
    formData.set('beneficiario_id', ''+beneficiario_id);
    formData.append('file', documentos);

    const url = `${config.URL_BACKEND}/beneficiarios/upload-avatar`;

    const req = new HttpRequest('POST', url, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

  upload(documentos: File, monitor_id:number, tipo:string): Observable<HttpEvent<any>> {

    const formData: FormData = new FormData();
    formData.set('beneficiario_id', ''+monitor_id);
    formData.set('tipo', ''+tipo);
    formData.append('file', documentos);

    const url = `${config.URL_BACKEND}/beneficiarios/upload-file`;

    const req = new HttpRequest('POST', url, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

  
  getAvatar(beneficiario_id:number): Observable<Blob> {
    const url = `${config.URL_BACKEND}/beneficiarios/getAvatar/${beneficiario_id}`;
    return this.http.get(url, {
      responseType: 'blob'
    });
  }


  private jsonDataToBeneficiario(jsonData: any): Beneficiario {
    
      //map do beneficiário
      const beneficiario = Object.assign(new Beneficiario(), jsonData);

      return beneficiario;
  }


  private jsonDataToBeneficiarios(jsonData: any): Beneficiario[] {
    
    const list: Beneficiario[] = [];
   
    jsonData.forEach(element => {
      const beneficiario = Object.assign(new Beneficiario(), element);
      list.push(beneficiario) 
    });

    return list;
  }


  private jsonDataToDeficiencias(jsonData: any): Deficiencia[] {
    
    const list: Deficiencia[] = [];
   
    jsonData.forEach(element => {
      const deficiencia = Object.assign(new Deficiencia(), element);
      list.push(deficiencia) 
    });

    return list;
  }

  
  private handleError(error: any): Observable<any> {
    console.log("ERRO NA REQUISIÇÃO => ", error);
    return throwError(error);
  }




}
