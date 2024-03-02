import { Component } from '@angular/core';
import { DataService } from '../../data.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.scss'
})
export class UserInfoComponent {
  user = {
    fullName: 'John Doe',
    email: 'john@example.com',
    password: ''
  };

  receivedData :any;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.data$.subscribe(data => this.receivedData = data);

    console.log(this.receivedData);


  }
}
