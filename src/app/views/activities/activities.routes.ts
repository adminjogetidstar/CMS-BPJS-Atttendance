import { Routes } from '@angular/router';
import { Activities } from './activities';

export const routes: Routes = [
    {
        path: '',
        children: [
            { path: '', component: Activities },
        ],
    },
];
