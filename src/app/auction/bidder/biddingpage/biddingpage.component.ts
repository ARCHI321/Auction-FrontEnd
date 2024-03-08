import { Component } from '@angular/core';
import { log } from 'console';
import {
  BehaviorSubject,
  Observable,
  Subject,
  Subscription,
  forkJoin,
  interval,
} from 'rxjs';
import { LoadingService } from '../../../shared/services/loading.service';
import { AuctionService } from '../../../shared/services/auction.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { WebsocketService } from '../../../shared/services/websocket.service';
import { map } from 'rxjs/operators';
import { ChatService, Message } from '../../../shared/services/chat.service';
import { WebSocketSubject } from 'rxjs/webSocket';
import { ToastMessageService } from '../../../shared/services/toast-message.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { AuthService } from '../../../shared/services/auth.service';
import e, { response } from 'express';

@Component({
  selector: 'app-biddingpage',
  templateUrl: './biddingpage.component.html',
  styleUrl: './biddingpage.component.scss',
})
export class BiddingpageComponent {
  currentPrice: number = 100; // Example initial price
  newBid!: number;
  bidStatus!: string;
  countdown: number = 10;
  biddingStarted: boolean = false;
  isLoading!: Observable<boolean>;
  item = {
    id: '1',
    name: 'Item Name',
    description: 'Item Description',
    initialPrice: 100,
    imageData: '',
    auctionStatus: '',
  };
  exit!: boolean;

  maxBid = 1000;
  bidAmount = this.item.initialPrice;
  participants: any;
  customMessage: { author: string; message: string } = {
    author: '',
    message: '',
  };
  isBiddingDisabled: boolean = false;
  auctionId!: string;
  auctionvalue: any;
  minBid: number = 0;
  registeredUsers: any;
  registeredUsers1: any[] = [];
  registeredUsernames: { name: string; selected: boolean; skipped: number }[] =
    [];
  selectedUser!: string;
  isBidding: boolean = false;
  biddingText: string = ' is bidding....';
  isSelected: boolean = false;
  index: number = 0;
  selectedName: string = '';
  timeoutId: any;
  isBidClosed: any;
  bidHistory: any;
  winnerId!: string;
  private registeredUsernamesReady$ = new BehaviorSubject<boolean>(false);
  subscriptions: Subscription[] = [];
  remainingTime: number = 30;
  intervalId: any;
  specialSubscriptions: Subscription[] = [];

