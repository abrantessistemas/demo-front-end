import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataContract } from 'src/app/common/data-contract.model';
import { environment } from 'src/environments/environment';
import { EmpresaModel } from './empresa.model';
import { Auth2Service } from 'src/app/auth/auth2.service';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  private apiUrl = environment.empresasUrl;

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

  findById(id: number): Observable<EmpresaModel> {
    return this.http.get<EmpresaModel>(`${this.apiUrl}/${id}`, this.createHttpOptions()).pipe(
      map((response: EmpresaModel) => response)
    );
  }

  create(empresa: EmpresaModel): Observable<EmpresaModel> {
    return this.http.post<EmpresaModel>(`${this.apiUrl}`, empresa, this.createHttpOptions()).pipe(
      map((response: EmpresaModel) => response)
    );
  }

  update(id: number, empresa: EmpresaModel): Observable<EmpresaModel> {
    return this.http.put<EmpresaModel>(`${this.apiUrl}/${id}`, empresa, this.createHttpOptions()).pipe(
      map((response: EmpresaModel) => response)
    );
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, this.createHttpOptions()).pipe(
      map((response: any) => response)
    );
  }
}
