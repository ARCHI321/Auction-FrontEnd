import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingComponent } from './landing/landing.component';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompleteDetailsComponent } from './complete-details/complete-details.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { AuctionhomepageComponent } from './auctionhomepage/auctionhomepage.component';
import { MyAuctionHistoryComponent } from './my-auction-history/my-auction-history.component';
import { LogoutComponent } from './shared/logout/logout.component';
import { BidhomepageComponent } from './bidhomepage/bidhomepage.component';
import { AUCTION_SERVICE_TOKEN, AuctionService } from './auction.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { BiddingpageComponent } from './biddingpage/biddingpage.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { BackComponent } from './shared/back/back.component';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RegisteredauctionsComponent } from './registeredauctions/registeredauctions.component';
import { Error404Component } from './error404/error404.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { UserInfoComponent } from './profile-features/user-info/user-info.component';
import { EditProfileComponent } from './profile-features/edit-profile/edit-profile.component';
import { ExitConfirmationComponent } from './shared/exit-confirmation/exit-confirmation.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faLinkedin, faFacebookSquare, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { BasicAuthHttpInterceptorService } from './basic-auth-http-interceptor.service';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { PaginationComponent } from './pagination/pagination.component';
import { EditAuctionPageComponent } from './edit-auction-page/edit-auction-page.component';



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
