import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-form.html',
  styleUrl: './user-form.scss',
})
export class UserFormComponent {
  @Input() visible = false;
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() record: any = {};
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  formData: any = { employeeName: '', status: 'Hadir' };

  ngOnChanges() {
    if (this.record) {
      this.formData = { ...this.record };
    } else {
      this.formData = { employeeName: '', status: 'Hadir' };
    }
  }

  onSave() {
    this.save.emit(this.formData);
  }

  onClose() {
    this.close.emit();
  }
}
