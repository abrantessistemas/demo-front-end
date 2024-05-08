import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataContract } from 'src/app/common/data-contract.model';
import { environment } from 'src/environments/environment';
import { PedidoModel } from './pedido.model';
import { Auth2Service } from 'src/app/auth/auth2.service';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  private apiUrl = environment.pedidosUrl;

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

  findById(id: number): Observable<PedidoModel> {
    return this.http.get<PedidoModel>(`${this.apiUrl}/${id}`, this.createHttpOptions()).pipe(
      map((response: PedidoModel) => response)
    );
  }

  create(pedido: PedidoModel): Observable<PedidoModel> {
    return this.http.post<PedidoModel>(`${this.apiUrl}`, pedido, this.createHttpOptions()).pipe(
      map((response: PedidoModel) => response)
    );
  }

  update(id: number, pedido: PedidoModel): Observable<PedidoModel> {
    return this.http.put<PedidoModel>(`${this.apiUrl}/${id}`, pedido, this.createHttpOptions()).pipe(
      map((response: PedidoModel) => response)
    );
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, this.createHttpOptions()).pipe(
      map((response: any) => response)
    );
  }
}
