import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastMessageService } from '../../shared/services/toast-message.service';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss',
  animations: [
    trigger('fadeInAnimation', [
      state('fadeIn', style({ opacity: 1, transform: 'translateY(0)' })), // Default state
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-50px)' }), // Initial state
        animate('300ms ease')
      ]),
      transition('* => void', [
        animate('300ms ease', style({ opacity: 0, transform: 'translateY(-50px)' })) // Fade-out animation
      ])
    ])
  ]

})
export class SigninComponent {
  signinForm: FormGroup;
  showPassword: boolean = false;
  animationState = 'fadeIn'; // Initial animation state
  user:{ username:string , password:string} = {username:'' ,password :'' }
  signinSubscription!: Subscription;
  isLoggedIn!:boolean;
  response:any;
  error:any;



  constructor(private fb: FormBuilder , private toastMessage:ToastMessageService , private router: Router , private authService: AuthService) {
    this.signinForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      selectedRole : ['', Validators.required],
    });
  }

  goBackToHome() {
    this.animationState = 'fadeOut';
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 300);

  }

  get username() {
    return this.signinForm.get('username');
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }


  get password() {
    return this.signinForm.get('password');
  }

  get role() {
    return this.signinForm.get('selectedRole');
  }

  login(role: string, user: any) {
    this.authService.login(role, user)
      .then((response: any) => {
        console.log('Login successful', response);
        this.response = response;
        this.signinSubscription = this.authService.isAuthenticated.subscribe((loggedIn: boolean) => {
          this.isLoggedIn = loggedIn;

        });

        if (this.signinForm.value.selectedRole === "auctionner" && response.authenticated && this.isLoggedIn) {
          this.toastMessage.openSnackBar('Welcome');
          this.router.navigate(['/auction-items']);
        } else if (this.signinForm.value.selectedRole === "bidder" && response.authenticated && this.isLoggedIn) {
          this.toastMessage.openSnackBar('Welcome');
          this.router.navigate(['/bid-home-page']);
        } else {
          this.toastMessage.openSnackBar(response.message);
        }

        this.signinSubscription = this.authService.isAuthenticated.subscribe((loggedIn: boolean) => {
          this.isLoggedIn = loggedIn;
        });
      })
      .catch((error: any) => {
        console.error('Login failed', error);
        this.error = error;
      });
  }

  onSubmit() {
    if (this.signinForm.valid) {
      // Implement your sign-in logic here
      console.log('Sign-in successful!', this.signinForm.value);
      this.user.password = this.signinForm.value.password;
      this.user.username = this.signinForm.value.username;
      this.login(this.signinForm.value.selectedRole , this.user);
      console.log(this.response , this.error);


    }
  }

  forgotPassword() {
    // Implement functionality for forgot password
    // This can include displaying a modal or navigating to a forgot password page
    // alert('Forgot Password functionality is not implemented yet.');
  }
}
