import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'auction-frontend';
  isHomePage: boolean = false;
  footerStyles: { [key: string]: string } = {
    width: '100%',
    bottom: '0'
  };

  constructor(private router: Router) {


  }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Check if the current route is the home page
        this.isHomePage = event.url === '/';
      }
    });

    sessionStorage.clear();
  }
}
