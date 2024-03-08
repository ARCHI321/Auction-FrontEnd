import { Component, Inject } from '@angular/core';
import {
  AUCTION_SERVICE_TOKEN,
  AuctionService,
} from '../../../shared/services/auction.service';
import { log } from 'console';
import { NavigationExtras, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ToastMessageService } from '../../../shared/services/toast-message.service';
import { AuthService } from '../../../shared/services/auth.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { DataService } from '../../../shared/services/data.service';
import { Subscription, interval } from 'rxjs';
import { NotificationService } from '../../../shared/services/notification.service';

interface AuctionHistoryItem {
  id: number;
  name: string;
  description: string;
  finalPrice: number;
  startTime: any;
}

@Component({
  selector: 'app-bidhomepage',
  templateUrl: './bidhomepage.component.html',
  styleUrl: './bidhomepage.component.scss',
})
export class BidhomepageComponent {
  auctions: any[] = [];
  slickModalConfig: any;
  auctionHistory: AuctionHistoryItem[] = [];
  customMessage: { message: string } = {
    message: '',
  };

  chatSubscription!: Subscription;
  activeTab: string = 'home1';

  constructor(
    @Inject(AUCTION_SERVICE_TOKEN) private auctionService: AuctionService,
    private router: Router,
    private datePipe: DatePipe,
    private toastMessageService: ToastMessageService,
    private authService: AuthService,
    private dataService: DataService,
    private chatService: NotificationService
  ) {
    // Initialize the slickModalConfig
    this.slickModalConfig = {
      infinite: true,
      slidesToShow: 3,
      slidesToScroll: 1,
      arrows: false,
      autoplay: true,
      autoplaySpeed: 2000,
    };

    this.justLoggedIn = authService.getJustLoggedIn();

    this.chatSubscription = this.chatService.messages.subscribe((msg: any) => {
      const jsonDataString = msg['data'];
      this.customMessage.message = jsonDataString;

      this.receiveMessage(this.customMessage);
    });
  }

  // ngOnInit(): void {
  //   // this.auctionService.getAuctions().subscribe(data => {
  //   //   this.auctions = data;
  //   // });

  //   this.auctions = this.auctionService.getAuctions();
  // }
  currentTime!: string | null;

  private intervalId1: any;
  private intervalId2: any;
  currentDateTime: Date = new Date();
  auctionStartTimes: { [key: string]: number } = {};
  // registeredAuctionId: number | null = null;
  registeredAuctions: number[] = [];
  isLoading: boolean = true;
  justLoggedIn: boolean = true;
  pageSize = 10;
  currentPage = 1;
  totalItems = 0;
  responseData: any;
  user: any;

  ngOnInit(): void {
    // this.auctions = this.auctionService.getAuctions();
    // this.auctionHistory = [
    //   {id:1, name: 'Item 1', description: 'Description of Item 1', finalPrice: 150 , startTime: new Date('2024-02-20T12:00:00') },
    //   {id:2, name: 'Item 2', description: 'Description of Item 2', finalPrice: 200  , startTime: new Date('2024-02-20T12:00:00')},
    //   {id:3, name: 'Item 3', description: 'Description of Item 3', finalPrice: 180 , startTime: new Date('2024-02-20T12:00:00')}
    // ];

    setTimeout(() => {
      const userId = sessionStorage.getItem('username');

      if (userId !== null) {
        this.authService.getUserById(userId).subscribe(
          (response: any) => {
            // Handle successful response
            console.log('User:', response);
            this.responseData = response;
            this.dataService.sendData(this.responseData);
          },
          (error: any) => {
            // Handle error
            console.error('Error:', error);
            if (error instanceof HttpErrorResponse) {
              console.log('Response Headers:', error.headers.keys());
              const authorizationHeader = error.headers.get('Authorization');
              if (authorizationHeader) {
                console.log('Authorization Header:', authorizationHeader);
              } else {
                console.log('No Authorization Header found.');
              }
            }
          }
        );
      } else {
        console.error('User ID is null.');
      }
    }, 5000);

    this.loadAuctions();

    this.authService.setJustLoggedIn(false);
    console.log(this.justLoggedIn);

    this.updateDateTime();

    const userId = sessionStorage.getItem('username');

    this.auctionService.registeredAuctionsForUser(userId!, 0).subscribe(
      (response: any) => {
        console.log(response);
        this.registeredAuctions = [];
        this.registeredAuctions = [...response];
      },
      (error: any) => {
        console.log(error);
      }
    );

    this.intervalId1 = setInterval(() => {
      this.updateDateTime();

      this.triggerAction();
    }, 1000);

    this.updateTimeRemaining();
    this.intervalId2 = setInterval(() => {
      this.updateTimeRemaining();
    }, 1000);

    const refreshInterval = 60000;
    interval(refreshInterval).subscribe(() => {
      this.loadAuctions();
    });
  }

