import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  constructor(private httpClient: HttpClient) {}
  api = 'http://localhost:8080';
  public save(amount: number): Observable<any> {
    return this.httpClient.get(
      `${this.api}/payment/createTransaction/` + amount
    );
  }
}
