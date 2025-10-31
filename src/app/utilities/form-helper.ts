import { AbstractControl, FormArray, FormControl, FormGroup, UntypedFormControl, UntypedFormGroup } from '@angular/forms';

export default class FormHelper {
  private typing: any;

  typingDelay = (input: string): Promise<string> => {
    clearTimeout(this.typing);
    return new Promise((resolve) => {
      this.typing = setTimeout(() => resolve(input), 500);
    });
  };

  // ====== BASIC ======
  public isInvalid(form: FormGroup, field: string) {
    const control = form.get(field);
    if (!control) return '';
    return control.touched && control.invalid ? 'is-invalid' : '';
  }

  public isFieldInvalid(field: UntypedFormControl) {
    return field.touched && field.errors ? 'is-invalid' : '';
  }

  public enableField(form: UntypedFormGroup, field: string) {
    const control = form.get(field) as UntypedFormControl;
    if (control) {
      control.enable();
    }
  }

  // ====== FORM ARRAY ======
  public isArrayFieldInvalid(formArray: FormArray, index: number, field: string) {
    const control = formArray.at(index).get(field);
    return control && control.touched && control.invalid ? 'is-invalid' : '';
  }

  public hasArrayError(formArray: FormArray, index: number, field: string, type: string) {
    const control = formArray.at(index).get(field);
    if (!control?.errors) return null;
    if (!control.touched) return null;

    const messages: Record<string, string> = {
      required: 'Wajib diisi',
    };

    return control.errors[type] ? messages[type] : null;
  }

  // ====== OTHERS ======
  public showMaskTyped(field: string | null) {
    const focusedElement = document.querySelector(':focus');
    if (focusedElement) {
      return focusedElement.getAttribute('name') === field;
    }
    return false;
  }

  public hasValue(val: string) {
    if (['null', 'undefined'].includes(typeof val)) {
      return false;
    } else {
      return val !== '';
    }
  }

  public isValidDate(d: number) {
    if (Object.prototype.toString.call(d) === '[object Date]') {
      return !isNaN(d); // valid date
    } else {
      return true;
    }
  }

  public hasError(form: UntypedFormGroup, field: string, type: string, custom?: string) {
    const control = form.get(field);
    if (!control) return null;

    const errorMessage = {
      required: 'Wajib Diisi',
      email: 'Email tidak valid',
      pattern: 'Pola tidak sesuai',
      minlength: `Minimum ${custom} Karakter`,
      maxlength: `Maximum ${custom} Karakter`,
    };

    return control.hasError(type)
      ? errorMessage[type as keyof typeof errorMessage]
      : null;
  }

  public formatDate(dateString: string | Date) {
    const date = dateString;
    if (date instanceof Date && !isNaN(date.valueOf())) {
      return Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
        .format(date)
        .replace(/\//g, '-');
    } else {
      return dateString;
    }
  }

  public formatStringDate(stringDate: string) {
    const dateString = stringDate.split(' ')[0];
    const dateArr = dateString.split('-');
    return [dateArr[2], dateArr[1], dateArr[0]].join('-');
  }

  public logFormError(formGroup: UntypedFormGroup) {
    Object.keys(formGroup.controls).forEach((c) => {
      if (formGroup.get(c)?.status === 'INVALID') {
        console.log(c, formGroup.get(c)?.status);
      }
    });
  }

  public setQueryParam(obj: { [x: string]: any }) {
    return encodeURI(
      Object.keys(obj)
        .filter((field) => obj[field] !== null && obj[field] !== undefined)
        .map((key) => {
          let val = obj[key];
          if (typeof val === 'string') {
            val = val.trim();
          }
          return key + '=' + val;
        })
        .join('&')
    );
  }

  isEmptyObject(value: {}) {
    return value && this.isObject(value)
      ? Object.keys(value).length === 0
      : true;
  }

  private isObject(value: any) {
    return value instanceof Object;
  }

  getFormProgress(form: UntypedFormGroup) {
    if (form.valid) {
      return 'complete';
    } else {
      const formValue = form.getRawValue();
      const flattenValue = Object.values(formValue);
      if (flattenValue.some((val) => val)) {
        return 'onprogress';
      } else {
        return 'new';
      }
    }
  }

  // Validasi FormArray Jabatan
  public getArrayErrorMessage(formArray: FormArray, index: number, controlName: string, error: string): string {
    const group = formArray.at(index) as FormGroup;
    const control = group.get(controlName);
    if (control?.hasError(error) && (control.dirty || control.touched)) {
      switch (error) {
        case 'required':
          return `${controlName} wajib diisi`;
        default:
          return 'Input tidak valid';
      }
    }
    return '';
  }

  replaceNull(obj: any): any {
    Object.keys(obj).forEach((field: string) => {
      if (obj[field] === null) {
        obj[field] = '';
      }
    });
    return obj;
  }

  public getErrorMessage(form: FormGroup, field: string): string | null {
    const control = form.get(field);
    if (!control || !control.touched || !control.errors) return null;

    if (control.errors['required']) return 'Wajib diisi';
    if (control.errors['maxlength']) return `Maksimal ${control.errors['maxlength'].requiredLength} karakter`;
    if (control.errors['minlength']) return `Minimal ${control.errors['minlength'].requiredLength} karakter`;
    if (control.errors['pattern']) return 'Format tidak valid';

    return 'Input tidak valid';
  }

  onCheckboxChange(e: any, selected: any[]) {
    if (e.target.checked) {
      selected.push(e.target.value);
    } else {
      const index = selected.indexOf(e.target.value);
      if (index > -1) {
        selected.splice(index, 1);
      }
    }
    return selected;
  }

  resetForm(formGroup: FormGroup) {
    const defaultValues = Object.keys(formGroup.controls).reduce((acc, key) => {
      const control = formGroup.get(key);
      if (control instanceof FormControl) {
        acc[key] = control.value instanceof Array ? [] : '';
      }
      return acc;
    }, {} as any);

    formGroup.reset(defaultValues);
  }
}
