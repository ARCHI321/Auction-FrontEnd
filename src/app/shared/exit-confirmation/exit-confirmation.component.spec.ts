import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExitConfirmationComponent } from './exit-confirmation.component';

describe('ExitConfirmationComponent', () => {
  let component: ExitConfirmationComponent;
  let fixture: ComponentFixture<ExitConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExitConfirmationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExitConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
