import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataContract } from 'src/app/common/data-contract.model';
import { environment } from 'src/environments/environment';
import { EstoqueModel } from './estoque.model';
import { Auth2Service } from 'src/app/auth/auth2.service';

@Injectable({
  providedIn: 'root'
})
export class EstoqueService {

  private apiUrl = environment.estoquesUrl;

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

  findById(id: number): Observable<EstoqueModel> {
    return this.http.get<EstoqueModel>(`${this.apiUrl}/${id}`, this.createHttpOptions()).pipe(
      map((response: EstoqueModel) => response)
    );
  }

  create(estoque: EstoqueModel): Observable<EstoqueModel> {
    return this.http.post<EstoqueModel>(`${this.apiUrl}`, estoque, this.createHttpOptions()).pipe(
      map((response: EstoqueModel) => response)
    );
  }

  update(id: number, estoque: EstoqueModel): Observable<EstoqueModel> {
    return this.http.put<EstoqueModel>(`${this.apiUrl}/${id}`, estoque, this.createHttpOptions()).pipe(
      map((response: EstoqueModel) => response)
    );
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, this.createHttpOptions()).pipe(
      map((response: any) => response)
    );
  }
}
