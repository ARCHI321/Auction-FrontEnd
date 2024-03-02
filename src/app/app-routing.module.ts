import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { LandingComponent } from './landing/landing.component';
import { SigninComponent } from './signin/signin.component';
import { CompleteDetailsComponent } from './complete-details/complete-details.component';
import { AuctionhomepageComponent } from './auctionhomepage/auctionhomepage.component';
import { MyAuctionHistoryComponent } from './my-auction-history/my-auction-history.component';
import { AuthGuard } from './shared/auth.guard';
import { BidhomepageComponent } from './bidhomepage/bidhomepage.component';
import { BiddingpageComponent } from './biddingpage/biddingpage.component';
import { RegisteredauctionsComponent } from './registeredauctions/registeredauctions.component';
import { Error404Component } from './error404/error404.component';
import { UserInfoComponent } from './profile-features/user-info/user-info.component';
import { EditProfileComponent } from './profile-features/edit-profile/edit-profile.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { EditAuctionPageComponent } from './edit-auction-page/edit-auction-page.component';




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
  { path: 'registered-auctions', component: RegisteredauctionsComponent , canActivate: [AuthGuard]},
  { path: 'my-profile', component: UserInfoComponent , canActivate: [AuthGuard]},
  { path: 'edit-profile', component: EditProfileComponent , canActivate: [AuthGuard]},
  { path: 'edit-auction-page', component: EditAuctionPageComponent , canActivate: [AuthGuard]},
  { path: '**', component:Error404Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
