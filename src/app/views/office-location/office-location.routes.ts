import { Routes } from '@angular/router';
import { OfficeLocation } from './office-location';

export const routes: Routes = [
    {
        path: '',
        children: [
            { path: '', component: OfficeLocation },
        ],
    },
];
