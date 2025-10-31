export interface Attendance {
    id: number;
    user_id: number;
    check_in_time: string | Date;
    check_out_time?: string | Date | null;
    check_in_location?: string | null;
    check_out_location?: string | null;
    check_in_photo?: string | null;
    check_out_photo?: string | null;
    check_in_remarks?: string | null;
    check_out_remarks?: string | null;
    is_in_office: boolean;
    purpose_id: number;
    work_duration?: number | null;
    status: string;
    created_at: string | Date;
    updated_at: string | Date;
}
