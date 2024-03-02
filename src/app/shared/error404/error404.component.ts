import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error404',
  templateUrl: './error404.component.html',
  styleUrl: './error404.component.scss'
})
export class Error404Component {

  constructor(private authService:AuthService, private router:Router){}


  ngOnInit(){

    setTimeout(() =>{
      this.router.navigateByUrl('/');

    },5000);
    this.authService.logout();

  }

  GoToHomePage(){
    this.router.navigateByUrl('/');
    this.authService.logout();
  }

}
