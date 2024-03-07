import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './auth/signup/signup.component';
import { LandingComponent } from './home/landing/landing.component';
import { SigninComponent } from './auth/signin/signin.component';
import { CompleteDetailsComponent } from './auth/complete-details/complete-details.component';
import { AuctionhomepageComponent } from './auction/auctioneer/auctionhomepage/auctionhomepage.component';
import { MyAuctionHistoryComponent } from './auction/auctioneer/my-auction-history/my-auction-history.component';
import { AuthGuard } from './shared/auth.guard';
import { BidhomepageComponent } from './auction/bidder/bidhomepage/bidhomepage.component';
import { BiddingpageComponent } from './auction/bidder/biddingpage/biddingpage.component';
import { RegisteredauctionsComponent } from './auction/bidder/registeredauctions/registeredauctions.component';
import { Error404Component } from './shared/error404/error404.component';
import { UserInfoComponent } from './auction/profile-features/user-info/user-info.component';
import { EditProfileComponent } from './auction/profile-features/edit-profile/edit-profile.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { EditAuctionPageComponent } from './auction/auctioneer/edit-auction-page/edit-auction-page.component';
import { BidHistoryComponent } from './auction/bidder/bid-history/bid-history.component';
import { PaymentComponent } from './auction/app-payment/payment/payment.component';
import { TransactionHistoryComponent } from './auction/bidder/transaction-history/transaction-history.component';




const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'signin', component: SigninComponent },
  { path: 'complete-details', component: CompleteDetailsComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'auction-items', component: AuctionhomepageComponent , canActivate: [AuthGuard]},
  { path: 'bid-home-page', component: BidhomepageComponent , canActivate: [AuthGuard]},
  { path: 'my-auction-history', component: MyAuctionHistoryComponent , canActivate: [AuthGuard]},
  { path: 'bidding-page', component: BiddingpageComponent , canActivate: [AuthGuard]},
  { path: 'registered-auctions', component: RegisteredauctionsComponent , canActivate:[AuthGuard]},
  { path: 'my-profile', component: UserInfoComponent , canActivate: [AuthGuard]},
  { path: 'edit-profile', component: EditProfileComponent ,   canActivate: [AuthGuard]
  },
  { path: 'edit-auction-page', component: EditAuctionPageComponent , canActivate: [AuthGuard]},
  { path: 'bid-history', component: BidHistoryComponent , canActivate: [AuthGuard] },
  { path: 'transaction-history', component: TransactionHistoryComponent , canActivate: [AuthGuard] },
  { path: 'payment', component: PaymentComponent , canActivate: [AuthGuard] },
  { path: '**', component:Error404Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
