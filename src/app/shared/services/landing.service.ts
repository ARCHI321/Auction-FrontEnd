import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LandingService {

  baseUrl = "http://localhost:8080"

  constructor(private http: HttpClient) { }

  getTop5UpcomingAuctions() {
    return this.http.get<any>(`${this.baseUrl}/anonymous/upcoming-auctions`)
      .pipe(
        catchError((error: any) => {
          console.error('Error in getTop5UpcomingAuctions:', error);
          throw error;
        })
      );
  }
}
