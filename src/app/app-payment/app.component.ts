import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AppService } from './app.service';
import { Observable } from 'rxjs';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
// import Razorpay from 'razorpay';

declare var Razorpay: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  amount: number = 100;
  constructor(private service: AppService) {}

  submitForm(userForm: NgForm) {
    this.service
      .save(this.amount)
      .pipe(
        catchError((error) => {
          console.error('Error during save:', error);
          return throwError(() => new Error('Something went wrong'));
        })
      )
      .subscribe({
        next: (res) => {
          this.openTransactionModal(res);
        },
        error: (err) => {
          console.error('Transaction failed:', err);
        },
      });
  }

  openTransactionModal(response: any) {
    var options = {
      order_id: response.orderId,
      key: response.key,
      amount: response.amount,
      currency: response.currency,
      name: 'BidXChange',
      description: 'Payment of Online Biding',
      image:
        'https://cdn.pixabay.com/photo/2024/02/23/08/27/apple-8591539_640.jpg',
      handler: (response: any) => {
        if (response != null && response.razorpay_payment_id != null) {
          this.processResponse(response);
          alert('Payment received');
        } else {
          alert('Payment Failed ...');
        }
        this.processResponse(response);
      },
      prefill: {
        name: 'Google',
        email: 'google@gmail.com',
        contact: '90909090',
      },
      notes: {
        address: 'Online Bidding',
      },
      theme: {
        color: '#F37254',
      },
    };
    var razorPayObject = new Razorpay(options);
    razorPayObject.open();
  }

  processResponse(resp: any) {
    console.log(resp);
  }
}
