import { Component, EventEmitter, Output } from '@angular/core';
import { LoadingService } from '../../shared/services/loading.service';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {
  constructor(private  loadingService: LoadingService , private router: Router) {}
  // isLoading!: Observable<boolean>;
  isLoading:boolean = true;

  formData = {
    name: '',
    email: '',
    message: ''
  };

  submitForm() {
    // Handle form submission logic here
    console.log('Form submitted:', this.formData);
    // You can send the form data to a backend server or perform any other actions
  }


  ngOnInit() {
    // console.log(this.isLoading);

    // this.isLoading = this.loadingService.loading$;
    // console.log(this.isLoading);

    setTimeout(()=>{
      this.isLoading = false;
    },3000);
    // console.log(this.isLoading);


    // console.log(this.loadingService.loading$);
  }





}
