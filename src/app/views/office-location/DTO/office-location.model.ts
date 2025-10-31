export interface OfficeLocation {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    radius: number;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}