  constructor(
    private loadingService: LoadingService,
    private auctionService: AuctionService,
    private router: Router,
    private chatService: ChatService,
    private toastMessageService: ToastMessageService,
    private activateRoute: ActivatedRoute,
    private authService: AuthService
  ) {
    // this.activateRoute.params.subscribe(params => {
    //   this.auctionId = params['id'];
    // });

    const state = this.router.getCurrentNavigation()?.extras.state;
    this.auctionId = state?.['auctionId'];

    //console.log('auction id', this.auctionId);

    this.subscriptions.push(
      this.auctionService.getAuctionItemByAuctionrid(this.auctionId).subscribe(
        (response: any) => {
          this.auctionvalue = response;
          //console.log(this.auctionvalue);
          this.item.name = this.auctionvalue.title;
          this.item.description = this.auctionvalue.description;
          this.item.initialPrice = this.auctionvalue.startingPrice;
          this.item.auctionStatus = this.auctionvalue.auctionStatus;
          this.currentPrice = this.auctionvalue.startingPrice;
          this.bidAmount = this.auctionvalue.startingPrice;
          this.minBid = this.currentPrice + 200;
          this.maxBid = this.currentPrice + 1000;
          this.subscriptions.push(
            this.auctionService.getImageByAuctionId(this.auctionId).subscribe(
              (response: any) => {
                if (response instanceof Blob) {
                  const imageUrl = URL.createObjectURL(response);
                  this.item.imageData = imageUrl;
                } else if (response instanceof HttpResponse) {
                  const blob: Blob = response.body as Blob;
                  const imageUrl = URL.createObjectURL(blob);
                  this.item.imageData = imageUrl;
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
            )
          );
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
      )
    );

    this.subscriptions.push(
      this.auctionService.registeredUsersForAuction(this.auctionId).subscribe(
        (response: any) => {
          //console.log("registered users" , response);
          this.registeredUsers = response;
          this.registeredUsers.sort((a: any, b: any) => {
            const nameA = a.toUpperCase();
            const nameB = b.toUpperCase();

            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }
            return 0;
          });

          const getUserObservables: Observable<any>[] =
            this.registeredUsers.map((userId: string) =>
              this.authService.getUserById(userId)
            );
          this.subscriptions.push(
            forkJoin(getUserObservables).subscribe(
              (responses: any[]) => {
                this.registeredUsernames = responses.map((response) => {
                  const name = response.name;
                  localStorage.setItem(name, '0'); // Set value in localStorage
                  return {
                    name: name,
                    selected: false,
                    skipped: 0,
                  };
                });

                this.selectedUser = this.registeredUsers[this.index];
                this.registeredUsernames[this.index].selected = true;

                console.log('registered usernames', this.registeredUsernames);
                this.registeredUsernamesReady$.next(true);
                this.isBidEnd();
              },
              (error: any) => {
                console.log(error);
              }
            )
          );
        },
        (error: any) => {
          console.log(error);
        }
      )
    );

    this.subscriptions.push(
      this.chatService.messages.subscribe((msg: any) => {
        const jsonDataString = msg['data'];

        //console.log(jsonDataString);

        let startIndex: number = jsonDataString.indexOf('{');
        let endIndex: number = jsonDataString.lastIndexOf('}');
        const innerJSON = jsonDataString.substring(startIndex, endIndex + 1);
        //console.log(innerJSON);
        const jSONObject = JSON.parse(innerJSON);
        this.customMessage.author = jSONObject.message.author;
        this.customMessage.message = jSONObject.message.message;
        console.log(this.customMessage.message == '');
        if (
          this.customMessage.message !== '' &&
          this.customMessage.author !== ''
        ) {
          this.receiveMessage(this.customMessage);
          this.currentPrice = parseInt(this.customMessage.message);
          this.minBid = this.currentPrice + 200;
          this.maxBid = this.currentPrice + 1000;
          this.bidStatus = 'Bid placed successfully';
        } else if (
          this.customMessage.author == '' &&
          this.customMessage.message !== ''
        ) {
          this.loadParticipants();
        } else if (this.customMessage.message == '') {
          console.log('Inside reqd cond');

          this.receiveMessage(this.customMessage);
        }
      })
    );

    const userId = sessionStorage.getItem('username') ? sessionStorage.getItem('username') : '';
    localStorage.setItem(userId!,"0");
  }

  ngOnInit(): void {
    this.startCountdown();
    this.loadAuction();
    this.isBidEnd();

    const refreshInterval = 10000;
      this.specialSubscriptions.push(interval(refreshInterval).subscribe(() => {
        this.loadAuction();
        this.isBidEnd();
        this.loadParticipants();
      }))
  }

  loadAuction() {
    this.subscriptions.push(
      this.auctionService.getAuctionItemByAuctionrid(this.auctionId).subscribe(
        (response: any) => {
          this.auctionvalue = response;
          //console.log(this.auctionvalue);
          // this.item.name = this.auctionvalue.title;
          // this.item.description = this.auctionvalue.description;
          // this.item.initialPrice = this.auctionvalue.startingPrice;
          this.item.auctionStatus = this.auctionvalue.auctionStatus;
          // this.currentPrice = this.auctionvalue.startingPrice;
          this.isBidClosed = this.auctionvalue.auctionStatus;
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
      )
    );
  }

  receiveMessage(customMessage: any) {
    console.log(customMessage, customMessage.message !== '');
    let newMessage =
      customMessage.author +
      ' has given a new bid of amount ' +
      customMessage.message;
    this.selectedName = customMessage.author;
    //console.log(customMessage , customMessage.message !== '');

    if (customMessage.message !== '') {
      this.updateIndex();
      this.toastMessageService.openSnackBar(newMessage);
    } else {
      console.log(this.index, this.registeredUsernames);
      this.index = this.registeredUsernames.findIndex(
        (user) => user.name === this.selectedName
      );
      console.log(this.index, this.selectedName);

      const skipvalue = localStorage.getItem(this.registeredUsernames[this.index].name);
      this.registeredUsernames[this.index].skipped = parseInt(skipvalue!);
      this.registeredUsernames[this.index].skipped++;
      console.log(this.registeredUsernames[this.index].skipped);
      localStorage.setItem(this.registeredUsernames[this.index].name , this.registeredUsernames[this.index].skipped.toString())
      if (this.registeredUsernames[this.index].skipped >= 3) {
        this.registeredUsernames.splice(this.index, 1)[0];
        this.loadParticipants();
        let newMessage =
          customMessage.author +
          ' has skipped for maximum chances. Removing the participant';
        this.subscriptions.push(
          this.auctionService
            .unregisterUserFromAuction(
              this.registeredUsers[this.index],
              this.auctionId,
              0
            )
            .subscribe((response: any) => {
              //console.log(response);
              this.toastMessageService.openSnackBar(newMessage);
              this.updateIndex();
              this.loadParticipants();
            })
        );
      } else {
        let newMessage = customMessage.author + ' has skipped the chance.';
        this.toastMessageService.openSnackBar(newMessage);
        this.updateIndex();
      }
    }
  }

  updateIndex(flag: number = 0) {
    if (flag == 0) {
      this.index = this.registeredUsernames.findIndex(
        (user) => user.name === this.selectedName
      );

      for (let i = 0; i < this.registeredUsernames.length; i++) {
        this.registeredUsernames[i].selected = false;
      }

      this.index++;
      if (this.index >= this.registeredUsers.length) {
        this.index = 0;
      }
      //console.log(this.index);
      this.selectedUser = this.sendNextUser(this.index);

      setTimeout(() => {
        this.registeredUsernames[this.index].selected = true;

      }, 3000);
      this.remainingTime = 30;
    }

    if (flag == 1) {
      //console.log(this.index);
      const bidMessage = {
        author: this.registeredUsernames[this.index].name,
        message: '',
      };
      this.sendMsg(bidMessage);
    }
  }

  sendMsg(message: any) {
    console.log('new message from client to websocket:', message);
    this.chatService.sendChatMessage(message);
    message.message = '';
  }

  isBidEnd() {
    const bidEndCondition1 = this.isBidClosed === 'CLOSED';

    const bidEndCondition2 =
      this.isBidClosed === 'ACTIVE' && this.registeredUsernames.length <= 1;

    const dataReady = this.registeredUsernamesReady$.value;

    console.log(
      bidEndCondition1,
      bidEndCondition2,
      dataReady,
      this.registeredUsernames
    );

    if (bidEndCondition2) {
      const navigationExtras: NavigationExtras = {
        state: {
          auctionId: this.auctionId,
          winnerId: this.registeredUsers,
          flag: 1,
        },
      };
      this.toastMessageService.openSnackBar('Bidding has ended');
      this.subscriptions.push(
        this.auctionService
          .unregisterUserFromAuction(this.registeredUsers[0], this.auctionId, 0)
          .subscribe((response: any) => {
            console.log(response);
            this.router.navigate(['/bid-history'], navigationExtras);
          })
      );

      return true;
    } else if (bidEndCondition1 && dataReady) {
      const navigationExtras: NavigationExtras = {
        state: {
          auctionId: this.auctionId,
          flag: 0,
        },
      };

      this.toastMessageService.openSnackBar('Bidding has ended');
      this.subscriptions.push(
        this.auctionService
          .unregisterUserFromAuction(this.registeredUsers[0], this.auctionId, 0)
          .subscribe((response: any) => {
            console.log(response);
            this.router.navigate(['/bid-history'], navigationExtras);
          })
      );

      return true;
    } else {
      return false;
    }
  }

  sendNextUser(index: number) {
    return this.registeredUsers[index];
  }

  isUserSelect() {
    const userid = sessionStorage.getItem('username');
    if (userid == this.selectedUser) {
      //console.log(userid , this.selectedUser , true);

      return true;
    } else {
      //console.log(userid , this.selectedUser , false);
      return false;
    }
  }

  validateBid() {
    if (this.bidAmount > this.maxBid) {
      this.bidAmount = this.maxBid;
    }
  }

  getStyle() {
    if (this.isUserSelect()) {
      return { 'background-color': 'blue', cursor: 'pointer' };
    } else {
      return { 'background-color': 'gray', cursor: 'not-allowed' };
    }
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
        this.handleAutomaticUpdate();
      }
    }, 1000);
  }

