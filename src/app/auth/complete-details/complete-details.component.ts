import { Component, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastMessageService } from '../../shared/services/toast-message.service';
import { Router } from '@angular/router';
import { LoadingService } from '../../shared/services/loading.service';
import { Subscription } from 'rxjs';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-complete-details',
  templateUrl: './complete-details.component.html',
  styleUrl: './complete-details.component.scss',
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
export class CompleteDetailsComponent {
  userDetailsForm!: FormGroup;
  FinalUserDetailsForm!: FormGroup;
  isPublic: boolean = false;
  otpSent: boolean = false;
  isPrivate: boolean = false;
  isEmailPrivate: boolean = false;
  isNamePrivate: boolean = false;
  isUpiIdPrivate: boolean = false;
  isAddressPrivate: boolean = false;
  isPhonePrivate: boolean = false;
  userData: { userId:string , userName:string , name:string , userPassword:string , email:string , emailPublic:boolean , phoneNumber:string , phonePublic:boolean , upiId:string , upiPublic:boolean, address:string , addressPublic:boolean , } = { userId:'' , userName:'' , name:'' , userPassword:'1234567' , email:'' , emailPublic:false , phoneNumber:'' , phonePublic:false , upiId:'' , upiPublic:false, address:'' , addressPublic:false };

  userId!:string;
  userName!:string;
  email!:string;
  name!:string;
  user:any;






  constructor(private fb: FormBuilder, private toastMessage: ToastMessageService, private router: Router, public loadingService: LoadingService , private authService:AuthService) { }

  loadingSubscription!: Subscription;
  animationState = 'fadeIn';

  ngOnInit() {


    // this.loadingSubscription = this.loadingService.loading$.subscribe((isLoading) => {
    //   if (isLoading) {
    //     this.loadingService.showLoading(); // Show loading spinner when loading starts

    //     setTimeout(() => {
    //       // console.log('Async operation completed' , isLoading);

    //       // Hide loading spinner when the async operation is complete
    //       this.loadingService.hideLoading();
    //       this.loadingSubscription.unsubscribe();
    //     }, 5000);
    //   }
    // });

    this.userId = this.authService.getuserId();
    this.userName = this.authService.getuserName();
    this.email = this.authService.getemail();
    this.name = this.authService.getname();

    this.userDetailsForm = this.fb.group({
      nickname: [this.userId, Validators.required],
      username: [this.name, Validators.required],
      email: [this.email, [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      upiId: ['', Validators.required],
      address: ['', Validators.required],
    });




  }




  createNameControl() {
    return this.fb.group({
      nickname: this.userDetailsForm.get('nickname'),
      isPublic: true
    });
  }

  createuserNameControl() {
    return this.fb.group({
      username: this.userDetailsForm.get('username'),
      isPublic: !this.isNamePrivate
    });
  }

  createEmailControl() {
    return this.fb.group({
      email: this.userDetailsForm.get('email'),
      isPublic: !this.isEmailPrivate
    });
  }
  createPhoneControl() {
    return this.fb.group({
      phone: this.userDetailsForm.get('phone'),
      isPublic: !this.isPhonePrivate
    });
  }
  createUpiIdControl() {
    return this.fb.group({
      upiId: this.userDetailsForm.get('upiId'),
      isPublic: !this.isUpiIdPrivate
    });
  }
  createAddressControl() {
    return this.fb.group({
      address: this.userDetailsForm.get('address'),
      isPublic: !this.isAddressPrivate
    });
  }

  toggleNamePrivacy() {
    this.isNamePrivate = !this.isNamePrivate;
  }
  togglePhonePrivacy() {
    this.isPhonePrivate = !this.isPhonePrivate;
  }
  toggleEmailPrivacy() {
    this.isEmailPrivate = !this.isEmailPrivate;
  }
  toggleUpiIdPrivacy() {
    this.isUpiIdPrivate = !this.isUpiIdPrivate;
  }
  toggleAddressPrivacy() {
    this.isAddressPrivate = !this.isAddressPrivate;
  }


  onSubmit() {

    this.FinalUserDetailsForm = this.fb.group({
      nickname: this.createNameControl(),
      username: this.createuserNameControl(),
      email: this.createEmailControl(),
      phone: this.createPhoneControl(),
      upiId: this.createUpiIdControl(),
      address: this.createAddressControl(),
    });

    this.userData.userId = this.FinalUserDetailsForm.value.nickname.nickname;
    this.userData.userName = this.FinalUserDetailsForm.value.nickname.nickname;
    this.userData.address = this.FinalUserDetailsForm.value.address.address;
    this.userData.email = this.FinalUserDetailsForm.value.email.email;
    this.userData.name = this.FinalUserDetailsForm.value.username.username;
    this.userData.phoneNumber = this.FinalUserDetailsForm.value.phone.phone;
    this.userData.upiId = this.FinalUserDetailsForm.value.upiId.upiId;
    this.userData.addressPublic = this.FinalUserDetailsForm.value.address.isPublic;
    this.userData.emailPublic = this.FinalUserDetailsForm.value.email.isPublic;
    this.userData.phonePublic = this.FinalUserDetailsForm.value.phone.isPublic;
    this.userData.upiPublic = this.FinalUserDetailsForm.value.upiId.isPublic;
    console.log(this.userData);


    this.authService.updateUser(this.userData).subscribe(
      response => {
        console.log('User updated successfully:', response);
        this.toastMessage.openSnackBar('Thank you for completing your profile');
        this.router.navigate(['/signin']);
        this.authService.setemail("");
        this.authService.setname("");
        this.authService.setuserName("");
        this.authService.setuserId("");
      },
      error => {
        console.error('Error updating user:', error);
        this.toastMessage.openSnackBar(error.message);
        // Handle error, if needed
      }
    );
    // console.log('Form submitted:', this.FinalUserDetailsForm.value);
  }

  ngOnDestroy() {
    // this.loadingSubscription.unsubscribe();
  }


}
