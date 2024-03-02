import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastMessageService } from '../../shared/services/toast-message.service';
import { Observable } from 'rxjs';
import { LoadingService } from '../../shared/services/loading.service';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { AuthService } from '../../shared/services/auth.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { customIcon } from '../../ui/icons';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'], // Fix this line to styleUrls instead of styleUrl
  animations: [
    trigger('fadeInAnimation', [
      state('fadeIn', style({ opacity: 1, transform: 'translateY(0)' })),
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-50px)' }),
        animate('300ms ease'),
      ]),
    ]),
  ],
})
export class SignupComponent {
  signupForm: FormGroup;
  showPassword: boolean = false;
  animationState = 'fadeIn';
  isLoading!: Observable<boolean>;
  user: {
    userName: string;
    email: string;
    userPassword: string;
    admin: boolean;
    userId: string;
    name: string;
  } = {
    userName: '',
    email: '',
    userPassword: '',
    admin: false,
    userId: '',
    name: '',
  };
  mainlogo: string = customIcon.logo;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastMessageService: ToastMessageService,
    private loadingService: LoadingService,
    private authService: AuthService,
    private sanitizer: DomSanitizer
  ) {
    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required], // Add this line for confirmPassword
    }, { validators: this.passwordMatchValidator });
  }

  goBackToHome() {
    this.animationState = 'fadeOut';
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 300);
  }

  generateRandomString(length: number): string {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  generateNickname(username: string): string {
    const timestamp = new Date().getTime().toString();
    const randomString = this.generateRandomString(5);
    return username + '-' + timestamp + '-' + randomString;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  get username() {
    return this.signupForm.get('username');
  }

  get email() {
    return this.signupForm.get('email');
  }

  get password() {
    return this.signupForm.get('password');
  }

  get confirmPassword() {
    return this.signupForm.get('confirmPassword');
  }

  onSubmit() {
    if (this.signupForm.valid) {
      this.user.email = this.signupForm.value.email;
      this.user.userPassword = this.signupForm.value.password;
      this.user.name = this.signupForm.value.username;
      this.user.userId = this.generateNickname(
        this.user.name.substring(
          0,
          this.user.name.indexOf(' ') < 0 ? 5 : this.user.name.indexOf(' ')
        )
      );
      this.user.userName = this.user.userId;

      this.authService.setuserId(this.user.userId);
      this.authService.setuserName(this.user.userId);
      this.authService.setemail(this.user.email);
      this.authService.setname(this.user.name);

      this.authService.register(this.user).subscribe(
        (response) => {
          console.log('Registration successful', response);
          this.toastMessageService.openSnackBar('Thank you registering');
          this.isLoading = this.loadingService.loading$;
          this.router.navigate(['/complete-details']);
        },
        (error) => {
          console.error('Registration failed', error);
          this.toastMessageService.openSnackBar('Some error occurred');
        }
      );
    }
  }

  getIconContent(icon: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(icon);
  }

  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ 'passwordMismatch': true });
      return { 'passwordMismatch': true };
    }
    return null;
  }
}
