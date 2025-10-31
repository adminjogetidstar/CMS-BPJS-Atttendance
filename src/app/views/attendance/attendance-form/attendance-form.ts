import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Attendance } from '../DTO/attendance.model';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-attendance-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './attendance-form.html',
})
export class AttendanceForm implements OnChanges {
  @Input() visible = false;
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() record: Attendance | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Attendance>();

  form!: FormGroup;
  checkInPreview: string | null = null;
  checkOutPreview: string | null = null;

  constructor(private fb: FormBuilder, private sanitizer: DomSanitizer) {
    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['record'] && this.record) {
      this.form.patchValue({
        ...this.record,
        check_in_time: this.formatDate(this.record.check_in_time),
        check_out_time: this.record.check_out_time ? this.formatDate(this.record.check_out_time) : '',
      });
      this.checkInPreview = this.record.check_in_photo || null;
      this.checkOutPreview = this.record.check_out_photo || null;
    } else if (this.mode === 'create') {
      this.form.reset({ is_in_office: true });
      this.checkInPreview = null;
      this.checkOutPreview = null;
    }
  }

  private buildForm() {
    this.form = this.fb.group({
      user_id: ['', Validators.required],
      purpose_id: ['', Validators.required],
      check_in_time: ['', Validators.required],
      check_out_time: [''],
      check_in_location: [''],
      check_out_location: [''],
      check_in_remarks: [''],
      check_out_remarks: [''],
      is_in_office: [true],
      status: ['Checked In', Validators.required],
      work_duration: [0],
    });
  }

  private formatDate(date: string | Date): string {
    const d = new Date(date);
    return d.toISOString().slice(0, 16);
  }

  onFileChange(event: any, type: 'checkin' | 'checkout') {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (type === 'checkin') {
        this.checkInPreview = result;
      } else {
        this.checkOutPreview = result;
      }
    };
    reader.readAsDataURL(file);
  }

  submitForm() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.value;

    const record: Attendance = {
      id: this.record?.id || 0,
      user_id: Number(formValue.user_id),
      purpose_id: Number(formValue.purpose_id),
      check_in_time: new Date(formValue.check_in_time),
      check_out_time: formValue.check_out_time ? new Date(formValue.check_out_time) : null,
      check_in_location: formValue.check_in_location,
      check_out_location: formValue.check_out_location,
      check_in_photo: this.checkInPreview || '',
      check_out_photo: this.checkOutPreview || '',
      check_in_remarks: formValue.check_in_remarks,
      check_out_remarks: formValue.check_out_remarks,
      is_in_office: formValue.is_in_office,
      status: formValue.status,
      work_duration: formValue.work_duration,
      created_at: this.record?.created_at || new Date(),
      updated_at: new Date(),
    };

    this.save.emit(record);
  }

  closeModal() {
    this.close.emit();
  }
}
