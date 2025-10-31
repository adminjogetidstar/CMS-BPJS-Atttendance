import { ValidatorFn } from "@angular/forms";

export type FilterType = 'date' | 'text' | 'dropdown' | 'dateRange';

export interface IFilterConfig {
    field: string,
    placeholder: string,
    type: FilterType,
    validators: ValidatorFn[],
    width?: string,
    options?: { value: any; label: string }[];
}
