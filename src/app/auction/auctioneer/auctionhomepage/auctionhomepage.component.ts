import { Component, Inject, ViewChild } from '@angular/core';
import { log } from 'console';
import { AuthService } from '../../../shared/services/auth.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { DataService } from '../../../shared/services/data.service';
import {
  AUCTION_SERVICE_TOKEN,
  AuctionService,
} from '../../../shared/services/auction.service';
import { Subscription, forkJoin } from 'rxjs';
import { NgForm } from '@angular/forms';
import { ToastMessageService } from '../../../shared/services/toast-message.service';
import { DatePipe } from '@angular/common';

interface AuctionItem {
  name: string;
  description: string;
  startingPrice: number;
  image: File | null;
  date: any;
  category: string;
  slot: number;
  auctionType: string;
  registerFee: number;
}

@Component({
  selector: 'app-auctionhomepage',
  templateUrl: './auctionhomepage.component.html',
  styleUrl: './auctionhomepage.component.scss',
})
export class AuctionhomepageComponent {
  newItem: AuctionItem = {
    name: '',
    description: '',
    startingPrice: 0,
    image: null,
    date: '',
    category: '',
    slot: 0,
    auctionType: '',
    registerFee: 0,
  };

  auctionItems: AuctionItem[] = [];
  selectedDateTime!: string;
  isLoading: boolean = true;
  justLoggedIn!: boolean;
  responseData: any;
  categories: string[] = [];
  selectedCategory: string = '';
  minDate: string = new Date().toISOString().split('T')[0];
  allAuctionTypes: string[] = [];
  selectAuctionType: string = '';
  selectDate: any;
  isAuctionTypeSelected: boolean = false;
  isDateSelected: boolean = false;
  selectedSlot: number = 0;
  // slotStatus!: {status:string , start_time:any , end_time:any}[];
  slotStatus: any[] = [];
  slotTiming: { slotNumber: number; start_time: Date; end_time: Date }[] = [];
  @ViewChild('itemForm') itemForm!: NgForm;
  isSlotSelected: boolean = false;
  timingForSlot: any;
  private subscriptions: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private dataService: DataService,
    @Inject(AUCTION_SERVICE_TOKEN) private auctionService: AuctionService,
    private toastMessageService: ToastMessageService,
    private datePipe: DatePipe
  ) {
    this.justLoggedIn = authService.getJustLoggedIn();

    this.subscriptions.push(
      this.auctionService.getAllCategories().subscribe(
        (response: any) => {
          this.categories = response;
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
      )
    );

    this.subscriptions.push(
      this.auctionService.getAllAuctionTypes().subscribe(
        (response: any) => {
          this.allAuctionTypes = response;
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
      )
    );
  }

  ngOnInit() {
    setTimeout(() => {
      this.isLoading = false;
    }, 3000);
    this.authService.setJustLoggedIn(false);

    setTimeout(() => {
      const userId = sessionStorage.getItem('username');

      if (userId !== null) {
        this.authService.getUserById(userId).subscribe(
          (response: any) => {
            // Handle successful response
            console.log('User:', response);
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
    }, 5000);

    const numberOfSlots = 8;
    const baseHour = 9;

    for (let i = 0; i < numberOfSlots; i++) {
      const startHour = baseHour + i;
      const endHour = startHour + 1;

      const startDate = new Date();
      startDate.setHours(startHour, 0, 0);

      const endDate = new Date();
      endDate.setHours(endHour, 0, 0);

      const newSlotTiming = {
        slotNumber: i + 1,
        start_time: startDate,
        end_time: endDate,
      };

      this.slotTiming.push(newSlotTiming);
    }

    console.log(this.slotTiming);
  }

  showSelectedCategory() {
    // Handle the selected category as needed
    console.log('Selected category:', this.newItem.category);
  }
  showSelectedAuctionType() {
    // Handle the selected category as needed
    console.log('Selected category:', this.newItem.auctionType);
  }
  showSelectedSlot() {
    this.isSlotSelected = true;
    this.timingForSlot = this.slotTiming.find(
      (slot) => slot.slotNumber === +this.newItem.slot
    );
  }

  onDateSelected() {
    console.log(this.isDateSelected);

    console.log('Selected Date:', this.newItem.date);

    console.log(this.isDateSelected);

    const observables = [];

    for (var i = 1; i <= 8; i++) {
      observables.push(this.auctionService.getSlotStatus(this.newItem.date, i));
    }

    forkJoin(observables).subscribe(
      (responses: any[]) => {
        this.slotStatus = responses;

        for (var i = 0; i < this.slotStatus.length; i++) {
          const istimeExpired = this.isPastStartTime(this.slotStatus[i]);
          this.slotStatus[i].istimeExpired = istimeExpired;
        }
        console.log('slot from db: ', this.slotStatus);
        this.isDateSelected = true;
      },
      (error: any) => {
        // Log additional information about the error
        console.error('Error:', error);
        console.error('Error details:', error.error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
      }
    );
  }

  onAuctionTypeSelected() {
    this.isAuctionTypeSelected = true;
  }

  isPastStartTime(slotStatus: any): boolean {
    const correspondingFrontendSlot = this.slotTiming.find(
      (slot) => slot.slotNumber === slotStatus.slotNumber
    );
    console.log(correspondingFrontendSlot);

    if (correspondingFrontendSlot) {
      const currentDateTime = new Date();
      const startDateTime = new Date(correspondingFrontendSlot.start_time);
      const selectedDate = new Date(this.newItem.date);

      const isSameDate =
        startDateTime.getFullYear() === currentDateTime.getFullYear() &&
        startDateTime.getMonth() === currentDateTime.getMonth() &&
        startDateTime.getDate() === currentDateTime.getDate();

      const isSelectedDateIsAlsoSameDate = {
        isSelectedDateSameDate:
          selectedDate.getFullYear() === currentDateTime.getFullYear() &&
          selectedDate.getMonth() === currentDateTime.getMonth() &&
          selectedDate.getDate() === currentDateTime.getDate(),
      };

      const currentTime =
        currentDateTime.getHours() * 3600 +
        currentDateTime.getMinutes() * 60 +
        currentDateTime.getSeconds();
      const startTime =
        startDateTime.getHours() * 3600 +
        startDateTime.getMinutes() * 60 +
        startDateTime.getSeconds();

      return (
        isSameDate &&
        startTime < currentTime &&
        isSelectedDateIsAlsoSameDate.isSelectedDateSameDate
      );
    }

    return false;
  }

  postItem() {
    if (this.isAnyRequiredFieldBlank() || !this.itemForm.valid) {
      this.itemForm.form.setErrors({ invalidFields: true });
      this.toastMessageService.openSnackBar('Please fill all the fields');
    } else {
      const formData = new FormData();
      formData.append('title', this.newItem.name);
      formData.append('description', this.newItem.description);
      formData.append('startingPrice', String(this.newItem.startingPrice));
      formData.append('category', this.newItem.category);
      formData.append('registerFee', String(this.newItem.registerFee));
      formData.append('date', this.newItem.date);
      formData.append('slotNumber', String(this.newItem.slot));
      if (this.newItem.image !== null) {
        formData.append('file', this.newItem.image);
      }
      formData.append('auctionType', this.newItem.auctionType);
      formData.append('sellerId', String(sessionStorage.getItem('username')));

      this.subscriptions.push(
        this.auctionService.createAuctionItem(formData).subscribe(
          (responses: any[]) => {
            console.log(responses);
            this.toastMessageService.openSnackBar(
              'Auction Item submitted successfully'
            );
          },
          (error: any) => {
            // Handle error
            console.error('Error:', error);
            this.toastMessageService.openSnackBar(error.error.message);
          }
        )
      );

      this.newItem = {
        name: '',
        description: '',
        startingPrice: 0,
        image: null,
        date: '',
        slot: 0,
        auctionType: '',
        registerFee: 0,
        category: '',
      };
      this.isSlotSelected = false;
    }
  }

  private isAnyRequiredFieldBlank(): boolean {
    console.log(this.itemForm);
    console.log(this.itemForm.valid);
    return (
      (this.itemForm &&
        this.itemForm.controls['itemName']?.hasError('required')) ||
      (this.itemForm.controls['itemDescription']?.invalid &&
        this.itemForm.controls['itemDescription']?.touched) ||
      this.itemForm.controls['startingPrice']?.hasError('required') ||
      this.itemForm.controls['selectedCategory']?.hasError('required') ||
      this.itemForm.controls['selectAuctionType']?.hasError('required') ||
      this.itemForm.controls['itemImage']?.hasError('required') ||
      this.itemForm.controls['datetime']?.hasError('required') ||
      this.itemForm.controls['selectSlot']?.hasError('required') ||
      false
    );
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    console.log('Image selected : ', this.newItem.image);
    this.newItem.image = file;
    console.log('Image selected : ', this.newItem.image);
  }

  validateAmount() {
    if (this.newItem.startingPrice < 1000) {
      this.newItem.startingPrice = 1000;
    }
  }

  ngOnDestroy() {
    // Unsubscribe from all subscriptions in the array
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }
}
