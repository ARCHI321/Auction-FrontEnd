import { Component } from '@angular/core';
import { AuctionService } from '../../../shared/services/auction.service';

@Component({
  selector: 'app-registeredauctions',
  templateUrl: './registeredauctions.component.html',
  styleUrl: './registeredauctions.component.scss'
})
export class RegisteredauctionsComponent {
  registeredAuctions!: any[];
  backLocation!:string ;

  constructor(private auctionService: AuctionService) { }

  ngOnInit(): void {
    const userId = sessionStorage.getItem('username');

    this.auctionService.registeredAuctionsForUser(userId!, 1).subscribe(
      (response: any) => {
        if (response && response.content) {
          console.log(response.content);
          this.registeredAuctions = [];
          this.registeredAuctions = [...response.content];
        } else {
          console.error('Invalid response or response content is undefined.');
        }
      },
      (error: any) => {
        console.error(error);
      }
    );

  }
}
