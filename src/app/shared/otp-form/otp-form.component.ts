import { Component } from '@angular/core';
import { OtpService } from './../services/otp.service';

@Component({
  selector: 'app-otp-form',
  templateUrl: './otp-form.component.html',
  styleUrl: './otp-form.component.scss'
})
export class OtpFormComponent {
  otp!: string;
  constructor(private otpService:OtpService){}
  submitOtp() {
    this.otpService.sendData(this.otp);
    console.log('OTP submitted:',this.otp);
    this.otp = '';
  }
}
