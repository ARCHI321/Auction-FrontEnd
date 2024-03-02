import { Component, Inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { AUCTION_SERVICE_TOKEN, AuctionService } from '../auction.service';
import { HttpResponse } from '@angular/common/http';
import { ToastMessageService } from './../toast-message.service';
import { Router } from '@angular/router';


interface AuctionHistoryItem {
  name: string;
  description: string;
  finalPrice: number;
}


@Component({
  selector: 'app-my-auction-history',
  templateUrl: './my-auction-history.component.html',
  styleUrl: './my-auction-history.component.scss'
})
export class MyAuctionHistoryComponent {
  auctionHistory: AuctionHistoryItem[] = [];
  auctions: any[] = [];
  pageSize = 10;
  currentPage = 1;
  totalItems = 0;
  backLocation!:string ;
  isLoading:boolean = true;

  constructor(private authService:AuthService,@Inject(AUCTION_SERVICE_TOKEN) private auctionService: AuctionService, private toastMessageService:ToastMessageService, private router:Router) { }

  ngOnInit(): void {

    this.auctionHistory = [
      { name: 'Item 1', description: 'Description of Item 1', finalPrice: 150 },
      { name: 'Item 2', description: 'Description of Item 2', finalPrice: 200 },
      { name: 'Item 3', description: 'Description of Item 3', finalPrice: 180 }
    ];

    this.loadAuctions();



    if(this.isBidder()){
      this.backLocation = "bid-home-page";
    }
    if(this.isAuctioneer()){
      this.backLocation = "auction-items";
    }


  }



  loadAuctions(): void {
    const userId = sessionStorage.getItem('username');

    this.auctionService.getAllAuctionItemsByUserid(userId, this.currentPage-1).subscribe(
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
                this.auctions[i].imageData=imageUrl;
              }
              else if (response instanceof HttpResponse) {
                // Handle HttpResponse
                // You can access the Blob from the response
                const blob: Blob = response.body as Blob;
                const imageUrl = URL.createObjectURL(blob);
                this.auctions[i].imageData=imageUrl;
                // For example, you can set it as the source of an image element in your HTML.
                // this.imageSrc = imageUrl;
              }
              else {
                console.error('Unexpected response format. Expected Blob, but received:', response);
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
    this.auctionService.deleteAuctionById(auctionId,userId).subscribe(
      (response: any) => {
        // Handle successful deletion
        console.log(`Auction with ID ${auctionId} deleted successfully.`);
        this.toastMessageService.openSnackBar('Auction deleted succesfully')
        // Refresh the list of auctions
        this.loadAuctions();
      },
      (error: any) => {
        // Handle error
        console.error('Error deleting auction:', error);
        if(error.error.message == "Auction cannot be deleted")
           this.toastMessageService.openSnackBar('Paid Auction cannot be deleted')
        else
           this.toastMessageService.openSnackBar(error.error.message);
      }
    );
  }
  editAuction(auctionId: any) {
    this.router.navigate(['/edit-auction-page', { id: auctionId }]);
}



}
