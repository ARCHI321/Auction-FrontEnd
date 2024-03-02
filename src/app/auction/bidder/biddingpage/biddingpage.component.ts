import { Component } from '@angular/core';
import { log } from 'console';
import { Observable , Subject } from 'rxjs';
import { LoadingService } from '../../../shared/services/loading.service';
import { AuctionService } from '../../../shared/services/auction.service';
import { Router } from '@angular/router';
import { WebsocketService } from '../../../shared/services/websocket.service';
import { map } from 'rxjs/operators';
import { ChatService, Message } from '../../../shared/services/chat.service';
import { WebSocketSubject } from 'rxjs/webSocket';
import { ToastMessageService } from '../../../shared/services/toast-message.service';




@Component({
  selector: 'app-biddingpage',
  templateUrl: './biddingpage.component.html',
  styleUrl: './biddingpage.component.scss'
})
export class BiddingpageComponent {
  currentPrice: number = 100; // Example initial price
  newBid!: number;
  bidStatus!: string;
  countdown: number = 10;
  biddingStarted: boolean = false;
  isLoading!: Observable<boolean>;
  item = {
    id:'1',
    name: 'Item Name',
    description: 'Item Description',
    initialPrice: 100
  };
  exit!:boolean;

  maxBid = 1000;
  bidAmount = this.item.initialPrice;
  participants:any;
  customMessage : {author : string , message:string} = {
    author: '' , message:''
  }
  isBiddingDisabled:boolean = false;









  constructor(private  loadingService: LoadingService , private auctionService:AuctionService, private router:Router , private chatService: ChatService , private toastMessageService:ToastMessageService) {
    this.chatService.messages.subscribe((msg: any) => {

      const jsonDataString = msg['data'];
      let startIndex: number = jsonDataString.indexOf('{');
      let endIndex: number = jsonDataString.lastIndexOf('}');
      const innerJSON = jsonDataString.substring(startIndex,endIndex+1);

      const jSONObject = JSON.parse(innerJSON);
      this.customMessage.author = jSONObject.message.author;
      this.customMessage.message = jSONObject.message.message;
      this.receiveMessage(this.customMessage);
      this.currentPrice = parseInt(this.customMessage.message);
      this.bidStatus = 'Bid placed successfully';
  })

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


  ngOnInit(): void {
    this.startCountdown();
    this.loadParticipants();




  }

  startBid(){

  }

  startCountdown() {
    const intervalId = setInterval(() => {
      // console.log(this.countdown,this.biddingStarted);

      this.countdown--;
      if (this.countdown === 1) {
        this.isLoading = this.loadingService.loading$;
      }
      if (this.countdown === 0) {
        clearInterval(intervalId);
        this.biddingStarted = true;
      }
    }, 1000);


  }

  placeBid() {
    const userId = sessionStorage.getItem('username');
    const bidMessage = {
      author: userId,
      message: String(this.newBid),
    };


    this.newBid = this.bidAmount;
    if ( this.newBid > this.currentPrice) {
      this.sendMsg(bidMessage);
    } else {
      this.bidStatus = 'Bid must be higher than current price';
    }


  }




  fold(): void {
    this.exit = true;
    console.log('Folding');
    console.log(this.exit);

  }

  loadParticipants(): void {
    this.participants =  this.auctionService.getRegisteredUsers(this.item.id);
    console.log(this.participants);

  }

  onExitConfirmed(confirmed: boolean): void {
    if (confirmed) {

      console.log('User confirmed exit');
      this.router.navigate(["/bid-home-page"]);
    } else {
      this.exit = false;
      console.log('User canceled exit');

    }
  }




}