  handleAutomaticUpdate(flag: number = 0): void {
    clearInterval(this.intervalId); // Clear any existing intervals
    console.log('this.intervalId', this.intervalId);
    if (flag === 1) {
      this.updateIndex();
      this.handleAutomaticUpdate();
    } else {
      clearInterval(this.intervalId); // Clear any existing intervals
      console.log('this.intervalId', this.intervalId);
      this.remainingTime = 30;
      this.intervalId = setInterval(() => {
        if (this.remainingTime > 0) {
          this.remainingTime--;
          console.log(this.remainingTime);
        } else {
          this.updateIndex(1);
        }
      }, 1000);
    }
  }

  placeBid(selectedUser: any) {
    const userId = sessionStorage.getItem('username');
    var name = '';
    this.subscriptions.push(
      this.authService.getUserById(userId!).subscribe(
        (response: any) => {
          //console.log("name" , response);

          name = response.name;
          this.newBid = this.bidAmount;
          const bidMessage = {
            author: name,
            message: String(this.newBid),
          };
          if (this.newBid > this.currentPrice) {
            //console.log("selectedUser, this.auctionId , this.newBid" , selectedUser, this.auctionId , this.newBid);

            this.subscriptions.push(
              this.auctionService
                .onClickBid(selectedUser, this.auctionId, this.newBid)
                .subscribe(
                  (response: any) => {
                    console.log(response);
                    this.sendMsg(bidMessage);
                    this.handleAutomaticUpdate(1);
                  },
                  (error: any) => {
                    console.log(error);
                  }
                )
            );
          } else {
            this.bidStatus = 'Bid must be higher than current price';
          }
        },
        (error: any) => {
          console.log(error);
        }
      )
    );
  }

