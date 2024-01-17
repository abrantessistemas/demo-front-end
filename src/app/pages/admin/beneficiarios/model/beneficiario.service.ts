import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataContract } from 'src/app/common/data-contract.model';
import { environment } from 'src/environments/environment';
import { Auth2Service } from 'src/app/auth/auth2.service';
import { BeneficiarioModel } from './beneficiario.model';

@Injectable({
  providedIn: 'root'
})
export class BeneficiarioService {

  private apiUrl = environment.beneficiariosUrl;

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

  findById(id: number): Observable<BeneficiarioModel> {
    return this.http.get<BeneficiarioModel>(`${this.apiUrl}/${id}`, this.createHttpOptions()).pipe(
      map((response: BeneficiarioModel) => response)
    );
  }

  create(beneficiario: BeneficiarioModel): Observable<BeneficiarioModel> {
    return this.http.post<BeneficiarioModel>(`${this.apiUrl}`, beneficiario, this.createHttpOptions()).pipe(
      map((response: BeneficiarioModel) => response)
    );
  }

  update(id: number, beneficiario: BeneficiarioModel): Observable<BeneficiarioModel> {
    return this.http.put<BeneficiarioModel>(`${this.apiUrl}/${id}`, beneficiario, this.createHttpOptions()).pipe(
      map((response: BeneficiarioModel) => response)
    );
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, this.createHttpOptions()).pipe(
      map((response: any) => response)
    );
  }
}
