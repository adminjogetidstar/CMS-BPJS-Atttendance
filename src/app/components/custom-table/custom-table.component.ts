import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { ActionTexts, ITableConfig, TdTypes } from './custom-table.type';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-custom-table',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './custom-table.component.html',
  styleUrl: './custom-table.component.scss',
  providers: []
})
export class CustomTableComponent {
  fa = {
    faEdit
  };

  TdTypes = TdTypes;
  ActionTexts = ActionTexts;

  _selected: any[] = [];
  sortOrder: 'asc' | 'desc' = 'asc';

  @Input() tableData: readonly any[] = [];

  @Input()
  tableConfigs: ITableConfig[] = [];

  @Input()
  isLoading: boolean | any;

  @Output()
  // onActionClick: EventEmitter<void> = new EventEmitter<void>();
  onActionClick: EventEmitter<{ action: string, data: any }> = new EventEmitter<{ action: string, data: any }>();

  @Output()
  onSelectionChange: EventEmitter<any[]> = new EventEmitter<any[]>();


  constructor(
  ) {
  }


  isAllSelected() {
    const numSelected = this.selected.length;
    const numRows = this.tableData.length;
    return (numSelected === numRows) && (numRows != 0);
  }

  toggleSelectAll() {
    if (this.isAllSelected()) {
      this._selected = [];
    } else {
      this.tableData.forEach(row => this.select(row));
    }
    this.onSelectionChange.emit(this.selected);
  }

  toggleSelect(row: any) {
    if (this.isSelected(row)) {
      this._selected = this._selected.filter(selectedRow => selectedRow !== row);
    } else {
      this._selected.push(row);
    }
    this.onSelectionChange.emit(this.selected);
  }

  isSelected(row: any): boolean {
    return this._selected.includes(row);
  }

  select(row: any) {
    if (!this.isSelected(row)) {
      this._selected.push(row);
    }
  }

  get selected(): any[] {
    return this._selected;
  }

  deliveryStatus(data: string): string {
    if (data === 'DELIVERY_FAILED') {
      return 'Gagal'
    } else if (data === 'DELIVERY_PREPARATION') {
      return 'Harus disiapkan'
    } else if (data === 'DELIVERY_SUCCESS') {
      return 'Sudah diterima'
    } else if (data === 'DELIVERY_PROCESS') {
      return 'Sedang diantar'
    } else if (data === 'DELIVERY_READY') {
      return 'Siap diantar'
    } else {
      return ''
    }
  }

  actionClickHandle(action: string, data: any) {
    this.onActionClick.emit({ action, data });
  }

  getStatusText(status: number): string {
    return status === 1 ? 'Aktif' : 'Tidak Aktif';
  }

  clearSelection() {
    this._selected = [];
    this.onSelectionChange.emit(this._selected);
  }

  getKewenanganText(kewenangan: { cluster: string }[]): string[] {
    if (!Array.isArray(kewenangan) || kewenangan.length === 0) return ['-'];
    return kewenangan.map(k => `${k.cluster}`);
  }

  getValue(data: any, fieldPath: string): any {
    const value = fieldPath.split('.').reduce((obj, key) => obj?.[key], data);
    if (fieldPath === 'profile_photo') {
      return value || null;
    }
    return value;
  }

}