  receiveMessage(customMessage: any) {
    console.log(customMessage);

    let newMessage = customMessage.message.substring(
      customMessage.message.indexOf('Broadcast:') + 10,
      customMessage.message.indexOf('@@@@')
    );
    this.user = customMessage.message
      .substring(
        customMessage.message.indexOf('!!!![') + 1,
        customMessage.message.indexOf(']!!!!') - 1
      )
      .split(',');

    const name = sessionStorage.getItem('username');
    var userIdPresent = '';
    if (name !== '' || name !== null) {
      userIdPresent = this.user.some((item: string) =>
        item.trim().includes(name!)
      );
    }

    if (userIdPresent) {
      this.toastMessageService.openSnackBar(newMessage);
    }
  }

  sendMsg(message: any) {
    console.log('new message from client to websocket:', message);
    this.chatService.sendChatMessage(message);
    message.message = '';
  }

  filteredAuctions(): any[] {
    return this.auctions
      .filter(
        (auction) =>
          auction.auctionStatus === 'QUEUE' ||
          auction.auctionStatus === 'UPCOMING'
      )
      .slice(
        (this.currentPage - 1) * this.pageSize,
        (this.currentPage - 1) * this.pageSize + this.pageSize
      );
  }

  activeAuctions(): any[] {
    return this.auctions.filter(
      (auction) => auction.auctionStatus === 'ACTIVE'
    );
  }

