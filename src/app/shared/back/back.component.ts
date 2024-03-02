import { Component, Input } from '@angular/core';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-back',
  templateUrl: './back.component.html',
  styleUrl: './back.component.scss'
})
export class BackComponent {
  @Input() backLocation!:string;
  constructor(private router:Router) { }

  goBack() {
    console.log(this.backLocation);

    this.router.navigate([`/${this.backLocation}`]);
  }
}
