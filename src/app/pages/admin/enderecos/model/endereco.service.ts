import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataContract } from 'src/app/common/data-contract.model';
import { environment } from 'src/environments/environment';
import { EnderecoModel } from './endereco.model';
import { Auth2Service } from 'src/app/auth/auth2.service';

@Injectable({
  providedIn: 'root'
})
export class EnderecoService {

  private apiUrl = environment.enderecosUrl;

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

  findById(id: number): Observable<EnderecoModel> {
    return this.http.get<EnderecoModel>(`${this.apiUrl}/${id}`, this.createHttpOptions()).pipe(
      map((response: EnderecoModel) => response)
    );
  }

  create(endereco: EnderecoModel): Observable<EnderecoModel> {
    return this.http.post<EnderecoModel>(`${this.apiUrl}`, endereco, this.createHttpOptions()).pipe(
      map((response: EnderecoModel) => response)
    );
  }

  update(id: number, endereco: EnderecoModel): Observable<EnderecoModel> {
    return this.http.put<EnderecoModel>(`${this.apiUrl}/${id}`, endereco, this.createHttpOptions()).pipe(
      map((response: EnderecoModel) => response)
    );
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, this.createHttpOptions()).pipe(
      map((response: any) => response)
    );
  }
}
