import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionhomepageComponent } from './auctionhomepage.component';

describe('AuctionhomepageComponent', () => {
  let component: AuctionhomepageComponent;
  let fixture: ComponentFixture<AuctionhomepageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuctionhomepageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AuctionhomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
