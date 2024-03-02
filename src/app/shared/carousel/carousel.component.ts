import { Component } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss',
  // animations: [
  //   trigger('carouselAnimation', [
  //     transition('void => *', [
  //       style({ transform: 'translateX(-100%)' }),
  //       animate('1s ease-in-out')
  //     ]),
  //     transition('* => void', [
  //       animate('1s ease-in-out', style({ transform: 'translateX(100%)' }))
  //     ])
  //   ])
  // ]
})
export class CarouselComponent {

  // images = [
  //   { src: 'assets/images/pic1.jpg', alt: '' },
  //   { src: 'assets/images/pic2.jpg', alt: '' },
  //   { src: 'assets/images/pic3.jpg', alt: '' },
  //   { src: 'assets/images/pic4.jpg', alt: '' }
  // ];
  // currentIndex = 0;

  // ngOnInit(): void {
  //   setInterval(() => {
  //     this.currentIndex = (this.currentIndex + 1) % this.images.length;
  //   }, 3000);
  // }

}
