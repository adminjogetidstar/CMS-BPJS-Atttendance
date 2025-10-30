import { Routes } from '@angular/router';
import { UserComponent } from './user';

export const routes: Routes = [
    {
        path: '',
        children: [
            { path: '', component: UserComponent },
        ],
    },
];
