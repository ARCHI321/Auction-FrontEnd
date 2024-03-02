import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAuctionHistoryComponent } from './my-auction-history.component';

describe('MyAuctionHistoryComponent', () => {
  let component: MyAuctionHistoryComponent;
  let fixture: ComponentFixture<MyAuctionHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyAuctionHistoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyAuctionHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
