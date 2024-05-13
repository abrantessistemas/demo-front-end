import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataContract } from 'src/app/common/data-contract.model';
import { environment } from 'src/environments/environment';
import { ContaPagarModel } from './conta-pagar.model';
import { Auth2Service } from 'src/app/auth/auth2.service';

@Injectable({
  providedIn: 'root'
})
export class ContaPagarService {

  private apiUrl = environment.contasPagarUrl;

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

  findById(id: number): Observable<ContaPagarModel> {
    return this.http.get<ContaPagarModel>(`${this.apiUrl}/${id}`, this.createHttpOptions()).pipe(
      map((response: ContaPagarModel) => response)
    );
  }

  create(contaPagar: ContaPagarModel): Observable<ContaPagarModel> {
    return this.http.post<ContaPagarModel>(`${this.apiUrl}`, contaPagar, this.createHttpOptions()).pipe(
      map((response: ContaPagarModel) => response)
    );
  }

  update(id: number, contaPagar: ContaPagarModel): Observable<ContaPagarModel> {
    return this.http.put<ContaPagarModel>(`${this.apiUrl}/${id}`, contaPagar, this.createHttpOptions()).pipe(
      map((response: ContaPagarModel) => response)
    );
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, this.createHttpOptions()).pipe(
      map((response: any) => response)
    );
  }
}
