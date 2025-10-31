import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Attendance } from '../DTO/attendance.model';

@Injectable({ providedIn: 'root' })
export class AttendanceService {
    private attendances$ = new BehaviorSubject<Attendance[]>([
        {
            id: 1,
            user_id: 1,
            check_in_time: new Date(),
            check_out_time: null,
            check_in_location: 'Office',
            check_out_location: null,
            check_in_photo: '',
            check_out_photo: '',
            check_in_remarks: 'On time',
            check_out_remarks: '',
            is_in_office: true,
            purpose_id: 1,
            work_duration: 480,
            status: 'Checked In',
            created_at: new Date(),
            updated_at: new Date(),
        },
    ]);

    getAll(): Observable<Attendance[]> {
        return this.attendances$.asObservable();
    }

    add(record: Attendance): Observable<void> {
        const newRecord: Attendance = {
            ...record,
            id: Date.now(),
            created_at: new Date(),
            updated_at: new Date(),
        };
        this.attendances$.next([...this.attendances$.value, newRecord]);
        return of(void 0);
    }

    update(record: Attendance): Observable<void> {
        const updated = this.attendances$.value.map((r) =>
            r.id === record.id ? { ...record, updated_at: new Date() } : r
        );
        this.attendances$.next(updated);
        return of(void 0);
    }

    delete(id: number): Observable<void> {
        this.attendances$.next(this.attendances$.value.filter((r) => r.id !== id));
        return of(void 0);
    }
}
