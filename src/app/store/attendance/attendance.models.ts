export type AttendanceStatus = 'Hadir' | 'Izin' | 'Sakit' | 'Alfa';

export interface AttendanceRecord {
    employeeCode: string;
    employeeName: string;
    status: AttendanceStatus;
    checkIn: Date | null;
    checkOut: Date | null;
    updatedBy: string;
}

export interface AttendanceStateModel {
    records: AttendanceRecord[];
    filterKeyword: string;
    filterStatus: AttendanceStatus | 'Semua';
    currentPage: number;
    itemsPerPage: number;
}
