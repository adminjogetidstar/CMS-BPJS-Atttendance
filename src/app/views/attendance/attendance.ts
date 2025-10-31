import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ITableConfig, TdTypes } from '../../components/custom-table/custom-table.type';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomTableComponent } from '../../components/custom-table/custom-table.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { AttendanceForm } from './attendance-form/attendance-form';
import { AttendanceService } from './services/attendance.service';
import { IFilterConfig } from '../../components/custom-filter/custom-filter.type';
import { Attendance } from './DTO/attendance.model';
import { CustomFilterComponent } from '../../components/custom-filter/custom-filter.component';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomTableComponent, PaginationComponent, CustomFilterComponent, AttendanceForm],
  templateUrl: './attendance.html',
  styleUrl: './attendance.scss',
})
export class AttendanceComponent implements OnInit {
  tableConfigs: ITableConfig[] = [
    { columnName: 'User ID', fieldName: 'user_id', tdType: TdTypes.text },
    { columnName: 'Check In', fieldName: 'check_in_time', tdType: TdTypes.dateTime },
    { columnName: 'Check Out', fieldName: 'check_out_time', tdType: TdTypes.dateTime },
    { columnName: 'In Office', fieldName: 'is_in_office', tdType: TdTypes.boolean },
    { columnName: 'Purpose ID', fieldName: 'purpose_id', tdType: TdTypes.text },
    { columnName: 'Status', fieldName: 'status', tdType: TdTypes.text },
    { columnName: 'Work Duration (min)', fieldName: 'work_duration', tdType: TdTypes.text },
    { columnName: 'Created On', fieldName: 'created_at', tdType: TdTypes.dateTime },
    { columnName: 'Updated On', fieldName: 'updated_at', tdType: TdTypes.dateTime },
    { columnName: 'Action', fieldName: '', tdType: TdTypes.actionEditDelete },
  ];

  filterConfigs: IFilterConfig[] = [
    { field: 'user_id', placeholder: 'Cari User ID', type: 'text', validators: [] },
    {
      field: 'status',
      placeholder: 'Pilih Status',
      type: 'dropdown',
      validators: [],
      options: [
        { value: 'Checked In', label: 'Checked In' },
        { value: 'Checked Out', label: 'Checked Out' },
      ],
    },
    {
      field: 'is_in_office',
      placeholder: 'In Office?',
      type: 'dropdown',
      validators: [],
      options: [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' },
      ],
    },
  ];

  data: Attendance[] = [];
  filteredData: Attendance[] = [];
  paginatedData: Attendance[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  showModal = false;
  modalMode: 'create' | 'edit' = 'create';
  selectedRecord: Attendance | null = null;
  confirmDeleteVisible = false;
  recordToDelete: Attendance | null = null;
  loading = false;

  constructor(private attendanceService: AttendanceService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.refresh();
  }

  refresh() {
    this.loading = true;
    this.attendanceService.getAll().subscribe({
      next: (data) => {
        this.data = data;
        this.applyFilter({});
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  onFilterSearch(filters: any) {
    this.applyFilter(filters);
  }

  applyFilter(filters: any) {
    const { user_id, status, is_in_office } = filters;

    const hasAnyFilter =
      (user_id && user_id.trim() !== '') ||
      (status && status.trim() !== '') ||
      is_in_office === true ||
      is_in_office === false;

    if (!hasAnyFilter) {
      this.filteredData = [...this.data];
      this.updatePagination();
      return;
    }

    this.filteredData = this.data.filter((a) => {
      const matchUserId =
        !user_id || a.user_id.toString().toLowerCase().includes(user_id.toLowerCase());

      const matchStatus =
        !status ||
        (typeof a.status === 'string' &&
          a.status.trim().toLowerCase() === status.trim().toLowerCase());

      const matchOffice =
        is_in_office === null || is_in_office === undefined
          ? true
          : a.is_in_office === is_in_office;

      return matchUserId && matchStatus && matchOffice;
    });

    this.updatePagination();
  }

  updatePagination() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedData = this.filteredData.slice(start, start + this.itemsPerPage);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.updatePagination();
  }

  openCreateModal() {
    this.modalMode = 'create';
    this.selectedRecord = null;
    this.showModal = true;
  }

  openEditModal(record: Attendance) {
    this.modalMode = 'edit';
    this.selectedRecord = record;
    this.showModal = true;
  }

  saveRecord(record: Attendance) {
    if (this.modalMode === 'create') {
      this.attendanceService.add(record).subscribe(() => {
        this.toastr.success('Attendance berhasil ditambahkan', 'Berhasil');
        this.refresh();
      });
    } else {
      this.attendanceService.update(record).subscribe(() => {
        this.toastr.info('Attendance berhasil diperbarui', 'Diperbarui');
        this.refresh();
      });
    }
    this.showModal = false;
  }

  actionRecord(event: any) {
    if (event.action === 'edit') this.openEditModal(event.data);
    else if (event.action === 'delete') {
      this.recordToDelete = event.data;
      this.confirmDeleteVisible = true;
    }
  }

  deleteRecord() {
    if (!this.recordToDelete) return;
    this.loading = true;
    this.attendanceService.delete(this.recordToDelete.id).subscribe({
      next: () => {
        this.toastr.warning('Attendance telah dihapus', 'Dihapus');
        this.confirmDeleteVisible = false;
        this.refresh();
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  closeConfirmModal() {
    this.confirmDeleteVisible = false;
    this.recordToDelete = null;
  }

  downloadCSV() {
    if (!this.paginatedData.length) {
      this.toastr.warning('Tidak ada data untuk diunduh', 'Peringatan');
      return;
    }

    this.loading = true;
    setTimeout(() => {
      const headers = this.tableConfigs
        .filter(c => c.tdType !== TdTypes.actionEditDelete)
        .map(c => c.columnName);
      const keys = this.tableConfigs
        .filter(c => c.tdType !== TdTypes.actionEditDelete)
        .map(c => c.fieldName);

      const csvRows = [
        headers.join(','),
        ...this.paginatedData.map(record => keys.map(k => {
          let value: any = (record as any)[k];
          if (value instanceof Date) value = value.toISOString();
          if (typeof value === 'boolean') value = value ? 'Yes' : 'No';
          if (typeof value === 'string') value = `"${value.replace(/"/g, '""')}"`;
          return value ?? '';
        }).join(','))
      ];

      const blob = new Blob([csvRows.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `attendance_filtered_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      this.loading = false;
    }, 500);
  }
}
