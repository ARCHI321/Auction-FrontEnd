import { Component, Inject } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';
import {
  AUCTION_SERVICE_TOKEN,
  AuctionService,
} from '../../../shared/services/auction.service';
import { HttpResponse } from '@angular/common/http';
import { ToastMessageService } from '../../../shared/services/toast-message.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';

interface AuctionHistoryItem {
  title: any;
  description: string;
  currentPrice: number;
  winnerId: string;
}

@Component({
  selector: 'app-my-auction-history',
  templateUrl: './my-auction-history.component.html',
  styleUrl: './my-auction-history.component.scss',
})
export class MyAuctionHistoryComponent {
  auctionHistory: AuctionHistoryItem[] = [];
  auctions: any[] = [];
  pageSize = 10;
  currentPage = 1;
  totalItems = 0;
  backLocation!: string;
  isLoading: boolean = true;
  loadingTimeout: any;
items: any;

  constructor(
    private authService: AuthService,
    @Inject(AUCTION_SERVICE_TOKEN) private auctionService: AuctionService,
    private toastMessageService: ToastMessageService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    console.log(this.authService.getUserRole());
    if (this.authService.getUserRole() === 'auctionner') this.loadAuctions();
    if (this.authService.getUserRole() === 'bidder') this.loadAll();

    if (this.isBidder()) {
      this.backLocation = 'bid-home-page';
    }
    if (this.isAuctioneer()) {
      this.backLocation = 'auction-items';
    }
    this.loadingTimeout = setTimeout(() => {
      this.isLoading = false;
    }, 3000);


   
  }

  loadAuctions(): void {
    const userId = sessionStorage.getItem('username');

    this.auctionService
      .getAllAuctionItemsByUserid(userId, this.currentPage - 1)
      .subscribe(
        (response: any) => {
          this.auctions = response.content;

          this.auctions.sort((a, b) => {
            const dateTimeA = `${a.slot.date} ${a.slot.startTime}`;
            const dateTimeB = `${b.slot.date} ${b.slot.startTime}`;
            const timestampA = new Date(dateTimeA).getTime();
            const timestampB = new Date(dateTimeB).getTime();
            return timestampA - timestampB;
          });

          this.totalItems = response.totalElements;
          for (let i = 0; i < this.auctions.length; i++) {
            var auctionId = this.auctions[i].auctionId;
            this.auctionService.getImageByAuctionId(auctionId).subscribe(
              (response: any) => {
                if (response instanceof Blob) {
                  const imageUrl = URL.createObjectURL(response);
                  this.auctions[i].imageData = imageUrl;
                } else if (response instanceof HttpResponse) {
                  const blob: Blob = response.body as Blob;
                  const imageUrl = URL.createObjectURL(blob);
                  this.auctions[i].imageData = imageUrl;
                } else {
                  console.error(
                    'Unexpected response format. Expected Blob, but received:',
                    response
                  );
                }
                this.isLoading = false;
              },
              (error: any) => {
                console.error('Error fetching image:', error);
                this.isLoading = false;
              }
            );
          }

          console.log(this.auctions);
        },
        (error: any) => {
          console.error('Error:', error);
        }
      );
  }

  loadAll() {
    const userId = sessionStorage.getItem('username');

    this.auctionService.getAllAuctions(this.currentPage - 1).subscribe(
      (response: any) => {
        console.log(response);
        this.auctionHistory = response.content;

        this.auctions.sort((a, b) => {
          const dateTimeA = `${a.slot.date} ${a.slot.startTime}`;
          const dateTimeB = `${b.slot.date} ${b.slot.startTime}`;

          const timestampA = new Date(dateTimeA).getTime();
          const timestampB = new Date(dateTimeB).getTime();

          return timestampA - timestampB;
        });
        this.totalItems = response.totalElements;

        console.log(this.auctionHistory);
        this.isLoading = false;
      },
      (error: any) => {
        console.error('Error:', error);

        this.isLoading = false;
      }
    );
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadAuctions();
  }

  isBidder(): boolean {
    return this.authService.getUserRole() === 'bidder';
  }

  isAuctioneer(): boolean {
    return this.authService.getUserRole() === 'auctionner';
  }

  deleteAuction(auctionId: string): void {
    const userId = sessionStorage.getItem('username');
    this.auctionService.deleteAuctionById(auctionId, userId).subscribe(
      (response: any) => {
        console.log(`Auction with ID ${auctionId} deleted successfully.`);
        this.toastMessageService.openSnackBar('Auction deleted succesfully');
        this.loadAuctions();
      },
      (error: any) => {
        console.error('Error deleting auction:', error);
        if (error.error.message == 'Auction cannot be deleted')
          this.toastMessageService.openSnackBar(
            'Paid Auction cannot be deleted'
          );
        else this.toastMessageService.openSnackBar(error.error.message);
      }
    );
  }
  editAuction(auctionId: any) {
    this.router.navigate(['/edit-auction-page', { id: auctionId }]);
  }

  ngOnDestroy(): void {
    clearTimeout(this.loadingTimeout);
  }
}
