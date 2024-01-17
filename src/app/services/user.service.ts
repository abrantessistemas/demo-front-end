import { HttpClient, HttpHeaders } from '@angular/common/http'; //39.-Importo el HttpClient para conectar con el RestContoller del Backend
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

interface body {

}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  //39.1-Lo agrego al constructor
  constructor(private httpClient: HttpClient) { }

  registerUser(user: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.httpClient.post<any>(`${environment.oAuthRegisterUrl}`, user, { headers });
  }

  //40.- Creamos metodo
  //public anadirUsuario(user: any) {
  //  const httpOptions = {
  //    headers: new HttpHeaders({
  //      'Content-Type': 'application/json',
  //      'grant_type': 'password',
  //      'client': environment.clientId,
  //      'client_secret': environment.clientSecret
  //    })
  //  };
  //  return this.httpClient.post<any>(`${environment.oAuthRegisterUrl}`, user, httpOptions);
  //}
  //41.- Nos vamos a signup.component.ts

}
