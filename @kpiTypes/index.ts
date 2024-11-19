// Định nghĩa kiểu dữ liệu cho KPI

export interface KPIData {
    id?: number;
    userId: string;
    month: number;
    year: number;
    targetRevenue: number;
    actualRevenue: number;
    targetOrders: number;
    actualOrders: number;
    kpiPercentage: number;
    status: 'pending' | 'achieved' | 'failed';
}

export interface KPIQueryParams {
    userId?: string;
    startMonth: number;
    startYear: number;
    endMonth: number;
    endYear: number;
}

export interface KPIUpdateRequest {
    id?: number;
    userId: string;
    month: number;
    year: number;
    targetRevenue?: number;
    actualRevenue?: number;
    targetOrders?: number;
    actualOrders?: number;
    kpiPercentage?: number;
    status?: 'pending' | 'achieved' | 'failed';
}

export interface KPIReportData extends KPIData {
    user?: {
        fullName: string;
        email: string;
    };
}

// Response types cho API
export interface KPIResponse {
    success: boolean;
    data: KPIReportData[];
    message?: string;
}

export interface KPIUpdateResponse {
    success: boolean;
    data: KPIReportData;
    message?: string;
}