import { Component, EventEmitter, Output } from '@angular/core';
import { LoadingService } from '../../shared/services/loading.service';
import { Router } from '@angular/router';
interface Item {
  description: string;
  imageUrl: string;
  title: string;
  basePrice: number;
  countdown: number;
}
@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export class LandingComponent {
  constructor(private loadingService: LoadingService, private router: Router) {}
  isLoading: boolean = true;

  formData = {
    name: '',
    email: '',
    message: '',
  };

  submitForm() {
    console.log('Form submitted:', this.formData);
  }

  ngOnInit() {
    setTimeout(() => {
      this.isLoading = false;
    }, 3000);
  }

  items: Item[] = [
    {
      imageUrl: 'https://i.imgur.com/7mAPL6a.jpg',
      title: 'Title 1',
      basePrice: 100000,
      countdown: 15,
      description:
        'lorem ipsum dolor sit amet lore m earum et justo so simple and accurate',
    },
    {
      imageUrl: 'https://i.imgur.com/K7A78We.jpg',
      title: 'Title 2',
      description:
        'lorem ipsum dolor sit amet lore m earum et justo so simple and accurate',
      basePrice: 100000,
      countdown: 15,
    },
    {
      imageUrl: 'https://i.imgur.com/l3ogBgn.jpg',
      title: 'Title 3',
      basePrice: 100000,
      countdown: 15,
      description:
        'lorem ipsum dolor sit amet lore m earum et justo so simple and accurate',
    },
    {
      imageUrl: 'https://i.imgur.com/K7A78We.jpg',
      title: 'Title 4',
      basePrice: 100000,
      countdown: 15,
      description:
        'lorem ipsum dolor sit amet lore m earum et justo so simple and accurate',
    },
    {
      imageUrl: 'https://i.imgur.com/K7A78We.jpg',
      title: 'Title 5',
      basePrice: 100000,
      countdown: 15,
      description:
        'lorem ipsum dolor sit amet lore m earum et justo so simple and accurate',
    },
  ];
}
