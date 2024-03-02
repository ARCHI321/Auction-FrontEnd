import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { DataService } from './../../data.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { ToastMessageService } from '../../toast-message.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss',
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
export class EditProfileComponent {
  profileForm!: FormGroup;
  responseData: any;
  receivedData:any;
  isLoading:boolean = true;
  userData: { userId:string , userName:string , name:string , userPassword:string , email:string , emailPublic:boolean , phoneNumber:string , phonePublic:boolean , upiId:string , upiPublic:boolean, address:string , addressPublic:boolean , } = { userId:'' , userName:'' , name:'' , userPassword:'1234567' , email:'' , emailPublic:false , phoneNumber:'' , phonePublic:false , upiId:'' , upiPublic:false, address:'' , addressPublic:false };

  isEmailPrivate: boolean = false;
  isNamePrivate: boolean = false;
  isUpiIdPrivate: boolean = false;
  isAddressPrivate: boolean = false;
  isPhonePrivate: boolean = false;
  animationState = 'fadeIn';


  constructor(private fb: FormBuilder,private authService:AuthService,private dataService:DataService,private toastMessage: ToastMessageService,private router:Router,private cdr: ChangeDetectorRef) {
    const userId = sessionStorage.getItem('username');
      // Process form submission
      if (userId !== null) {
        this.authService.getUserDataById(userId).subscribe(
          (response: any) => {
            // Handle successful response
            console.log('UserData:', response);
            this.responseData = response;
            this.dataService.sendData(this.responseData);
          },
          (error: any) => {
            // Handle error
            console.error('Error:', error);
            if (error instanceof HttpErrorResponse) {
              console.log('Response Headers:', error.headers.keys());
              const authorizationHeader = error.headers.get('Authorization');
              if (authorizationHeader) {
                   console.log('Authorization Header:', authorizationHeader);
              } else {
                    console.log('No Authorization Header found.');
              }
            }
          }
        );
      } else {
        console.error('User ID is null.');
      }
  }

  ngOnInit() {

    setTimeout(() => {
      // Subscribe to dataService to get receivedData
      this.dataService.data$.subscribe(data => {
        this.receivedData = data;

        // Initialize profileForm with receivedData
        this.profileForm = this.fb.group({
          fullName: [this.receivedData.name, Validators.required],
          userName: [this.receivedData.userName, Validators.required],
          email: [this.receivedData.email, [Validators.required, Validators.email]],
          phone: [this.receivedData.phoneNumber, [Validators.required, Validators.pattern(/^\d{10}$/)]],
          upiId: [this.receivedData.upiId, Validators.required],
          address: [this.receivedData.address, Validators.required],
        });

        this.isAddressPrivate = this.receivedData.addressPublic;
        this.isPhonePrivate = this.receivedData.phonePublic;
        this.isEmailPrivate = this.receivedData.emailPublic;
        this.isUpiIdPrivate = this.receivedData.addressPublic;
        this.cdr.detectChanges();

        // Set isLoading to false now that the form is initialized
        this.isLoading = false;
      });

      // If the subscription takes longer than 5000 milliseconds, set isLoading to false
      setTimeout(() => {
        this.isLoading = false;
      }, 5000);
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


  onSubmit(){
    if (this.profileForm.valid) {
      this.userData.userId = this.profileForm.value.userName;
      this.userData.userName = this.profileForm.value.userName;
      this.userData.address = this.profileForm.value.address;
      this.userData.email = this.profileForm.value.email;
      this.userData.name = this.profileForm.value.fullName;
      this.userData.phoneNumber = this.profileForm.value.phone;
      this.userData.upiId = this.profileForm.value.upiId;
      this.userData.addressPublic = this.isAddressPrivate;
      this.userData.emailPublic = this.isEmailPrivate;
      this.userData.phonePublic = this.isPhonePrivate;
      this.userData.upiPublic = this.isPhonePrivate;
      this.userData.upiPublic = this.isPhonePrivate;
      console.log(this.profileForm);


      this.authService.updateUser(this.userData).subscribe(
        response => {
          console.log('User updated successfully:', response);
          this.toastMessage.openSnackBar('Profile edited succesfully');
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
    }
  }
}