  loadAuctions(): void {
    const userId = sessionStorage.getItem('username');

    this.auctionService.getAllAuctionItems(this.currentPage - 1).subscribe(
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
                // Handle HttpResponse
                // You can access the Blob from the response
                const blob: Blob = response.body as Blob;
                const imageUrl = URL.createObjectURL(blob);
                this.auctions[i].imageData = imageUrl;
                if (
                  !this.auctions[i].hasOwnProperty('announced') ||
                  this.auctions[i].announced === false
                ) {
                  this.auctions[i].announced = false;
                } else {
                  this.auctions[i].announced = true;
                }
                // For example, you can set it as the source of an image element in your HTML.
                // this.imageSrc = imageUrl;
              } else {
                console.error(
                  'Unexpected response format. Expected Blob, but received:',
                  response
                );
              }
            },
            (error: any) => {
              console.error('Error fetching image:', error);
            }
          );
        }

        console.log(this.auctions);
        this.isLoading = false;
      },
      (error: any) => {
        console.error('Error:', error);
        this.isLoading = false;
      }
    );
  }

  takePart(auction: any) {
    console.log(`Taking part in auction: ${auction.title}`);

    const navigationExtras: NavigationExtras = {
      state: {
        auctionId: auction.auctionId,
        registeredUsers: this.user,
      },
    };

    // this.router.navigate(['/bidding-page', { id: auction.auctionId }]);
    this.router.navigate(['/bidding-page'], navigationExtras);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadAuctions();
  }

  register(auction: any) {

    if(auction.auctionType == 'Free'){
    const userId = sessionStorage.getItem('username') ?? '';
    this.auctionService.registerForAuction(userId, auction.auctionId).subscribe(
      (response: any) => {
        console.log(response);
        this.toastMessageService.openSnackBar(
          `Registered for auction: ${auction.title}`
        );
        this.auctionService.registeredAuctionsForUser(userId, 0).subscribe(
          (response: any) => {
            console.log(response);
            this.registeredAuctions = [];
            this.registeredAuctions = [...response];
          },
          (error: any) => {
            console.log(error);
          }
        );
      },
      (error: any) => {
        console.log(error);
      }
    );
    }
    else{
      const userId = sessionStorage.getItem('username') ?? '';

      const navigationExtras: NavigationExtras = {
        state: {
          auctionId: auction.auctionId,
          userId: userId,
          amount: auction.registerFee,
          isRegistry:true
        },
      };
      this.auctionService.registerForAuction(userId, auction.auctionId).subscribe(
        (response: any) => {
          console.log(response);
          this.auctionService.registeredAuctionsForUser(userId, 0).subscribe(
            (response: any) => {
              console.log(response);
              this.registeredAuctions = [];
              this.registeredAuctions = [...response];
            },
            (error: any) => {
              console.log(error);
            }
          );
        },
        (error: any) => {
          console.log(error);
        }
      );
      this.router.navigate(['/payment'], navigationExtras);
    }
  }

  unregister(auction:any){

    if(auction.auctionType == 'Paid'){
      this.toastMessageService.openSnackBar(
        'You can unregister from a paid auction'
      );
    }
    else{
    const userId = sessionStorage.getItem('username') ?? '';
    this.auctionService
    .unregisterUserFromAuction(userId, auction.auctionId)
    .subscribe((response: any) => {
      console.log(response);
      this.auctionService.registeredAuctionsForUser(userId, 0).subscribe(
        (response: any) => {
          console.log(response);
          this.registeredAuctions = [];
          this.registeredAuctions = [...response];
          this.toastMessageService.openSnackBar(
            `UnRegistered for auction: ${auction.title}`
          );
        },
        (error: any) => {
          console.log(error);
        }
      );
    });
    }
  }

  isRegistered(auctionId: number): boolean {
    //console.log(this.registeredAuctions , auctionId , this.registeredAuctions.includes(auctionId));

    return this.registeredAuctions.includes(auctionId);
  }

  private updateDateTime(): void {
    this.currentDateTime = new Date();
  }

  private triggerAction(): void {
    const currentHour = this.currentDateTime.getHours();
    const currentDate = this.currentDateTime.getDate();
    if (currentHour === 12 && currentDate === 15) {
      console.log("It's noon on the 15th day of the month!");
    }
  }

  updateTimeRemaining(): void {
    const currentTime = new Date().getTime();

    this.auctions.forEach((auction) => {
      if (auction.slot.startTime) {
        const currentDate = new Date().toISOString().split('T')[0]; // Get the current date in the format "YYYY-MM-DD"
        const fullStartTimeString = `${currentDate}T${auction.slot.startTime}`;

        const startTime = new Date(fullStartTimeString).getTime();

        if (startTime <= currentTime && auction.announced == false) {
          this.auctionStartTimes[auction.auctionId] = 0;
          auction.announced = true;
        } else {
          this.auctionStartTimes[auction.auctionId] = Math.floor(
            (startTime - currentTime) / 1000
          );
        }
      }
    });
  }

  announceAuction(auction: any): void {
    console.log(`Auction "${auction.title}" has started!`);
    this.toastMessageService.openSnackBar(
      `Auction "${auction.title}" has started!`
    );
  }

  formatTimeRemaining(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId1);
    clearInterval(this.intervalId2);
    this.chatService.disconnect();
  }
  changeTab(tabId: string): void {
    this.activeTab = tabId;
  }
}