  fold(selectedUser: any): void {
    console.log(this.registeredUsernames);
    console.log(selectedUser);

    this.subscriptions.push(
      this.authService.getUserById(selectedUser).subscribe((response: any) => {
        var selectedName = response.name;
        const index = this.registeredUsernames.findIndex(
          (user) => user.name === selectedName
        );
        this.registeredUsernames.splice(index, 1)[0];
        this.loadParticipants();
        this.subscriptions.push(
          this.auctionService
            .unregisterUserFromAuction(
              this.registeredUsers[index],
              this.auctionId,
              0
            )
            .subscribe((response: any) => {
              console.log(response);
              const bidMessage = {
                author: '',
                message: 'One participant has removed',
              };
              this.sendMsg(bidMessage);

              this.exit = true;
              console.log('Folding');
              console.log(this.exit);
              this.loadParticipants();
            })
        );
      })
    );
  }

  loadParticipants(): void {
    this.subscriptions.push(
      this.auctionService.registeredUsersForAuction(this.auctionId).subscribe(
        (response: any) => {
          //console.log("registered users" , response);
          this.registeredUsers = response;
          this.registeredUsers.sort((a: any, b: any) => {
            const nameA = a.toUpperCase();
            const nameB = b.toUpperCase();

            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }
            return 0;
          });

          const getUserObservables: Observable<any>[] =
            this.registeredUsers.map((userId: string) =>
              this.authService.getUserById(userId)
            );
          this.subscriptions.push(
            forkJoin(getUserObservables).subscribe(
              (responses: any[]) => {
                this.registeredUsernames = responses.map((response) => {
                  const name = response.name;
                  const skipvalue = parseInt(localStorage.getItem(name)!); // Set value in localStorage
                  return {
                    name: name,
                    selected: false,
                    skipped: skipvalue,
                  };
                });

                this.selectedUser = this.registeredUsers[this.index];
                this.registeredUsernames[this.index].selected = true;

                //console.log('registered usernames', this.registeredUsernames);
                this.registeredUsernamesReady$.next(true);
                this.isBidEnd();
              },
              (error: any) => {
                console.log(error);
              }
            )
          );
        },
        (error: any) => {
          console.log(error);
        }
      )
    );
  }

  onExitConfirmed(confirmed: boolean): void {
    if (confirmed) {
      console.log('User confirmed exit');
      this.router.navigate(['/bid-home-page']);
    } else {
      this.exit = false;
      this.loadParticipants();
      console.log('User canceled exit');
    }
  }

  ngOnDestroy(): void {
    this.chatService.disconnect();
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });

    if(this.registeredUsernames.length <= 0){
      this.specialSubscriptions.forEach((subscription) => {
        subscription.unsubscribe();
      });
    }
  }
}
