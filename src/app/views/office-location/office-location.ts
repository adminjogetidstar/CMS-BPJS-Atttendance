import { Component, OnDestroy, OnInit } from '@angular/core';
import { finalize, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OfficeLocationsService } from './services/office-locations.service';
import { ITableConfig, TdTypes } from '../../components/custom-table/custom-table.type';
import { IFilterConfig } from '../../components/custom-filter/custom-filter.type';
import { CustomFilterComponent } from '../../components/custom-filter/custom-filter.component';
import { CustomTableComponent } from '../../components/custom-table/custom-table.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { OfficeLocation } from './DTO/office-location.model';
import { OfficeLocationForm } from './office-location-form/office-location-form';

@Component({
  selector: 'app-office-location',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CustomTableComponent,
    PaginationComponent,
    CustomFilterComponent,
    OfficeLocationForm,
  ],
  templateUrl: './office-location.html',
  styleUrl: './office-location.scss',
})
export class OfficeLocationComponent implements OnInit, OnDestroy {
  tableConfigs: ITableConfig[] = [
    { columnName: 'Name', fieldName: 'name', tdType: TdTypes.text },
    { columnName: 'Latitude', fieldName: 'latitude', tdType: TdTypes.text },
    { columnName: 'Longitude', fieldName: 'longitude', tdType: TdTypes.text },
    { columnName: 'Radius (m)', fieldName: 'radius', tdType: TdTypes.text },
    { columnName: 'Active', fieldName: 'is_active', tdType: TdTypes.boolean },
    { columnName: 'Created At', fieldName: 'created_at', tdType: TdTypes.dateTime },
    { columnName: 'Updated At', fieldName: 'updated_at', tdType: TdTypes.dateTime },
    { columnName: 'Action', fieldName: '', tdType: TdTypes.actionEditDelete },
  ];

  filterConfigs: IFilterConfig[] = [
    { field: 'name', placeholder: 'Cari Lokasi', type: 'text', validators: [] },
    {
      field: 'is_active',
      placeholder: 'Status Aktif',
      type: 'dropdown',
      validators: [],
      options: [
        { value: true, label: 'Aktif' },
        { value: false, label: 'Tidak Aktif' },
      ],
    },
  ];

  // Data
  locations: OfficeLocation[] = [];
  filteredData: OfficeLocation[] = [];
  paginatedData: OfficeLocation[] = [];

  // UI State
  currentPage = 1;
  itemsPerPage = 10;
  loading = false;
  showModal = false;
  modalMode: 'create' | 'edit' = 'create';
  selectedRecord: OfficeLocation | null = null;
  confirmDeleteVisible = false;
  recordToDelete: OfficeLocation | null = null;

  private loadingSub?: Subscription;

  constructor(
    private service: OfficeLocationsService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.refresh();
  }

  ngOnDestroy(): void {
    this.loadingSub?.unsubscribe();
  }

  refresh(showLoading = true) {
    this.loadingSub?.unsubscribe();
    if (showLoading) this.loading = true;

    this.loadingSub = this.service.getAll()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (data) => {
          this.locations = data ?? [];
          this.applyFilter({});
        },
        error: () => this.toastr.error('Gagal memuat data lokasi'),
      });
  }

  onFilterSearch(filters: any) {
    this.applyFilter(filters);
  }

  applyFilter(filters: any) {
    const { name, is_active } = filters;
    this.filteredData = this.locations.filter(
      (l) =>
        (!name || l.name.toLowerCase().includes(name.toLowerCase())) &&
        (is_active === null || is_active === undefined || l.is_active === is_active)
    );
    this.currentPage = 1;
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

  openEditModal(record: OfficeLocation) {
    this.modalMode = 'edit';
    this.selectedRecord = record;
    this.showModal = true;
  }

  saveRecord(record: OfficeLocation) {
    const request$ = this.modalMode === 'create'
      ? this.service.add(record)
      : this.service.update(record);

    this.loading = true;
    request$
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: () => {
          const msg = this.modalMode === 'create'
            ? 'Office Location berhasil ditambahkan'
            : 'Office Location berhasil diperbarui';
          this.toastr.success(msg);
          this.showModal = false;
          this.refresh(false);
        },
        error: () => this.toastr.error('Gagal menyimpan lokasi'),
      });
  }

  actionRecord(event: any) {
    if (event.action === 'edit') this.openEditModal(event.data);
    if (event.action === 'delete') {
      this.recordToDelete = event.data;
      this.confirmDeleteVisible = true;
    }
  }

  deleteRecord() {
    if (!this.recordToDelete) return;
    this.loading = true;
    this.service.delete(this.recordToDelete.id)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: () => {
          this.toastr.warning('Office Location telah dihapus');
          this.closeConfirmModal();
          this.refresh(false);
        },
        error: () => this.toastr.error('Gagal menghapus lokasi'),
      });
  }

  closeConfirmModal() {
    this.confirmDeleteVisible = false;
    this.recordToDelete = null;
  }

  downloadCSV() {
    if (!this.filteredData.length) {
      this.toastr.info('Tidak ada data untuk diunduh');
      return;
    }

    const header = [
      'Name',
      'Latitude',
      'Longitude',
      'Radius (m)',
      'Active',
      'Created At',
      'Updated At',
    ];

    const rows = this.filteredData.map(l => [
      `"${l.name}"`,
      l.latitude,
      l.longitude,
      l.radius,
      l.is_active ? 'Yes' : 'No',
      new Date(l.created_at).toLocaleString(),
      new Date(l.updated_at).toLocaleString(),
    ]);

    const csvContent =
      header.join(',') + '\n' + rows.map(r => r.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `office-locations-${new Date().toISOString()}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);

    this.toastr.success('File CSV berhasil diunduh');
  }
}
