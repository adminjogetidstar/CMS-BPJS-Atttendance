import { Routes } from '@angular/router';
import { Attendance } from './attendance';

export const routes: Routes = [
    {
        path: '',
        children: [
            { path: '', component: Attendance },
        ],
    },
];
