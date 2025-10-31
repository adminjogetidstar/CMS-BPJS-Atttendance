import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Purpose } from '../DTO/purposes.model';

@Component({
  selector: 'app-purposes-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './purposes-form.html',
  styleUrl: './purposes-form.scss',
})
export class PurposesForm {
  @Input() visible = false;
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() record: Purpose | null = null;

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Purpose>();

  form!: FormGroup;
  saving = false;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      is_active: [true, Validators.required],
    });
  }

  ngOnChanges(): void {
    if (this.record) {
      this.form.patchValue(this.record);
    } else {
      this.form.reset({ is_active: true });
    }
  }

  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    const data: Purpose = {
      ...this.record,
      ...this.form.value,
      id: this.record?.id || 0,
      created_at: this.record?.created_at || new Date(),
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
