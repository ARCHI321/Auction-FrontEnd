import { Component } from '@angular/core';
import { AuctionService } from '../../../shared/services/auction.service';
import { response } from 'express';
import { error } from 'console';

@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrl: './transaction-history.component.scss'
})
export class TransactionHistoryComponent {

  constructor(private auctionService:AuctionService){

    const userId = sessionStorage.getItem('username') ? sessionStorage.getItem('username') : '';
    this.auctionService.getAllTransactionsByUserId(userId!).subscribe(
      (response:any)=>{
        console.log(response);

      },
      (error:any)=>{
        console.log(error);

      }

    )
  }

}
