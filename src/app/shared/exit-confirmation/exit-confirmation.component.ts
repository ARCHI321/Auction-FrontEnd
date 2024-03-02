import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-exit-confirmation',
  templateUrl: './exit-confirmation.component.html',
  styleUrl: './exit-confirmation.component.scss'
})
export class ExitConfirmationComponent {
  @Output() exitConfirmed = new EventEmitter<boolean>();

  confirmExit(): void {
    this.exitConfirmed.emit(true);
  }

  cancelExit(): void {
    this.exitConfirmed.emit(false);
  }
}
