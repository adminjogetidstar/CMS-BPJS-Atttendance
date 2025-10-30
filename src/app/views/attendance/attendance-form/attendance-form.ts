import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AttendanceRecord } from '../../../store/attendance/attendance.models';

@Component({
  selector: 'app-attendance-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './attendance-form.html',
  styleUrl: './attendance-form.scss',
})
export class AttendanceForm implements OnChanges {
  @Input() visible = false;
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() record: AttendanceRecord | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<AttendanceRecord>();

  formData: Partial<AttendanceRecord> = { employeeName: '', status: 'Hadir' };

  ngOnChanges() {
    this.formData = this.record ? { ...this.record } : { employeeName: '', status: 'Hadir' };
  }

  onSave() {
    this.save.emit(this.formData as AttendanceRecord);
  }

  onClose() {
    this.close.emit();
  }
}
