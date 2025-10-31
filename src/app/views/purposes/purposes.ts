import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription, finalize } from 'rxjs';
import { CustomFilterComponent } from '../../components/custom-filter/custom-filter.component';
import { IFilterConfig } from '../../components/custom-filter/custom-filter.type';
import { CustomTableComponent } from '../../components/custom-table/custom-table.component';
import { ITableConfig, TdTypes } from '../../components/custom-table/custom-table.type';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { Purpose } from './DTO/purposes.model';
import { PurposesService } from './service/purposes.service';
import { PurposesForm } from './purposes-form/purposes-form';

@Component({
  selector: 'app-purposes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CustomTableComponent,
    PaginationComponent,
    CustomFilterComponent,
    PurposesForm
  ],
  templateUrl: './purposes.html',
  styleUrl: './purposes.scss',
})
export class Purposes {
  tableConfigs: ITableConfig[] = [
    { columnName: 'Name', fieldName: 'name', tdType: TdTypes.text },
    { columnName: 'Description', fieldName: 'description', tdType: TdTypes.text },
    { columnName: 'Active', fieldName: 'is_active', tdType: TdTypes.boolean },
    { columnName: 'Created At', fieldName: 'created_at', tdType: TdTypes.dateTime },
    { columnName: 'Action', fieldName: '', tdType: TdTypes.actionEditDelete },
  ];

  filterConfigs: IFilterConfig[] = [
    { field: 'name', placeholder: 'Cari Purpose', type: 'text', validators: [] },
    {
      field: 'is_active',
      placeholder: 'Status',
      type: 'dropdown',
      validators: [],
      options: [
        { value: true, label: 'Aktif' },
        { value: false, label: 'Tidak Aktif' },
      ],
    },
  ];

  purposes: Purpose[] = [];
  filteredData: Purpose[] = [];
  paginatedData: Purpose[] = [];

  currentPage = 1;
  itemsPerPage = 10;
  loading = false;
  showModal = false;
  modalMode: 'create' | 'edit' = 'create';
  selectedRecord: Purpose | null = null;
  confirmDeleteVisible = false;
  recordToDelete: Purpose | null = null;

  private loadingSub?: Subscription;

  constructor(
    private service: PurposesService,
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
          this.purposes = data ?? [];
          this.applyFilter({});
        },
        error: () => this.toastr.error('Gagal memuat data purposes'),
      });
  }

  onFilterSearch(filters: any) {
    this.applyFilter(filters);
  }

  applyFilter(filters: any) {
    const { name, is_active } = filters;
    this.filteredData = this.purposes.filter(
      (p) =>
        (!name || p.name.toLowerCase().includes(name.toLowerCase())) &&
        (is_active === null || is_active === undefined || p.is_active === is_active)
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

  openEditModal(record: Purpose) {
    this.modalMode = 'edit';
    this.selectedRecord = record;
    this.showModal = true;
  }

  saveRecord(record: Purpose) {
    const request$ = this.modalMode === 'create'
      ? this.service.add(record)
      : this.service.update(record);

    this.loading = true;
    request$
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: () => {
          const msg = this.modalMode === 'create'
            ? 'Purpose berhasil ditambahkan'
            : 'Purpose berhasil diperbarui';
          this.toastr.success(msg);
          this.showModal = false;
          this.refresh(false);
        },
        error: () => this.toastr.error('Gagal menyimpan purpose'),
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
          this.toastr.warning('Purpose telah dihapus');
          this.closeConfirmModal();
          this.refresh(false);
        },
        error: () => this.toastr.error('Gagal menghapus purpose'),
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

    const header = ['Name', 'Description', 'Active', 'Created At'];
    const rows = this.filteredData.map(p => [
      `"${p.name}"`,
      `"${p.description}"`,
      p.is_active ? 'Yes' : 'No',
      new Date(p.created_at).toLocaleString(),
    ]);

    const csvContent = header.join(',') + '\n' + rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `purposes-${new Date().toISOString()}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    this.toastr.success('File CSV berhasil diunduh');
  }
}
