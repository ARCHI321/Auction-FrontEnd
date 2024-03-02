import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent {
  @Input() pageSize = 10;
  @Input() totalItems = 0;
  @Input() currentPage = 1;
  @Output() pageChange = new EventEmitter<number>();

  totalPages(): number[] {
    const total = Math.ceil(this.totalItems / this.pageSize);
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  onPageClick(page: number): void {
    this.pageChange.emit(page);
  }
}
