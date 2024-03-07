import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PaymentService } from '../../../shared/services/payment.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { response } from 'express';
import { error } from 'console';
import { ToastMessageService } from '../../../shared/services/toast-message.service';
import { AuctionService } from '../../../shared/services/auction.service';
// import Razorpay from 'razorpay';

declare var Razorpay: any;

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss',
})
export class PaymentComponent {
  amount: number = 100;
  auctionId: string = '';
  userId: string = '';
  userName: string = '';
  isRegistry: boolean;
  subscriptions: Subscription[] = [];
  orderId!:string;

  constructor(
    private service: PaymentService,
    private router: Router,
    private authService: AuthService,
    private toastMessageService: ToastMessageService,
    private auctionService:AuctionService,
    private paymentService:PaymentService
  ) {
    const state = this.router.getCurrentNavigation()?.extras.state;
    this.auctionId = state?.['auctionId'];
    this.userId = state?.['userId'];
    this.amount = state?.['amount'];
    this.isRegistry = state?.['isRegistry'];

    this.subscriptions.push(this.authService.getUserById(this.userId).subscribe(
      (response: any) => {
        this.userName = response.name;
      },
      (error: any) => {
        console.log(error);
      }
    ));
  }

  submitForm(userForm: NgForm) {
    console.log(userForm);

    this.subscriptions.push(this.service
      .save(this.amount, this.userId, this.auctionId, this.isRegistry)
      .pipe(
        catchError((error) => {
          console.error('Error during save:', error);
          return throwError(() => new Error('Something went wrong'));
        })
      )
      .subscribe({
        next: (res) => {
          console.log(res);

          this.openTransactionModal(res);
        },
        error: (err) => {
          console.error('Transaction failed:', err);
        },
      }));
  }

  openTransactionModal(response: any) {

    this.orderId = response.orderId;
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
          this.paymentService.setStatus(this.userId,this.auctionId,this.orderId,true).subscribe(
            (response:any)=>{
              console.log(response);

            },
            (error:any)=>{
              console.log(error);

            }
          )
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
    this.paymentService.setStatus(this.userId,this.auctionId,this.orderId,false).subscribe(
      (response:any)=>{
        console.log(response);
        this.router.navigate(['/bid-home-page']);
      },
      (error:any)=>{
        console.log(error);

      }
    )

  }

  ngOnDestroy(){
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }
}
