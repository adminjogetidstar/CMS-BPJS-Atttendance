import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User } from '../DTO/users.model';

@Injectable({ providedIn: 'root' })
export class UsersService {
    private users$ = new BehaviorSubject<User[]>([
        { id: 1, name: 'Febri', email: 'febri@example.com', role: 'Admin', employee_id: 'EMP001', department: 'IT', created_at: new Date(), updated_at: new Date() },
        { id: 2, name: 'Rizky', email: 'rizky@example.com', role: 'User', employee_id: 'EMP002', department: 'HR', created_at: new Date(), updated_at: new Date() },
    ]);

    getAll(): Observable<User[]> {
        return this.users$.asObservable();
    }

    add(user: User): Observable<void> {
        const newUser: User = { ...user, id: Date.now(), created_at: new Date(), updated_at: new Date() };
        this.users$.next([...this.users$.value, newUser]);
        return of();
    }

    update(user: User): Observable<void> {
        const updated = this.users$.value.map(u => u.id === user.id ? { ...user, updated_at: new Date() } : u);
        this.users$.next(updated);
        return of();
    }

    delete(id: number): Observable<void> {
        this.users$.next(this.users$.value.filter(u => u.id !== id));
        return of();
    }
}
