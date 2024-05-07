import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataContract } from 'src/app/common/data-contract.model';
import { environment } from 'src/environments/environment';
import { CategoriaModel } from './categoria.model';
import { Auth2Service } from 'src/app/auth/auth2.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private apiUrl = environment.categoriasUrl;

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

  findById(id: number): Observable<CategoriaModel> {
    return this.http.get<CategoriaModel>(`${this.apiUrl}/${id}`, this.createHttpOptions()).pipe(
      map((response: CategoriaModel) => response)
    );
  }

  create(categoria: CategoriaModel): Observable<CategoriaModel> {
    return this.http.post<CategoriaModel>(`${this.apiUrl}`, categoria, this.createHttpOptions()).pipe(
      map((response: CategoriaModel) => response)
    );
  }

  update(id: number, categoria: CategoriaModel): Observable<CategoriaModel> {
    return this.http.put<CategoriaModel>(`${this.apiUrl}/${id}`, categoria, this.createHttpOptions()).pipe(
      map((response: CategoriaModel) => response)
    );
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, this.createHttpOptions()).pipe(
      map((response: any) => response)
    );
  }
}
