import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BidhomepageComponent } from './bidhomepage.component';

describe('BidhomepageComponent', () => {
  let component: BidhomepageComponent;
  let fixture: ComponentFixture<BidhomepageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BidhomepageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BidhomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
