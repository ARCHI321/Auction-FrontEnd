import { Component } from '@angular/core';
import { LoadingService } from '../services/loading.service';
import { Subscription } from 'rxjs/internal/Subscription';


@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrl: './loading-spinner.component.scss'
})
export class LoadingSpinnerComponent {

  constructor(private  loadingService: LoadingService ) {}
  loadingSubscription!: Subscription;
  ngOnInit(){
    // this.loadingSubscription = this.loadingService.loading$.subscribe((isLoading) => {
    //   if (isLoading) {
    //     this.loadingService.showLoading(); // Show loading spinner when loading starts

    //     setTimeout(() => {
    //     // console.log('Async operation completed');

    //     // Hide loading spinner when the async operation is complete
    //       this.loadingService.hideLoading();
    //       this.loadingSubscription.unsubscribe();
    //     }, 5000);
    //   }
    // });
  }

  ngOnDestroy(){
    // this.loadingSubscription.unsubscribe();
  }
}
