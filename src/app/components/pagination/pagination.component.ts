import { Component, EventEmitter, Input, OnChanges, SimpleChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent implements OnChanges {
  @Output() pageSize = new EventEmitter<number>();
  @Output() activePage = new EventEmitter<number>();

  @Input() totalRecord = 0;
  @Input() itemsPerPage = 10;
  @Input() currentPage = 1;

  totalPages = 0;
  pages: (number | string)[] = [];
  pageSizes = [10, 20, 50];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['totalRecord'] || changes['itemsPerPage'] || changes['currentPage']) {
      this.calculateTotalPages();
      this.setPages();
    }
  }

  private calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.totalRecord / this.itemsPerPage) || 1;
  }

  changePageSize(size: number) {
    this.pageSize.emit(size);
  }

  prev() {
    if (this.currentPage > 1) {
      this.activePage.emit(this.currentPage - 1);
    }
  }

  next() {
    if (this.currentPage < this.totalPages) {
      this.activePage.emit(this.currentPage + 1);
    }
  }

  onPageChange(page: number | string) {
    if (typeof page === 'number' && page >= 1 && page <= this.totalPages) {
      this.activePage.emit(page);
    }
  }

  private setPages(): void {
    this.pages = [];
    const maxPages = 4;

    if (this.totalPages <= maxPages + 2) {
      this.showAllPages();
    } else {
      const startPages = this.getStartPages();
      const endPages = this.getEndPages();
      const middlePages = this.getMiddlePages(maxPages);
      this.pages = [...startPages, ...middlePages, ...endPages];
    }
  }

  private showAllPages(): void {
    for (let i = 1; i <= this.totalPages; i++) {
      this.pages.push(i);
    }
  }

  private getStartPages(): number[] {
    return [1];
  }

  private getEndPages(): number[] {
    return [this.totalPages];
  }

  private getMiddlePages(maxPages: number): (number | string)[] {
    let middlePages: (number | string)[] = [];

    if (this.currentPage <= maxPages) {
      for (let i = 2; i <= maxPages + 1; i++) {
        middlePages.push(i);
      }
      middlePages.push('...');
    } else if (this.currentPage > this.totalPages - maxPages) {
      middlePages.push('...');
      for (let i = this.totalPages - maxPages; i < this.totalPages; i++) {
        middlePages.push(i);
      }
    } else {
      middlePages.push('...');
      for (let i = this.currentPage - 1; i <= this.currentPage + 1; i++) {
        middlePages.push(i);
      }
      middlePages.push('...');
    }

    return middlePages;
  }
}
