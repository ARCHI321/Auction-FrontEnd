import { Component } from '@angular/core';
import { AuctionService } from '../auction.service';

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
    const userId = 'user123';
    // this.auctionService.getRegisteredAuctions(userId).subscribe(data => {
    //   this.registeredAuctions = data;
    // });
    this.registeredAuctions = this.auctionService.getRegisteredAuctions(userId);
    this.backLocation = "bid-home-page";
  }
}
