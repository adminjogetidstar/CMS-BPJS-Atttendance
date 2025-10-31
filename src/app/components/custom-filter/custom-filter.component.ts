import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IFilterConfig } from './custom-filter.type';
import {
  BsDatepickerModule,
  BsLocaleService,
  BsDatepickerConfig,
} from 'ngx-bootstrap/datepicker';
import { CommonModule } from '@angular/common';
import datepickerConfig from '../../config/datepicker.config';
import FormHelper from '../../utilities/form-helper';
@Component({
  selector: 'app-custom-filter',
  standalone: true,
  providers: [
    BsLocaleService,
    {
      provide: BsDatepickerConfig,
      useFactory: datepickerConfig
    }
  ],
  imports: [
    ReactiveFormsModule,
    BsDatepickerModule,
    CommonModule
  ],
  templateUrl: './custom-filter.component.html'
})
export class CustomFilterComponent extends FormHelper {
  @Input() filterConfigs: IFilterConfig[] = [];
  @Output() onFilterSearchClick: EventEmitter<any> = new EventEmitter<any>();

  formFilter: FormGroup = new FormGroup({});

  ngOnInit() {
    this.filterConfigs.forEach((config) => {
      let defaultValue: any = null;
      if (config.field === 'is_in_office') {
        defaultValue = null;
      }
      if (config.type === 'dateRange' || config.type === 'date') {
        defaultValue = null;
      }
      this.formFilter.addControl(
        config.field,
        new FormControl(defaultValue, config.validators)
      );
    });
  }

  searchClickHandle() {
    this.onFilterSearchClick.emit(this.filterValue);
  }

  get filterFG() {
    return this.formFilter;
  }

  get filterValue() {
    return this.filterFG.getRawValue();
  }

  get isFormValid() {
    return this.formFilter.valid;
  }

}
