import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastMessageService } from '../toast-message.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
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
export class ForgotPasswordComponent {
  signinForm: FormGroup;
  showOldPassword: boolean = false;
  showNewPassword: boolean = false;
  animationState = 'fadeIn'; // Initial animation state
  user:{ username:string , oldPassword:string , newPassword:string} = {username:'' ,oldPassword :'' ,newPassword:''}
  signinSubscription!: Subscription;
  isLoggedIn!:boolean;
  response:any;
  error:any;



  constructor(private fb: FormBuilder , private toastMessage:ToastMessageService , private router: Router , private authService: AuthService) {
    this.signinForm = this.fb.group({
      username: ['', Validators.required],
      oldPassword: ['', Validators.required],
      newPassword : ['', Validators.required],
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

  toggleOldPasswordVisibility() {
    this.showOldPassword = !this.showOldPassword;
  }
  toggleNewPasswordVisibility() {
    this.showNewPassword = !this.showNewPassword;
  }


  get oldPassword() {
    return this.signinForm.get('oldPassword');
  }
  get newPassword() {
    return this.signinForm.get('newPassword');
  }

  get role() {
    return this.signinForm.get('selectedRole');
  }



  onSubmit() {
    if (this.signinForm.valid) {
      // Implement your sign-in logic here
      console.log('Sign-in successful!', this.signinForm.value);
      this.user.oldPassword = this.signinForm.value.oldPassword;
      this.user.newPassword = this.signinForm.value.newPassword;
      this.user.username = this.signinForm.value.username;


      this.authService.forgotPassword(this.user)
      .subscribe(
        response => {
          console.log('Password Changed successfully', response);
          this.toastMessage.openSnackBar('Password Changed successfully');
          this.router.navigate(['/signin']);
        },
        error => {
          console.error('Registration failed', error);
          this.toastMessage.openSnackBar(error.error.text);
        }
      );


    }
  }

  forgotPassword() {
    // Implement functionality for forgot password
    // This can include displaying a modal or navigating to a forgot password page
    alert('Forgot Password functionality is not implemented yet.');
  }
}
