import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiddingpageComponent } from './biddingpage.component';

describe('BiddingpageComponent', () => {
  let component: BiddingpageComponent;
  let fixture: ComponentFixture<BiddingpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BiddingpageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BiddingpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
