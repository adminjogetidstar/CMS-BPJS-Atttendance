import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { OfficeLocation } from '../DTO/office-location.model';

@Injectable({ providedIn: 'root' })
export class OfficeLocationsService {
    private locations$ = new BehaviorSubject<OfficeLocation[]>([
        {
            id: 1,
            name: 'Head Office',
            latitude: -6.200000,
            longitude: 106.816666,
            radius: 150,
            is_active: true,
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            id: 2,
            name: 'Branch Bandung',
            latitude: -6.914744,
            longitude: 107.609810,
            radius: 100,
            is_active: false,
            created_at: new Date(),
            updated_at: new Date(),
        },
    ]);

    getAll(): Observable<OfficeLocation[]> {
        return of(this.locations$.value).pipe(delay(300));
    }

    add(location: OfficeLocation): Observable<void> {
        const newLoc: OfficeLocation = {
            ...location,
            id: Date.now(),
            created_at: new Date(),
            updated_at: new Date(),
        };
        this.locations$.next([...this.locations$.value, newLoc]);
        return of(undefined).pipe(delay(300));
    }

    update(location: OfficeLocation): Observable<void> {
        const updated = this.locations$.value.map((l) =>
            l.id === location.id ? { ...l, ...location, updated_at: new Date() } : l
        );
        this.locations$.next(updated);
        return of(undefined).pipe(delay(300));
    }

    delete(id: number): Observable<void> {
        this.locations$.next(this.locations$.value.filter((l) => l.id !== id));
        return of(undefined).pipe(delay(300));
    }
}
