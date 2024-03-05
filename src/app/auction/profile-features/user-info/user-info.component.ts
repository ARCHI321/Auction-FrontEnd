// user-info.component.ts

import { Component } from '@angular/core';
import { DataService } from '../../../shared/services/data.service';
import { AuthService } from '../../../shared/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.scss',
})
export class UserInfoComponent {
  receivedData: any;

  constructor(private dataService: DataService, private authService: AuthService) {}

  ngOnInit() {
    const userId = sessionStorage.getItem('username');
    if (userId !== null) {
      this.authService.getUserDataById(userId).subscribe(
        (response: any) => {
          console.log('UserData:', response);
          this.receivedData = response;
          this.dataService.sendData(this.receivedData);
        },
        (error: any) => {
          console.error('Error:', error);
          if (error instanceof HttpErrorResponse) {
            console.log('Response Headers:', error.headers.keys());
            const authorizationHeader = error.headers.get('Authorization');
            if (authorizationHeader) {
              console.log('Authorization Header:', authorizationHeader);
            } else {
              console.log('No Authorization Header found.');
            }
          }
        }
      );
    } else {
      console.error('User ID is null.');
    }
  }
}
