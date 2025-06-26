import { Injectable } from "@angular/core";
import { HttpClient, HttpEvent, HttpParams, HttpRequest } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { map, catchError, tap } from "rxjs/operators";
import { config } from "../../../app.conf";
import { ServerDataSource } from "ng2-smart-table";

@Injectable({
  providedIn: "root",
})
export class RelatorioService {
  constructor(private http: HttpClient) {}

  getAllBeneficiarioNg() {
    const url = `${config.URL_BACKEND}/beneficiarios`;
    return new ServerDataSource(this.http, { endPoint: url });
  }

  getDiaTurnos(): Observable<any[]> {
    const url = `${config.URL_BACKEND}/diaTurno`;
    return this.http.get<any[]>(url).pipe(catchError(this.handleError), tap());
  }

  getBeneficiariosByFilter(queryString){
    const url = `${config.URL_BACKEND}/beneficiarios`;
    const params = new HttpParams({ fromString: queryString });
    return this.http.get<any[]>(url,{params}).pipe(catchError(this.handleError), tap());
  }

  getTotalBeneficiarios(queryString) {
    const url = `${config.URL_BACKEND}/beneficiarios`;
    const params = new HttpParams({ fromString: queryString });
    return this.http
      .get<any[]>(url, { params, observe: 'response' })
      .pipe(
        map((resp) => {
          const total = resp.headers.get('X-Total-Count');
          return Number(total);
        }),
        catchError(this.handleError)
      );
  }

  private handleError(error: any): Observable<any> {
    console.log("ERRO NA REQUISIÇÃO => ", error);
    return throwError(error);
  }
}
