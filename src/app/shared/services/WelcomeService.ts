import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WelcomeService {
  private welcomeMessageDisplayed: boolean = false;

  constructor() {}

  isWelcomeMessageDisplayed(): boolean {
    return this.welcomeMessageDisplayed;
  }

  setWelcomeMessageDisplayed(displayed: boolean): void {
    this.welcomeMessageDisplayed = displayed;
  }
}
