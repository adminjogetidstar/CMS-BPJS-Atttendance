import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

const datepickerConfig = (): BsDatepickerConfig => {
    return Object.assign(new BsDatepickerConfig(), {
        containerClass: 'theme-idstar-primary',
        showWeekNumbers: false,
        dateInputFormat: 'DD/MM/YYYY',
        rangeSeparator: '-',
    });
};

export default datepickerConfig;
