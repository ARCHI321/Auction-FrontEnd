import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class BasicAuthHttpInterceptorService {

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {

    const username = sessionStorage.getItem('username');
    const token = sessionStorage.getItem('token')?.split(' ')[1];


if (username && token) {
  // Check if token is not null or empty
  if (token.trim() !== '') {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}` // Prefix token with "Bearer"
      }
    });


  }
}

    return next.handle(req);

  }
}
