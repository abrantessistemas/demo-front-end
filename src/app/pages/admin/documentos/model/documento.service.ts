import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Auth2Service } from 'src/app/auth/auth2.service';
import { DataContract } from 'src/app/common/data-contract.model';
import { environment } from 'src/environments/environment';
import { DocumentoModel } from './documento.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentoService {

  private apiUrl = environment.documentosUrl;

  constructor(private http: HttpClient, private authService: Auth2Service) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
  }

  private createHttpOptions(): { headers: HttpHeaders } {
    return { headers: this.getHeaders() };
  }

  findAll(): Observable<DataContract> {
    return this.http.get<DataContract>(this.apiUrl, this.createHttpOptions()).pipe(
      map((response: DataContract) => response)
    );
  }

  findAllByBeneficiario(beneficiarioId: number): Observable<DataContract> {
    return this.http.get<DataContract>(`${this.apiUrl}/beneficiario/${beneficiarioId}`, this.createHttpOptions()).pipe(
      map((response: DataContract) => response)
    );
  }

  findById(id: number): Observable<DocumentoModel> {
    return this.http.get<DocumentoModel>(`${this.apiUrl}/${id}`, this.createHttpOptions()).pipe(
      map((response: DocumentoModel) => response)
    );
  }

  create(documento: DocumentoModel): Observable<DocumentoModel> {
    return this.http.post<DocumentoModel>(`${this.apiUrl}`, documento, this.createHttpOptions()).pipe(
      map((response: DocumentoModel) => response)
    );
  }

  update(id: number, documento: DocumentoModel): Observable<DocumentoModel> {
    return this.http.put<DocumentoModel>(`${this.apiUrl}/${id}`, documento, this.createHttpOptions()).pipe(
      map((response: DocumentoModel) => response)
    );
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, this.createHttpOptions()).pipe(
      map((response: any) => response)
    );
  }
}
