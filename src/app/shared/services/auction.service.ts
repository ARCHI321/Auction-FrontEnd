// auction.service.ts

import { Injectable, InjectionToken } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export const AUCTION_SERVICE_TOKEN = new InjectionToken<any>('AUCTION_SERVICE_TOKEN');

@Injectable({
  providedIn: 'root'
})
export class AuctionService {

  constructor(private http: HttpClient) { }

  // getAuctions(): Observable<any[]> {
  //   // return this.http.get<any[]>('api/auctions');
  //   return [
  //     { title: 'Auction 1', description: 'Description 1', isPaid: true },
  //     { title: 'Auction 2', description: 'Description 2', isPaid: false },
  //     // More auction items...
  //   ];
  // }
  getAuctions() {
    // return this.http.get<any[]>('api/auctions');
    return [

      {id:1, title: 'Item 1', description: 'Description of Item 1', isPaid: true,finalPrice: 150 , startTime: new Date('2024-02-22T15:00:00'),announced: false  },
      {id:2, title: 'Item 2', description: 'Description of Item 2', isPaid: true, finalPrice: 200  , startTime: new Date('2024-02-22T12:30:00') ,announced: false},
      {id:3, title: 'Item 3', description: 'Description of Item 3', isPaid: true , finalPrice: 180 , startTime: new Date('2024-02-23T12:00:00'),announced: false },
      {id:4, title: 'Item 4', description: 'Description of Item 4', isPaid: false , finalPrice: 180 , startTime: new Date('2024-03-14T15:47:00'),announced: false },
      {id:5, title: 'Item 5', description: 'Description of Item 5', isPaid: false , finalPrice: 180 , startTime: new Date('2024-02-25T17:25:00'),announced: false },
      {id:6, title: 'Item 6', description: 'Description of Item 6', isPaid: false , finalPrice: 180 , startTime: new Date('2024-02-20T23:00:00'),announced: false }
    ];
  }


  // getRegisteredAuctions(userId: string): Observable<any[]> {
  //   // Make an HTTP request to your backend API to fetch registered auctions
  //   // Replace 'api/registeredAuctions?userId=' with your actual API endpoint
  //   return this.http.get<any[]>('api/registeredAuctions?userId=' + userId);
  // }
  getRegisteredAuctions(userId: string){
    return [

      {id:1, title: 'Item 1', description: 'Description of Item 1', isPaid: true,finalPrice: 150 , startTime: new Date('2024-02-20T12:00:00'),announced: false  },
      {id:2, title: 'Item 2', description: 'Description of Item 2', isPaid: true, finalPrice: 200  , startTime: new Date('2024-02-20T12:00:00'),announced: false},
      {id:3, title: 'Item 3', description: 'Description of Item 3', isPaid: true , finalPrice: 180 , startTime: new Date('2024-02-20T12:00:00'),announced: false },
      {id:4, title: 'Item 4', description: 'Description of Item 4', isPaid: false , finalPrice: 180 , startTime: new Date('2024-02-18T15:47:00'),announced: false },
      {id:5, title: 'Item 5', description: 'Description of Item 5', isPaid: false , finalPrice: 180 , startTime: new Date('2024-02-20T12:00:00'),announced: false },
      {id:6, title: 'Item 6', description: 'Description of Item 6', isPaid: false , finalPrice: 180 , startTime: new Date('2024-02-20T12:00:00'),announced: false }
    ];
  }

  getRegisteredUsers(itemId:string){
    return [

      {id:1, name: 'User 1', maxBidder:false , bidAmount: 0 , isFolded : false , hasExited:false},
      {id:2, name: 'User 2', maxBidder:false , bidAmount: 0 , isFolded : false , hasExited:false},
      {id:3, name: 'User 3', maxBidder:false , bidAmount: 0 , isFolded : false , hasExited:false},
      {id:4, name: 'User 4', maxBidder:false , bidAmount: 0 , isFolded : false , hasExited:false},
      {id:5, name: 'User 5', maxBidder:false , bidAmount: 0 , isFolded : false , hasExited:false},
      {id:6, name: 'User 6', maxBidder:false , bidAmount: 0 , isFolded : false , hasExited:false}
    ];

  }

  getAllCategories(){
    return this.http.get<any>('http://localhost:8080/categories');
  }
  getAllAuctionTypes(){
    return this.http.get<any>('http://localhost:8080/auction/types');
  }
  getSlotStatus(date:Date , slotnumber:number){
    return this.http.get<any>(`http://localhost:8080/auction/slot/${slotnumber}?date=${date}`);
  }
  createAuctionItem(data:any){
    return this.http.post<any>('http://localhost:8080/auction/create',data);
  }

  getAllAuctionItemsByUserid(userid:any , page:number){
    return this.http.get<any>(`http://localhost:8080/auction/seller/${userid}?page=${page}`);
  }
  getAuctionItemByAuctionrid(auctionId:any){
    return this.http.get<any>(`http://localhost:8080/auction/${auctionId}`);
  }

  getImageByAuctionId(auctionId: any) {
    const headers = new HttpHeaders({ 'Content-Type': 'image/png' });
    return this.http.get(`http://localhost:8080/auction/image/${auctionId}`, {
      responseType: 'blob',
      headers: headers,
      observe: 'response', // Use 'response' to get the full response
    });
  }

  deleteAuctionById(auctionId:any , userId:any){
    return this.http.delete<any>(`http://localhost:8080/auction/delete/${auctionId}?userId=${userId}`)
  }

  editAuctionById(auctionId:any , auction:any){
    return this.http.put<any>(`http://localhost:8080/auction/update/${auctionId}`, auction)
  }

  getAllAuctionItems(page:number){
    return this.http.get<any>(`http://localhost:8080/auction/all?page=${page}`);
  }

  getAllAuctions(page:number){
    return this.http.get<any>(`http://localhost:8080/auction/all-auctions?page=${page}`);
  }

  registerForAuction(userId:string , auctionId:string){
    return this.http.post<any>(`http://localhost:8080/auction-registrations/register?userId=${userId}&auctionId=${auctionId}`,null);
  }
  registeredAuctionsForUser(userId:string , flag:number){
    return this.http.get<any>(`http://localhost:8080/auction-registrations/registration/${userId}?flag=${flag}`);
  }

  onClickBid(userId: any, auctionId: any  , bidAmount:any) {
    return this.http.post<any>(`http://localhost:8080/bid/post-bids?userId=${userId}&auctionId=${auctionId}&bidAmount=${bidAmount}`,null);
  }

  registeredUsersForAuction(auctionId:any){
    return this.http.get<any>(`http://localhost:8080/auction-registrations/get-registered-users/${auctionId}`)
  }

  deleteUserByUserId(userid:string){
    return this.http.delete<any>(`http://localhost:8080/bid/delete/${userid}`)
  }

  getWinner(auctionId:string){
    return this.http.get<any>(`http://localhost:8080/bid/get-winner?auctionId=${auctionId}`)
  }

  truncateBidsTable(){
    return this.http.get<any>(`http://localhost:8080/bid/truncate`)
  }

  unregisterUserFromAuction(userId:any , auctionId:any){
    return this.http.delete<any>(`http://localhost:8080/auction-registrations/unregister?userId=${userId}&auctionId=${auctionId}`)
  }

  getBidHistory(){
    return this.http.get<any>(`http://localhost:8080/bid/get-all-bids`)
  }

  getAllTransactionsByUserId(userId:string){
    return this.http.get<any>(`http://localhost:8080/transactions/all-transactions-by-user?userId=${userId}`);
  }
}
