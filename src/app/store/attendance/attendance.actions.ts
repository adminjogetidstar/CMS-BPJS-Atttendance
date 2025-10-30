import { AttendanceRecord, AttendanceStatus } from "./attendance.models";

export class AddAttendance {
    static readonly type = '[Attendance] Add';
    constructor(public payload: AttendanceRecord) { }
}

export class UpdateAttendance {
    static readonly type = '[Attendance] Update';
    constructor(public payload: AttendanceRecord) { }
}

export class DeleteAttendance {
    static readonly type = '[Attendance] Delete';
    constructor(public employeeCode: string) { }
}

export class AutoCheckOut {
    static readonly type = '[Attendance] Auto Check-Out';
    constructor(public hour: number) { }
}

export class SetFilter {
    static readonly type = '[Attendance] Set Filter';
    constructor(public keyword: string, public status: AttendanceStatus | 'Semua') { }
}

export class SetPagination {
    static readonly type = '[Attendance] Set Pagination';
    constructor(public page: number, public itemsPerPage: number) { }
}
