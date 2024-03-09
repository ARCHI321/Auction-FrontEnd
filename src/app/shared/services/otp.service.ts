import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OtpService {

  constructor() { }

  private dataSubject = new BehaviorSubject<string>('Initial Notification');
  data$ = this.dataSubject.asObservable();

  sendData(data: string) {
    this.dataSubject.next(data);
  }

  getData() {
    return this.dataSubject.asObservable();
  }
}
