import { Routes } from '@angular/router';
import { Dashboard } from './dashboard';

export const routes: Routes = [
    {
        path: '',
        children: [
            { path: '', component: Dashboard },
        ],
    },
];
