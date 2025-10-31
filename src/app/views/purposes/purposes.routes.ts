import { Routes } from '@angular/router';
import { Purposes } from './purposes';

export const routes: Routes = [
    {
        path: '',
        children: [
            { path: '', component: Purposes },
        ],
    },
];
