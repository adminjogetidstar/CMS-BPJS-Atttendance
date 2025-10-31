import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { User } from '../DTO/users.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-form.html',
  styleUrl: './user-form.scss',
})
export class UserForm implements OnChanges {
  @Input() visible = false;
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() record: User | null = null;

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<User>();

  form!: FormGroup;
  previewPhoto: string | ArrayBuffer | null = null;
  saving = false;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      role: ['', Validators.required],
      employee_id: ['', Validators.required],
      department: ['', Validators.required],
      profile_photo: ['']
    });
  }

  ngOnChanges(): void {
    if (this.record) {
      this.form.patchValue(this.record);
      this.previewPhoto = this.record.profile_photo || null;
      this.form.get('password')?.clearValidators();
    } else {
      this.form.reset();
      this.previewPhoto = null;
      this.form.get('password')?.setValidators([Validators.required]);
    }
    this.form.get('password')?.updateValueAndValidity();
  }

  onFileChange(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.previewPhoto = reader.result;
      this.form.patchValue({ profile_photo: reader.result });
    };
    reader.readAsDataURL(file);
  }

  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;

    const now = new Date();
    const data: User = {
      ...this.record,
      ...this.form.value,
      id: this.record?.id || 0,
      created_at: this.record?.created_at || now,
      updated_at: now,
    };

    if (this.mode === 'edit' && !this.form.value.password) {
      delete data.password;
    }

    // Simulasi async save
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
