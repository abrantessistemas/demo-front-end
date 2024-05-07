import { HttpClient, HttpHeaders } from '@angular/common/http'; //39.-Importo el HttpClient para conectar con el RestContoller del Backend
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

interface body {

}

@Injectable({
  providedIn: 'root'
})
export class Produtos2Service {

  //39.1-Lo agrego al constructor
  constructor(private httpClient: HttpClient) { }

  registerProduto(produto: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.httpClient.post<any>(`${environment.oAuthRegisterUrl}`, produto, { headers });
  }

  produtos: any = [
    {
      id: 1,
      nome: 'placa mae',
      descricao: 'placa mae asus',
      precoCompra: 1400,
      precoRevenda: 1600,
      precoTotalEstoque:0,
      quatidadeEstoque:5,
      codigoBarras: '11',
      sku: '11',
      imageUrl: 'www',
      categorias: [
        { nome: 'Informatica' }
      ],
    }
  ]

}
