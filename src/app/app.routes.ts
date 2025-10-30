import { Routes } from '@angular/router';
import { DesktopLayout } from './layouts/desktop-layout/desktop-layout';

export const routes: Routes = [
    {
        path: '',
        component: DesktopLayout,
        children: [
            {
                path: 'user',
                loadChildren: () =>
                    import('./views/user/user.routes').then((m) => m.routes),
            },
            {
                path: 'office-location',
                loadChildren: () =>
                    import('./views/office-location/office-location.routes').then((m) => m.routes),
            },
            {
                path: 'attendance',
                loadChildren: () =>
                    import('./views/attendance/attendance.routes').then((m) => m.routes),
            },
            {
                path: 'activities',
                loadChildren: () =>
                    import('./views/activities/activities.routes').then((m) => m.routes),
            },
        ]
    },
    { path: '**', redirectTo: '/user' }
];
