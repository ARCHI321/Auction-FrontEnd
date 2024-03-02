import { Component, Inject, ViewChild } from '@angular/core';
import { log } from 'console';
import { AuthService } from '../../../shared/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DataService } from '../../../shared/services/data.service';
import { AUCTION_SERVICE_TOKEN, AuctionService } from '../../../shared/services/auction.service';
import { forkJoin } from 'rxjs';
import { NgForm } from '@angular/forms';
import { ToastMessageService } from '../../../shared/services/toast-message.service';
import { ActivatedRoute, Router } from '@angular/router';

interface AuctionItem {
  name: string;
  description: string;
  startingPrice: number;
  image: File | null;
  date: any;
  category: string;
  slot: number;
  auctionType: string;
}

@Component({
  selector: 'app-edit-auction-page',
  templateUrl: './edit-auction-page.component.html',
  styleUrl: './edit-auction-page.component.scss'
})
export class EditAuctionPageComponent {
  newItem: AuctionItem = {
    name: '',
    description: '',
    startingPrice: 0,
    image: null,
    date: '',
    category: '',
    slot: 0,
    auctionType: '' ,
  };


  auctionItems: AuctionItem[] = [];
  selectedDateTime!: string;
  isLoading:boolean = true;
  justLoggedIn!:boolean;
  responseData: any;
  categories: string[] = [];
  selectedCategory: string = '';
  minDate: string = new Date().toISOString().split('T')[0];
  allAuctionTypes: string[] = [];
  selectAuctionType:string = '';
  selectDate:any;
  isDateSelected:boolean = false;
  selectedSlot:number = 0;
  // slotStatus!: {status:string , start_time:any , end_time:any}[];
  slotStatus: any[] = [];
  slotTiming: { slotNumber: number, start_time: Date, end_time: Date }[] = [];
  @ViewChild('itemForm') itemForm!: NgForm;
  isSlotSelected:boolean = false;
  timingForSlot:any;
  auctionId!:string;
  auctionvalue:any;


  constructor(private authService:AuthService , private dataService: DataService , @Inject(AUCTION_SERVICE_TOKEN) private auctionService: AuctionService , private toastMessageService:ToastMessageService,private activateRoute: ActivatedRoute,private route:Router){


    this.activateRoute.params.subscribe(params => {
      this.auctionId = params['id'];
    });
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


    this.auctionService.getAuctionItemByAuctionrid(this.auctionId).subscribe(
      (response:any) => {
        this.auctionvalue = response;
        console.log(this.auctionvalue);
        this.newItem.name = this.auctionvalue.title;
        this.newItem.description = this.auctionvalue.description;
        this.newItem.startingPrice = this.auctionvalue.startingPrice;
        this.newItem.date = this.auctionvalue.date;
        this.newItem.category = this.auctionvalue.category;

        this.newItem.auctionType = this.auctionvalue.auctionType;
        this.newItem.image = this.auctionvalue.file;
        const observables = [];

        for (var i = 1; i <= 8; i++) {
          observables.push(this.auctionService.getSlotStatus(this.newItem.date, i));
        }

        forkJoin(observables).subscribe(
          (responses: any[]) => {
              this.slotStatus = responses;
              console.log(this.slotStatus);
              this.newItem.slot = this.auctionvalue.slotNumber;
              this.isDateSelected = true;
         },
         (error: any) => {
        // Handle error
             console.error('Error:', error);
         }
       );


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


    this.auctionService.getAllCategories().subscribe(
      (response:any) => {
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

    this.auctionService.getAllAuctionTypes().subscribe(
      (response:any) => {
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




  }

  ngOnInit(){
    setTimeout(()=>{
      this.isLoading = false;
    },3000);
    this.authService.setJustLoggedIn(false);


    setTimeout(()=>{
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
    },5000);



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
  showSelectedSlot(){
    this.isSlotSelected = true;
    this.timingForSlot  = this.slotTiming.find(slot => slot.slotNumber === +this.newItem.slot);

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
        console.log(this.slotStatus);
        this.isDateSelected = true;
      },
      (error: any) => {
        // Handle error
        console.error('Error:', error);
      }
    );



    }




    editItem() {


    if (this.isAnyRequiredFieldBlank() || !this.itemForm.valid) {
      this.itemForm.form.setErrors({ 'invalidFields': true });
      this.toastMessageService.openSnackBar("Please fill all the fields");
    } else {
      console.log(this.newItem);

      const formData = new FormData();
      formData.append('title', this.newItem.name);
      formData.append('description', this.newItem.description);
      formData.append('startingPrice', String(this.newItem.startingPrice));
      formData.append('category', this.newItem.category);
      formData.append('date', this.newItem.date);
      formData.append('slotNumber', String(this.newItem.slot));
      if (this.newItem.image !== null) {
        formData.append('file', this.newItem.image);
        }
      formData.append('auctionType', this.newItem.auctionType);
      formData.append('sellerId', String(sessionStorage.getItem('username')));


    this.auctionService.editAuctionById(this.auctionId,formData).subscribe(
      (responses: any[]) => {
        console.log(responses);
        this.toastMessageService.openSnackBar("Auction Item edited successfully");
        this.newItem = {
          name: '',
          description: '',
          startingPrice: 0,
          image:null,
          date:'',
          slot:0,
          auctionType:'',
          category:''
        };
        this.isSlotSelected = false;
      },
      (error: any) => {
        // Handle error
        console.error('Error:', error);
        this.toastMessageService.openSnackBar(error.error.message);
      }
    )




  }


  }

  private isAnyRequiredFieldBlank(): boolean {

    console.log(this.itemForm);
    console.log(this.itemForm.valid);
    return (
      this.itemForm &&
      this.itemForm.controls['itemName']?.hasError('required') ||
      this.itemForm.controls['itemDescription']?.invalid && this.itemForm.controls['itemDescription']?.touched ||
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

    console.log("Image selected : " ,this.newItem.image);
    this.newItem.image = file;
    console.log("Image selected : " ,this.newItem.image);

  }
}
