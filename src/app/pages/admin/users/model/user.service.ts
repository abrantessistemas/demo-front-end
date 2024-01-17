import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataContract } from 'src/app/common/data-contract.model';
import { environment } from 'src/environments/environment';
import { UserModel } from './user.model';
import { Auth2Service } from 'src/app/auth/auth2.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = environment.usersUrl;

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

  findById(id: number): Observable<UserModel> {
    return this.http.get<UserModel>(`${this.apiUrl}/${id}`, this.createHttpOptions()).pipe(
      map((response: UserModel) => response)
    );
  }

  create(user: UserModel): Observable<UserModel> {
    return this.http.post<UserModel>(`${this.apiUrl}`, user, this.createHttpOptions()).pipe(
      map((response: UserModel) => response)
    );
  }

  update(id: number, user: UserModel): Observable<UserModel> {
    return this.http.put<UserModel>(`${this.apiUrl}/${id}`, user, this.createHttpOptions()).pipe(
      map((response: UserModel) => response)
    );
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, this.createHttpOptions()).pipe(
      map((response: any) => response)
    );
  }
}
