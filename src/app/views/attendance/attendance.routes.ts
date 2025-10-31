import { Routes } from '@angular/router';
import { AttendanceComponent } from './attendance';

export const routes: Routes = [
    {
        path: '',
        children: [
            { path: '', component: AttendanceComponent },
        ],
    },
];
