import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'customTimeFormat' })
export class CustomTimeFormatPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) {
      return ''; // Handle empty values gracefully
    }

    const [hours] = value.split(':'); // Split the time string using colon (':')

    if (!hours) {
      console.warn(`Invalid time format: ${value}. Expected format: HH:mm:ss`); // Warn about invalid format
      return ''; // Handle invalid format gracefully
    }

    let formattedHour = parseInt(hours, 10) % 12 || 12; // Handle midnight (00) as 12 AM
    const amPm = parseInt(hours, 10) >= 12 ? 'PM' : 'AM';

    return `${formattedHour} ${amPm}`;
  }
}
