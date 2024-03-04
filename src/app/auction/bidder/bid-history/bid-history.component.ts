import { Component } from '@angular/core';
import { AuctionService } from '../../../shared/services/auction.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bid-history',
  templateUrl: './bid-history.component.html',
  styleUrl: './bid-history.component.scss'
})
export class BidHistoryComponent {
  bids: any[] = [];
  winnerId !:string;
  isLoading: boolean = true;
  auctionId!:string;

  constructor(private auctionService: AuctionService , private router: Router,) {
    const state = this.router.getCurrentNavigation()?.extras.state;
    this.auctionId = state?.['auctionId'];
   }

  ngOnInit(): void {
    this.loadBidHistory();
  }

  loadBidHistory(): void {
    this.auctionService.getBidHistory().subscribe(
      data => {
        console.log(data);

        this.bids = data;
        this.auctionService.getWinner(this.auctionId).subscribe(
          (response:any)=>{
            console.log(response);
            this.winnerId = response;
            this.isLoading = false;
          },
          (error:any)=>{
            console.log(error);

          }
        )



      },
      error => {
        console.log(error);
      }
    );
  }

  truncateAll(){
    this.auctionService.truncateBidsTable().subscribe(
      (response:any)=>{
        console.log(response);

      },
      (error:any)=>{
        console.log(error);

      }
    )

  }


}
