import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Purpose } from '../DTO/purposes.model';

@Injectable({ providedIn: 'root' })
export class PurposesService {
    private purposes$ = new BehaviorSubject<Purpose[]>([
        {
            id: 1,
            name: 'Meeting',
            description: 'Untuk keperluan rapat internal dan eksternal',
            is_active: true,
            created_at: new Date(),
        },
        {
            id: 2,
            name: 'Training',
            description: 'Pelatihan karyawan',
            is_active: false,
            created_at: new Date(),
        },
    ]);

    getAll(): Observable<Purpose[]> {
        return of(this.purposes$.value).pipe(delay(300));
    }

    add(purpose: Purpose): Observable<void> {
        const newPurpose: Purpose = {
            ...purpose,
            id: Date.now(),
            created_at: new Date(),
        };
        this.purposes$.next([...this.purposes$.value, newPurpose]);
        return of(undefined).pipe(delay(300));
    }

    update(purpose: Purpose): Observable<void> {
        const updated = this.purposes$.value.map((p) =>
            p.id === purpose.id ? { ...p, ...purpose } : p
        );
        this.purposes$.next(updated);
        return of(undefined).pipe(delay(300));
    }

    delete(id: number): Observable<void> {
        this.purposes$.next(this.purposes$.value.filter((p) => p.id !== id));
        return of(undefined).pipe(delay(300));
    }
}
