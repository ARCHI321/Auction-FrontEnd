import { Component } from '@angular/core';
import { AuctionService } from '../../../shared/services/auction.service';
import { NavigationExtras, Router } from '@angular/router';
import { error } from 'console';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-bid-history',
  templateUrl: './bid-history.component.html',
  styleUrl: './bid-history.component.scss',
})
export class BidHistoryComponent {
  bid: { auctionId: string; userId: string; bidAmount: number } = {
    auctionId: '',
    userId: '',
    bidAmount: 0,
  };
  winnerId!: string;
  isLoading: boolean = true;
  auctionId!: string;
  flag!: number;
  winnerAmount!: number;
  bids: any[] = [];
  winnerFromDbId!:string;
  subScriptions:Subscription[] = [];

  constructor(private auctionService: AuctionService, private router: Router) {
    const state = this.router.getCurrentNavigation()?.extras.state;
    this.auctionId = state?.['auctionId'];
    this.flag = state?.['flag'];
    this.winnerId = state?.['winnerId'];
    console.log("WinnerId" , this.winnerId);

  }

  ngOnInit(): void {
    this.loadBidHistory();

    setTimeout(() => {
      this.takeWinnertoPayment();
    }, 30000);
  }

  loadBidHistory(): void {
   this.subScriptions.push(this.auctionService.getBidHistory().subscribe(
      (data) => {
        console.log(data);

        this.bids = data;

        if (this.flag === 1) {
          this.subScriptions.push(this.auctionService.getWinner(this.auctionId).subscribe(
            (response: any) => {
              console.log(response);
              const inputString: string = response.message;
              const indexOfAmpersand: number = inputString.indexOf('&');
              this.winnerFromDbId = inputString.substring(0, indexOfAmpersand);
              this.winnerAmount = parseInt(
                inputString.substring(indexOfAmpersand + 1)
              );

              if (this.winnerId[0] !== this.winnerFromDbId) {
                this.bid.auctionId = this.auctionId;
                this.bid.userId = this.winnerId[0];
                this.bid.bidAmount = this.winnerAmount;
                this.bids.push(this.bid);
                this.auctionService
                  .setWinner(this.auctionId, this.winnerId[0])
                  .subscribe(
                    (response: any) => {
                      console.log(response);
                    },
                    (error: any) => {
                      console.log(error);
                    }
                  );
              }
              else{
                this.winnerId = this.winnerFromDbId;
              }

              this.isLoading = false;
            },
            (error: any) => {
              console.log(error);
            }
          ));
        } else {
         this.subScriptions.push(this.auctionService.getWinner(this.auctionId).subscribe(
            (response: any) => {
              console.log(response);
              const inputString: string = response.message;
              const indexOfAmpersand: number = inputString.indexOf('&');
              this.winnerId = inputString.substring(0, indexOfAmpersand);
              this.winnerAmount = parseInt(
                inputString.substring(indexOfAmpersand + 1)
              );

              this.isLoading = false;
            },
            (error: any) => {
              console.log(error);
            }
          ));
        }
      },
      (error) => {
        console.log(error);
      }
    ));
  }

  takeWinnertoPayment() {


    const userId = sessionStorage.getItem('username');
    console.log(this.winnerId , userId);
    if (Array.isArray(this.winnerId) && this.winnerId.length > 0 && this.winnerId[0] === userId) {
      const navigationExtras: NavigationExtras = {
        state: {
          auctionId: this.auctionId,
          userId: this.winnerId[0],
          amount: this.winnerAmount,
          isRegistry: false,
        },
      };

      this.router.navigate(['/payment'], navigationExtras);
    }
    else if(typeof this.winnerId === 'string' && this.winnerId === userId){
      const navigationExtras: NavigationExtras = {
        state: {
          auctionId: this.auctionId,
          userId: this.winnerId,
          amount: this.winnerAmount,
          isRegistry: false,
        },
      };

      this.router.navigate(['/payment'], navigationExtras);
    } else {
      this.router.navigate(['/bid-home-page']);
    }
  }

  ngOnDestroy(): void {
    this.subScriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }
}
