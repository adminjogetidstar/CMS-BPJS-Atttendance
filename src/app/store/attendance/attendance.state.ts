import { State, Action, StateContext, Selector } from '@ngxs/store';
import { AddAttendance, UpdateAttendance, DeleteAttendance, AutoCheckOut, SetFilter, SetPagination } from './attendance.actions';
import { AttendanceStateModel } from './attendance.models';

@State<AttendanceStateModel>({
    name: 'attendance',
    defaults: {
        records: [
            { employeeCode: 'EMP001', employeeName: 'Febriansyah', status: 'Hadir', checkIn: new Date('2025-10-28T08:05:00'), checkOut: null, updatedBy: 'System' },
            { employeeCode: 'EMP002', employeeName: 'Rizky', status: 'Izin', checkIn: null, checkOut: null, updatedBy: 'Admin' },
            { employeeCode: 'EMP003', employeeName: 'Aulia', status: 'Hadir', checkIn: new Date('2025-10-28T08:10:00'), checkOut: null, updatedBy: 'System' },
            { employeeCode: 'EMP004', employeeName: 'Bima', status: 'Sakit', checkIn: null, checkOut: null, updatedBy: 'Admin' },
        ],
        filterKeyword: '',
        filterStatus: 'Semua',
        currentPage: 1,
        itemsPerPage: 10
    }
})
export class AttendanceState {
    @Selector()
    static records(state: AttendanceStateModel) {
        return state.records;
    }

    @Selector()
    static filterKeyword(state: AttendanceStateModel) {
        return state.filterKeyword;
    }

    @Selector()
    static filterStatus(state: AttendanceStateModel) {
        return state.filterStatus;
    }

    @Selector()
    static pagination(state: AttendanceStateModel) {
        return { currentPage: state.currentPage, itemsPerPage: state.itemsPerPage };
    }

    @Selector()
    static filteredPaginated(state: AttendanceStateModel) {
        let data = state.records;

        if (state.filterKeyword) {
            const keyword = state.filterKeyword.toLowerCase();
            data = data.filter(r => r.employeeName.toLowerCase().includes(keyword));
        }

        if (state.filterStatus !== 'Semua') {
            data = data.filter(r => r.status === state.filterStatus);
        }

        const start = (state.currentPage - 1) * state.itemsPerPage;
        const end = start + state.itemsPerPage;
        return data.slice(start, end);
    }

    @Selector()
    static totalFiltered(state: AttendanceStateModel) {
        let data = state.records;

        if (state.filterKeyword) {
            const keyword = state.filterKeyword.toLowerCase();
            data = data.filter(r => r.employeeName.toLowerCase().includes(keyword));
        }

        if (state.filterStatus !== 'Semua') {
            data = data.filter(r => r.status === state.filterStatus);
        }

        return data.length;
    }

    @Action(AddAttendance)
    add({ getState, patchState }: StateContext<AttendanceStateModel>, { payload }: AddAttendance) {
        patchState({ records: [...getState().records, payload] });
    }

    @Action(UpdateAttendance)
    update({ getState, patchState }: StateContext<AttendanceStateModel>, { payload }: UpdateAttendance) {
        const updated = getState().records.map(r => r.employeeCode === payload.employeeCode ? { ...r, ...payload } : r);
        patchState({ records: updated });
    }

    @Action(DeleteAttendance)
    delete({ getState, patchState }: StateContext<AttendanceStateModel>, { employeeCode }: DeleteAttendance) {
        patchState({ records: getState().records.filter(r => r.employeeCode !== employeeCode) });
    }

    @Action(AutoCheckOut)
    autoCheckOut({ getState, patchState }: StateContext<AttendanceStateModel>, { hour }: AutoCheckOut) {
        const now = new Date();
        const updated = getState().records.map(r => {
            if (r.status === 'Hadir' && r.checkIn && !r.checkOut) {
                return { ...r, checkOut: new Date(now.setHours(hour, 0, 0, 0)), updatedBy: 'System (Auto)' };
            }
            return r;
        });
        patchState({ records: updated });
    }

    @Action(SetFilter)
    setFilter({ patchState }: StateContext<AttendanceStateModel>, { keyword, status }: SetFilter) {
        patchState({ filterKeyword: keyword, filterStatus: status, currentPage: 1 });
    }

    @Action(SetPagination)
    setPagination({ patchState }: StateContext<AttendanceStateModel>, { page, itemsPerPage }: SetPagination) {
        patchState({ currentPage: page, itemsPerPage });
    }
}
