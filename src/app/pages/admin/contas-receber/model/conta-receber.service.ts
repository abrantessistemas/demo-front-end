import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataContract } from 'src/app/common/data-contract.model';
import { environment } from 'src/environments/environment';
import { ContaReceberModel } from './conta-receber.model';
import { Auth2Service } from 'src/app/auth/auth2.service';

@Injectable({
  providedIn: 'root'
})
export class ContaReceberService {

  private apiUrl = environment.contasReceberUrl;

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

  findById(id: number): Observable<ContaReceberModel> {
    return this.http.get<ContaReceberModel>(`${this.apiUrl}/${id}`, this.createHttpOptions()).pipe(
      map((response: ContaReceberModel) => response)
    );
  }

  create(contaReceber: ContaReceberModel): Observable<ContaReceberModel> {
    return this.http.post<ContaReceberModel>(`${this.apiUrl}`, contaReceber, this.createHttpOptions()).pipe(
      map((response: ContaReceberModel) => response)
    );
  }

  update(id: number, contaReceber: ContaReceberModel): Observable<ContaReceberModel> {
    return this.http.put<ContaReceberModel>(`${this.apiUrl}/${id}`, contaReceber, this.createHttpOptions()).pipe(
      map((response: ContaReceberModel) => response)
    );
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, this.createHttpOptions()).pipe(
      map((response: any) => response)
    );
  }
}
