import { Routes } from '@angular/router';
import { OfficeLocationComponent } from './office-location';

export const routes: Routes = [
    {
        path: '',
        children: [
            { path: '', component: OfficeLocationComponent },
        ],
    },
];
