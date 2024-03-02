import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingComponent } from './home/landing/landing.component';
import { SignupComponent } from './auth/signup/signup.component';
import { SigninComponent } from './auth/signin/signin.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompleteDetailsComponent } from './auth/complete-details/complete-details.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { AuctionhomepageComponent } from './auction/auctioneer/auctionhomepage/auctionhomepage.component';
import { MyAuctionHistoryComponent } from './auction/auctioneer/my-auction-history/my-auction-history.component';
import { LogoutComponent } from './shared/logout/logout.component';
import { BidhomepageComponent } from './auction/bidder/bidhomepage/bidhomepage.component';
import { AUCTION_SERVICE_TOKEN, AuctionService } from './shared/services/auction.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { BiddingpageComponent } from './auction/bidder/biddingpage/biddingpage.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { BackComponent } from './shared/back/back.component';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RegisteredauctionsComponent } from './auction/bidder/registeredauctions/registeredauctions.component';
import { Error404Component } from './shared/error404/error404.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { UserInfoComponent } from './auction/profile-features/user-info/user-info.component';
import { EditProfileComponent } from './auction/profile-features/edit-profile/edit-profile.component';
import { ExitConfirmationComponent } from './shared/exit-confirmation/exit-confirmation.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faLinkedin, faFacebookSquare, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { BasicAuthHttpInterceptorService } from './shared/services/basic-auth-http-interceptor.service';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { PaginationComponent } from './auction/pagination/pagination.component';
import { EditAuctionPageComponent } from './auction/auctioneer/edit-auction-page/edit-auction-page.component';



library.add(faLinkedin, faFacebookSquare, faInstagram);

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    SignupComponent,
    SigninComponent,
    CompleteDetailsComponent,
    LoadingSpinnerComponent,
    AuctionhomepageComponent,
    MyAuctionHistoryComponent,
    LogoutComponent,
    BidhomepageComponent,
    BiddingpageComponent,
    HeaderComponent,
    FooterComponent,
    CarouselComponent,
    BackComponent,
    RegisteredauctionsComponent,
    Error404Component,
    UserInfoComponent,
    EditProfileComponent,
    ExitConfirmationComponent,
    ForgotPasswordComponent,
    PaginationComponent,
    EditAuctionPageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SlickCarouselModule,
    CommonModule,
    FontAwesomeModule,
    RouterModule.forRoot([])


  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync(),
    { provide: AUCTION_SERVICE_TOKEN, useClass: AuctionService },
    { provide: HTTP_INTERCEPTORS, useClass: BasicAuthHttpInterceptorService, multi: true },
    // { provide: LocationStrategy, useClass: HashLocationStrategy },
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
