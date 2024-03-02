import { Component, EventEmitter, Output } from '@angular/core';
import { log } from 'console';
import { AuthService } from './../../auth.service';
import { Observable, Subscription, map } from 'rxjs';
import { Route, Router } from '@angular/router';
import { DataService } from '../../data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  isLoggedIn!:boolean;
  loggingSubscription!: Subscription;
  showDropdown: boolean = false;
  showNotifications = false;
  firstLetter!:string;
  receivedData :any;



  constructor(private authService:AuthService,private router:Router ,private dataService: DataService){}

  ngOnInit() {
    this.loggingSubscription = this.authService.isAuthenticated.subscribe((loggedIn: boolean) => {
      this.isLoggedIn = loggedIn;

    });


    this.dataService.getData().subscribe(data => {
      this.receivedData = data;
      console.log(this.receivedData);

      this.firstLetter = this.receivedData.name ? this.receivedData.name.at(0) :'';
    });




  }

  ngOnDestroy(){
    this.loggingSubscription.unsubscribe();
  }



  toggleDropdown() {
    console.log(this.showDropdown);

    this.showDropdown = !this.showDropdown;
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }


  isBidder(): boolean {

    return this.authService.getUserRole() === 'bidder';
  }

  isAuctioneer(): boolean {

    return this.authService.getUserRole() === 'auctionner';
  }

  switchProfile(role:string){


    if(role == 'auctionner'){
      this.authService.switchProfile(role);
      this.authService.setJustLoggedIn(true);
      this.router.navigate(['/auction-items'])
    }
    if(role == 'bidder'){
      this.authService.switchProfile(role);
      this.authService.setJustLoggedIn(true);
      this.router.navigate(['/bid-home-page'])
    }


  }








}
