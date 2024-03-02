import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAuctionPageComponent } from './edit-auction-page.component';

describe('EditAuctionPageComponent', () => {
  let component: EditAuctionPageComponent;
  let fixture: ComponentFixture<EditAuctionPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditAuctionPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditAuctionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
