import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataContract } from 'src/app/common/data-contract.model';
import { environment } from 'src/environments/environment';
import { ClienteModel } from './cliente.model';
import { Auth2Service } from 'src/app/auth/auth2.service';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private apiUrl = environment.clientesUrl;

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

  findById(id: number): Observable<ClienteModel> {
    return this.http.get<ClienteModel>(`${this.apiUrl}/${id}`, this.createHttpOptions()).pipe(
      map((response: ClienteModel) => response)
    );
  }

  create(cliente: ClienteModel): Observable<ClienteModel> {
    return this.http.post<ClienteModel>(`${this.apiUrl}`, cliente, this.createHttpOptions()).pipe(
      map((response: ClienteModel) => response)
    );
  }

  update(id: number, cliente: ClienteModel): Observable<ClienteModel> {
    return this.http.put<ClienteModel>(`${this.apiUrl}/${id}`, cliente, this.createHttpOptions()).pipe(
      map((response: ClienteModel) => response)
    );
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, this.createHttpOptions()).pipe(
      map((response: any) => response)
    );
  }
}
