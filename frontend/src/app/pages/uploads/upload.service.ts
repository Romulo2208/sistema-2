import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { config } from '../../app.conf';

export interface FileInfo {
  id: number; 
  name: string;
  url: string;
  path: string;
  mime_type?: string;
  size?: number;
  created_at?: string;
  status?: string;
  nucleo_id?: number;
  nucleo_nome?: string;
}

@Injectable({ providedIn: 'root' })
export class UploadService {
  private apiUrl = `${config.URL_BACKEND}`; 
  private repositories = {
    default: `${this.apiUrl}/files`,
    nucleo: `${this.apiUrl}/nucleo/files`,
  };

  constructor(private http: HttpClient) {}

  private getRepositoryUrl(repository: string = 'default'): string {
    return this.repositories[repository] || this.repositories.default;
  }

  listFiles(repository: string = 'default'): Observable<FileInfo[]> {
    return this.http.get<FileInfo[]>(`${this.getRepositoryUrl(repository)}`).pipe(
      catchError(this.handleError)
    );
  }

  uploadFile(file: File, repository: string = 'default'): Observable<FileInfo> {
    const formData = new FormData();
    formData.append('file', file);
    const url = repository === 'nucleo' ? `${this.apiUrl}/nucleo/upload` : `${this.apiUrl}/upload`;
    return this.http.post<FileInfo>(url, formData).pipe(
        catchError(this.handleError)
    );
}

  updateFile(id: number, name: string, repository: string = 'default'): Observable<FileInfo> {
    return this.http.put<FileInfo>(`${this.getRepositoryUrl(repository)}/${id}`, { name }).pipe(
      catchError(this.handleError)
    );
  }

  deleteFile(id: number, repository: string = 'default'): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.getRepositoryUrl(repository)}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  approveFile(id: number, descricao: string = ''): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(`${this.apiUrl}/nucleo/files/${id}/approve`, { descricao }).pipe(
      catchError(this.handleError)
    );
  }

  rejectFile(id: number, descricao: string = ''): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(`${this.apiUrl}/nucleo/files/${id}/reject`, { descricao }).pipe(
      catchError(this.handleError)
    );
  }

  approveFileGeral(id: number, descricao: string = ''): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(`${this.apiUrl}/nucleo/files/${id}/approve-geral`, { descricao }).pipe(
      catchError(this.handleError)
    );
  }

  rejectFileGeral(id: number, descricao: string = ''): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(`${this.apiUrl}/nucleo/files/${id}/reject-geral`, { descricao }).pipe(
      catchError(this.handleError)
    );
  }

  getSignedUrl(path: string, repository: string = 'default'): Observable<{ url: string }> {
    const encoded = encodeURIComponent(path);
    const baseUrl = repository === 'nucleo' ? `${this.apiUrl}/nucleo/download` : `${this.getRepositoryUrl(repository)}/download`;
    return this.http.get<{ url: string }>(`${baseUrl}/${encoded}`).pipe(
      catchError(this.handleError)
    );
  }

  getUserRole(): Observable<{ role: string }> {
    return this.http.get<{ role: string }>(`${this.apiUrl}/user/role`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Erro na requisição:', error);
    let errorMessage = 'Ocorreu um erro. Tente novamente.';
    if (error.status === 0) {
      errorMessage = 'Não foi possível conectar ao servidor. Verifique sua conexão ou a URL do back-end.';
    } else if (error.error instanceof ErrorEvent) {
      errorMessage = `Erro do cliente: ${error.error.message}`;
    } else {
      errorMessage = `Erro do servidor: ${error.status} - ${error.error.message || error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}