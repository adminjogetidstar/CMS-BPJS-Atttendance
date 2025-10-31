export interface User {
    id: number;
    name: string;
    email: string;
    password?: string;
    role: string;
    employee_id: string;
    department: string;
    profile_photo?: string;
    created_at: Date;
    updated_at: Date;
}
