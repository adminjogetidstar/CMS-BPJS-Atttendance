import { Component, OnInit } from '@angular/core';
import { UsersService } from './services/users.service';
import { ToastrService } from 'ngx-toastr';
import { User } from './DTO/users.model';
import { ITableConfig, TdTypes } from '../../components/custom-table/custom-table.type';
import { CommonModule } from '@angular/common';
import { CustomTableComponent } from '../../components/custom-table/custom-table.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { FormsModule } from '@angular/forms';
import { UserForm } from './user-form/user-form';
import { CustomFilterComponent } from '../../components/custom-filter/custom-filter.component';
import { IFilterConfig } from '../../components/custom-filter/custom-filter.type';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomTableComponent, PaginationComponent, UserForm, CustomFilterComponent],
  templateUrl: './user.html',
  styleUrl: './user.scss',
})
export class UserComponent implements OnInit {
  tableConfigs: ITableConfig[] = [
    { columnName: 'Employee ID', fieldName: 'employee_id', tdType: TdTypes.text },
    { columnName: 'Name', fieldName: 'name', tdType: TdTypes.text },
    { columnName: 'Email', fieldName: 'email', tdType: TdTypes.text },
    { columnName: 'Role', fieldName: 'role', tdType: TdTypes.text },
    { columnName: 'Department', fieldName: 'department', tdType: TdTypes.text },
    { columnName: 'Profile', fieldName: 'profile_photo', tdType: TdTypes.text },
    { columnName: 'Created on', fieldName: 'created_at', tdType: TdTypes.dateTime },
    { columnName: 'Update on', fieldName: 'updated_at', tdType: TdTypes.dateTime },
    { columnName: 'Action', fieldName: '', tdType: TdTypes.actionEditDelete },
  ];

  filterConfigs: IFilterConfig[] = [
    { field: 'name', placeholder: 'Cari Nama', type: 'text', validators: [] },
    { field: 'email', placeholder: 'Cari Email', type: 'text', validators: [] },
    {
      field: 'role', placeholder: 'Pilih Role', type: 'dropdown', validators: [], options: [
        { value: 'Admin', label: 'Admin' },
        { value: 'Staff', label: 'Staff' },
        { value: 'Manager', label: 'Manager' }
      ]
    },
    { field: 'created_at', placeholder: 'Tanggal Buat', type: 'date', validators: [] },
  ];

  users: User[] = [];
  filteredData: User[] = [];
  paginatedData: User[] = [];

  currentPage = 1;
  itemsPerPage = 10;

  showModal = false;
  modalMode: 'create' | 'edit' = 'create';
  selectedUser: User | null = null;

  confirmDeleteVisible = false;
  recordToDelete: User | null = null;
  loading = false;

  constructor(private userService: UsersService, private toastr: ToastrService) { }

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.loading = true;
    this.userService.getAll().subscribe({
      next: data => {
        this.users = data;
        this.applyFilter({});
        this.loading = false;
        this.closeConfirmModal();
      },
      error: () => this.loading = false
    });
  }

  onFilterSearch(filterValues: any) {
    this.applyFilter(filterValues);
  }

  applyFilter(filterValues: any) {
    this.filteredData = this.users.filter(u => {
      return (!filterValues.name || u.name.toLowerCase().includes(filterValues.name.toLowerCase()))
        && (!filterValues.email || u.email.toLowerCase().includes(filterValues.email.toLowerCase()))
        && (!filterValues.role || u.role === filterValues.role)
        && (!filterValues.created_at || new Date(u.created_at).toDateString() === new Date(filterValues.created_at).toDateString());
    });
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
    this.selectedUser = null;
    this.showModal = true;
  }

  openEditModal(user: User) {
    this.modalMode = 'edit';
    this.selectedUser = user;
    this.showModal = true;
  }

  saveUser(user: User) {
    if (this.modalMode === 'create') {
      this.userService.add(user).subscribe(() => {
        this.toastr.success('User berhasil ditambahkan', 'Berhasil');
        this.refresh();
      });
    } else {
      this.userService.update(user).subscribe(() => {
        this.toastr.info('User berhasil diperbarui', 'Diperbarui');
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

  deleteUser() {
    if (!this.recordToDelete) return;
    this.loading = true;

    this.userService.delete(this.recordToDelete.id).subscribe({
      next: () => {
        this.toastr.warning('User telah dihapus', 'Dihapus');
        this.closeConfirmModal();
        this.refresh();
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  closeConfirmModal() {
    this.confirmDeleteVisible = false;
    this.recordToDelete = null;
  }

  downloadCSV() {
    if (!this.paginatedData.length) return;
    this.loading = true;
    setTimeout(() => {
      const headers = this.tableConfigs.filter(c => c.tdType !== TdTypes.actionEditDelete).map(c => c.columnName);
      const keys = this.tableConfigs.filter(c => c.tdType !== TdTypes.actionEditDelete).map(c => c.fieldName);

      const csvRows = [
        headers.join(','),
        ...this.paginatedData.map(user => keys.map(k => {
          let value: any = (user as any)[k];
          if (value instanceof Date) value = value.toISOString();
          if (typeof value === 'string') value = `"${value.replace(/"/g, '""')}"`;
          return value ?? '';
        }).join(','))
      ];

      const blob = new Blob([csvRows.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `users_filtered_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);

      this.loading = false;
    }, 500);
  }

}
