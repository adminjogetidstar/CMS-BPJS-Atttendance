import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Subscription, interval } from 'rxjs';
import { ITableConfig, TdTypes } from '../../components/custom-table/custom-table.type';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomTableComponent } from '../../components/custom-table/custom-table.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { AttendanceForm } from './attendance-form/attendance-form';
import { AttendanceRecord } from '../../store/attendance/attendance.models';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomTableComponent, AttendanceForm, PaginationComponent],
  templateUrl: './attendance.html',
  styleUrl: './attendance.scss',
})
export class Attendance implements OnInit, OnDestroy {
  tableConfigs: ITableConfig[] = [
    { columnName: 'Employee ID', fieldName: 'employeeCode', tdType: TdTypes.text },
    { columnName: 'Name', fieldName: 'employeeName', tdType: TdTypes.text },
    { columnName: 'Status', fieldName: 'status', tdType: TdTypes.status },
    { columnName: 'Check-In', fieldName: 'checkIn', tdType: TdTypes.dateTime },
    { columnName: 'Check-Out', fieldName: 'checkOut', tdType: TdTypes.dateTime },
    { columnName: 'Updated By', fieldName: 'updatedBy', tdType: TdTypes.text },
    { columnName: 'Action', fieldName: '', tdType: TdTypes.actionEditDelete },
  ];

  attendance$ = new BehaviorSubject<AttendanceRecord[]>([
    { employeeCode: 'EMP001', employeeName: 'Febriansyah', status: 'Hadir', checkIn: new Date('2025-10-28T08:05:00'), checkOut: null, updatedBy: 'System' },
    { employeeCode: 'EMP002', employeeName: 'Rizky', status: 'Izin', checkIn: null, checkOut: null, updatedBy: 'Admin' },
    { employeeCode: 'EMP003', employeeName: 'Aulia', status: 'Hadir', checkIn: new Date('2025-10-28T08:10:00'), checkOut: null, updatedBy: 'System' },
    { employeeCode: 'EMP004', employeeName: 'Bima', status: 'Sakit', checkIn: null, checkOut: null, updatedBy: 'Admin' },
  ]);

  filteredData: AttendanceRecord[] = [];
  paginatedData: AttendanceRecord[] = [];

  searchKeyword = '';
  filterStatus: AttendanceRecord['status'] | 'Semua' = 'Semua';

  currentPage = 1;
  itemsPerPage = 10;

  loading$ = new BehaviorSubject(false);
  showModal = false;
  selectedRecord: AttendanceRecord | null = null;
  modalMode: 'create' | 'edit' = 'create';

  confirmDeleteVisible = false;
  recordToDelete: AttendanceRecord | null = null;

  private autoCheckSub!: Subscription;

  constructor(private readonly toastr: ToastrService) { }

  ngOnInit() {
    this.applyFilter();
    this.autoCheckSub = interval(60 * 1000).subscribe(() => this.autoCheckOut());
    this.autoCheckOut();
  }

  ngOnDestroy() {
    this.autoCheckSub?.unsubscribe();
  }

  /** FILTER DATA */
  applyFilter() {
    const keyword = this.searchKeyword.toLowerCase();
    const status = this.filterStatus;
    this.filteredData = this.attendance$.value.filter(r =>
      r.employeeName.toLowerCase().includes(keyword) &&
      (status === 'Semua' || r.status === status)
    );

    this.currentPage = 1;
    this.updatePagination();
  }

  /** PAGINATION */
  updatePagination() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedData = this.filteredData.slice(start, start + this.itemsPerPage);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.updatePagination();
  }

  onPageSizeChange(size: number) {
    this.itemsPerPage = size;
    this.currentPage = 1;
    this.updatePagination();
  }

  /** MODAL CREATE / EDIT */
  openCreateModal() {
    this.modalMode = 'create';
    this.selectedRecord = null;
    this.showModal = true;
  }

  openEditModal(record: AttendanceRecord) {
    this.modalMode = 'edit';
    this.selectedRecord = record;
    this.showModal = true;
  }

  saveRecord(record: AttendanceRecord) {
    if (this.modalMode === 'create') {
      const now = new Date();
      const newRecord: AttendanceRecord = {
        ...record,
        employeeCode: `EMP${(Math.random() * 1000).toFixed(0).padStart(3, '0')}`,
        updatedBy: 'Admin',
        checkIn: record.status === 'Hadir' ? now : null,
        checkOut: null
      };
      this.attendance$.next([...this.attendance$.value, newRecord]);
      this.toastr.success(`Absensi ${record.employeeName} berhasil ditambahkan`, 'Berhasil');
      if (record.status === 'Hadir') setTimeout(() => this.manualCheckOut(newRecord.employeeCode), 60 * 1000);
    } else {
      const updated = this.attendance$.value.map(r =>
        r.employeeCode === record.employeeCode ? { ...r, ...record, updatedBy: 'Admin' } : r
      );
      this.attendance$.next(updated);
      this.toastr.info(`Absensi ${record.employeeName} berhasil diperbarui`, 'Diperbarui');
    }
    this.applyFilter();
    this.showModal = false;
  }

  closeModal() {
    this.showModal = false;
  }

  /** ACTIONS */
  actionRecord(event: any) {
    if (event.action === 'edit') this.openEditModal(event.data);
    else if (event.action === 'delete') {
      this.recordToDelete = event.data;
      this.confirmDeleteVisible = true;
    }
  }

  confirmDelete() {
    if (!this.recordToDelete) return;
    const updated = this.attendance$.value.filter(r => r.employeeCode !== this.recordToDelete!.employeeCode);
    this.attendance$.next(updated);
    this.applyFilter();
    this.toastr.warning(`Data absensi ${this.recordToDelete.employeeName} telah dihapus`, 'Dihapus');
    this.closeConfirmModal();
  }

  closeConfirmModal() {
    this.confirmDeleteVisible = false;
    this.recordToDelete = null;
  }

  /** AUTO CHECK-OUT */
  private manualCheckOut(employeeCode: string) {
    const updated = this.attendance$.value.map(r =>
      r.employeeCode === employeeCode && r.status === 'Hadir' && !r.checkOut
        ? { ...r, checkOut: new Date(), updatedBy: 'System (Auto)' }
        : r
    );
    this.attendance$.next(updated);
    this.applyFilter();
    this.toastr.info(`Karyawan ${employeeCode} otomatis check-out`, 'Auto Check-Out');
  }

  private autoCheckOut() {
    const now = new Date();
    if (now.getHours() >= 17) {
      const updated = this.attendance$.value.map(r =>
        r.status === 'Hadir' && r.checkIn && !r.checkOut
          ? { ...r, checkOut: new Date(now.setHours(17, 0, 0, 0)), updatedBy: 'System (17:00)' }
          : r
      );
      const changed = updated.some((r, i) => r.checkOut !== this.attendance$.value[i].checkOut);
      if (changed) {
        this.attendance$.next(updated);
        this.applyFilter();
        this.toastr.info('Beberapa karyawan otomatis check-out jam 17:00', 'Auto Check-Out');
      }
    }
  }
}
