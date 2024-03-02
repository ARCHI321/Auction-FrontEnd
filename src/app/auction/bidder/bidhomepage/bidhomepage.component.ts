import { Component, Inject } from '@angular/core';
import { AUCTION_SERVICE_TOKEN, AuctionService } from '../../../shared/services/auction.service';
import { log } from 'console';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ToastMessageService } from '../../../shared/services/toast-message.service';
import { AuthService } from '../../../shared/services/auth.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { DataService } from '../../../shared/services/data.service';
import { interval } from 'rxjs';
import { NotificationService } from '../../../shared/services/notification.service';


interface AuctionHistoryItem {
  id:number,
  name: string;
  description: string;
  finalPrice: number;
  startTime: any;
}

@Component({
  selector: 'app-bidhomepage',
  templateUrl: './bidhomepage.component.html',
  styleUrl: './bidhomepage.component.scss'
})
export class BidhomepageComponent {
  auctions: any[] = [];
  slickModalConfig: any;
  auctionHistory: AuctionHistoryItem[] = [];
  customMessage : {message:string} = {
    message:''
  }

  constructor(@Inject(AUCTION_SERVICE_TOKEN) private auctionService: AuctionService , private router:Router,private datePipe: DatePipe,private toastMessageService:ToastMessageService,private authService:AuthService,private dataService: DataService,private chatService: NotificationService , ) {
    // Initialize the slickModalConfig
    this.slickModalConfig = {
      infinite: true,
      slidesToShow: 3,
      slidesToScroll: 1,
      arrows: false,
      autoplay: true,
      autoplaySpeed: 2000
    };

    this.justLoggedIn = authService.getJustLoggedIn();


    this.chatService.messages.subscribe((msg: any) => {

      const jsonDataString = msg['data'];
      let startIndex: number = jsonDataString.indexOf('{');
      let endIndex: number = jsonDataString.lastIndexOf('}');
      const innerJSON = jsonDataString.substring(startIndex,endIndex+1);

      const jSONObject = JSON.parse(innerJSON);
      this.customMessage.message = jSONObject.message.message;
      this.receiveMessage(this.customMessage);
  })
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
  isLoading:boolean = true;
  justLoggedIn:boolean = true;
  pageSize = 10;
  currentPage = 1;
  totalItems = 0;
  responseData:any;



  ngOnInit(): void {

    // this.auctions = this.auctionService.getAuctions();
    // this.auctionHistory = [
    //   {id:1, name: 'Item 1', description: 'Description of Item 1', finalPrice: 150 , startTime: new Date('2024-02-20T12:00:00') },
    //   {id:2, name: 'Item 2', description: 'Description of Item 2', finalPrice: 200  , startTime: new Date('2024-02-20T12:00:00')},
    //   {id:3, name: 'Item 3', description: 'Description of Item 3', finalPrice: 180 , startTime: new Date('2024-02-20T12:00:00')}
    // ];

    setTimeout(()=>{
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
    },5000);


    this.loadAuctions();

    this.authService.setJustLoggedIn(false);
    console.log(this.justLoggedIn);




    this.updateDateTime();


    this.intervalId1 = setInterval(() => {
      this.updateDateTime();

      this.triggerAction();
    }, 1000);


    this.updateTimeRemaining();
    this.intervalId2 = setInterval(() => {
      this.updateTimeRemaining();
    }, 1000);

    const refreshInterval = 300000;
    interval(refreshInterval).subscribe(() => {
      this.loadAuctions();
    });
  }

  receiveMessage(customMessage:any){
    let newMessage = customMessage.author + "has given a new bid of amount " + customMessage.message;
    this.toastMessageService.openSnackBar(newMessage);
  }

sendMsg(message:any) {
  console.log('new message from client to websocket:', message);
  this.chatService.sendChatMessage(message);
  message.message = '';
}

  filteredAuctions(): any[] {
    return this.auctions
      .filter(auction => auction.auctionStatus === 'QUEUE' || auction.auctionStatus === 'UPCOMING')
      .slice((this.currentPage - 1) * this.pageSize, (this.currentPage - 1) * this.pageSize + this.pageSize);
  }

  activeAuctions(): any[] {

    return this.auctions.filter(auction => auction.auctionStatus === 'ACTIVE');
  }



  loadAuctions(): void {
    const userId = sessionStorage.getItem('username');

    this.auctionService.getAllAuctionItems(this.currentPage-1).subscribe(
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

      }
    );
  }

  takePart(auction: any) {

    console.log(`Taking part in auction: ${auction.title}`);

    this.router.navigate(['/bidding-page']);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadAuctions();
  }

  register(auction: any) {
    const userId = sessionStorage.getItem('username') ?? '';
    this.auctionService.registerForAuction(userId , auction.auctionId).subscribe(
      (resposne:string)=>{
        console.log(resposne);
        this.toastMessageService.openSnackBar(`Registered for auction: ${auction.title}`);
        if (!this.registeredAuctions.includes(auction.id)) {
            this.registeredAuctions.push(auction.id);
        }
      },
      (error:any)=>{
        console.log(error);

      }

    )


  }




  isRegistered(auctionId: number): boolean {
    // console.log(auctionId , this.registeredAuctions);

    return this.registeredAuctions.includes(auctionId);
  }



  private updateDateTime(): void {

    this.currentDateTime = new Date();
  }

  private triggerAction(): void {

    const currentHour = this.currentDateTime.getHours();
    const currentDate = this.currentDateTime.getDate();
    if (currentHour === 12 && currentDate === 15) {

      console.log('It\'s noon on the 15th day of the month!');

    }
  }

  updateTimeRemaining(): void {
    const currentTime = new Date().getTime();

    this.auctions.forEach(auction => {
      if (auction.slot.startTime) {
        const currentDate = new Date().toISOString().split('T')[0]; // Get the current date in the format "YYYY-MM-DD"
        const fullStartTimeString = `${currentDate}T${auction.slot.startTime}`;

        const startTime = new Date(fullStartTimeString).getTime();


        if (startTime <= currentTime) {
          this.auctionStartTimes[auction.auctionId] = 0;
          // auction.announced = true;
        } else {
          this.auctionStartTimes[auction.auctionId] = Math.floor((startTime - currentTime) / 1000);
        }
      }
    });


  }


  announceAuction(auction: any): void {
    console.log(`Auction "${auction.title}" has started!`);
    this.toastMessageService.openSnackBar(`Auction "${auction.title}" has started!`);
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
  }
}
