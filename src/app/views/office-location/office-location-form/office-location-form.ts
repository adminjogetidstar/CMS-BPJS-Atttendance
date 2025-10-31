import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OfficeLocation } from '../DTO/office-location.model';

@Component({
  selector: 'app-office-location-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './office-location-form.html',
  styleUrl: './office-location-form.scss',
})
export class OfficeLocationForm implements OnChanges {
  @Input() visible = false;
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() record: OfficeLocation | null = null;

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<OfficeLocation>();

  form!: FormGroup;
  saving = false;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      latitude: [null, [Validators.required, Validators.min(-90), Validators.max(90)]],
      longitude: [null, [Validators.required, Validators.min(-180), Validators.max(180)]],
      radius: [50, [Validators.required, Validators.min(1)]],
      is_active: [true, Validators.required],
    });
  }

  ngOnChanges(): void {
    if (this.record) {
      this.form.patchValue(this.record);
    } else {
      this.form.reset({ is_active: true, radius: 50 });
    }
  }

  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    const now = new Date();
    const data: OfficeLocation = {
      ...this.record,
      ...this.form.value,
      id: this.record?.id || 0,
      created_at: this.record?.created_at || now,
      updated_at: now,
    };

    setTimeout(() => {
      this.save.emit(data);
      this.saving = false;
    }, 500);
  }

  onClose() {
    this.close.emit();
  }

  get f() {
    return this.form.controls;
  }
}
