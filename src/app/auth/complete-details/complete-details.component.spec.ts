import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteDetailsComponent } from './complete-details.component';

describe('CompleteDetailsComponent', () => {
  let component: CompleteDetailsComponent;
  let fixture: ComponentFixture<CompleteDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompleteDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CompleteDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
