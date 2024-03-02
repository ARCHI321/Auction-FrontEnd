import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisteredauctionsComponent } from './registeredauctions.component';

describe('RegisteredauctionsComponent', () => {
  let component: RegisteredauctionsComponent;
  let fixture: ComponentFixture<RegisteredauctionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisteredauctionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegisteredauctionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
