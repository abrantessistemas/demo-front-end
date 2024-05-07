import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataContract } from 'src/app/common/data-contract.model';
import { environment } from 'src/environments/environment';
import { ProdutoModel } from './produto.model';
import { Auth2Service } from 'src/app/auth/auth2.service';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {
  private apiUrl = environment.produtosUrl;

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

  findById(id: number): Observable<ProdutoModel> {
    return this.http.get<ProdutoModel>(`${this.apiUrl}/${id}`, this.createHttpOptions()).pipe(
      map((response: ProdutoModel) => response)
    );
  }

  create(produto: ProdutoModel): Observable<ProdutoModel> {
    return this.http.post<ProdutoModel>(`${this.apiUrl}`, produto, this.createHttpOptions()).pipe(
      map((response: ProdutoModel) => response)
    );
  }

  update(id: number, produto: ProdutoModel): Observable<ProdutoModel> {
    return this.http.put<ProdutoModel>(`${this.apiUrl}/${id}`, produto, this.createHttpOptions()).pipe(
      map((response: ProdutoModel) => response)
    );
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, this.createHttpOptions()).pipe(
      map((response: any) => response)
    );
  }

  getNextId(): Observable<number> {
    return this.http.get<number>(this.apiUrl, this.createHttpOptions()).pipe(
      map((response: number) => response)
    );
  }
}
