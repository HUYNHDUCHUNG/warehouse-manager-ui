import { ExportOrder } from '@/@types';
import { cookies } from 'next/headers'

type User = {
    id: number;
    fullName: string;
};

type KPIInfo = {
    id: number;
    userId: string;
    month: number;
    year: number;
    targetRevenue: string;
    actualRevenue: string;
    targetOrders: number;
    actualOrders: number;
    kpiPercentage: string;
    status: 'pending' | 'achieved' | 'failed';
    createdAt: string; // ISO timestamp
    updatedAt: string; // ISO timestamp
    user: User;
};

type MonthlyProgress = {
    actualRevenue: string;
    targetRevenue: string;
    actualOrders: number;
    targetOrders: number;
    revenueProgress: number;
    ordersProgress: number;
    kpiPercentage: number;
    status: 'pending' | 'achieved' | 'failed';
};

type MonthlyOrders = ExportOrder[]; // Update if you have a specific structure for orders.

type DataStructure = {
    kpiInfo: KPIInfo;
    monthlyProgress: MonthlyProgress;
    monthlyOrders: MonthlyOrders;
};
export async function GET() {
    try {
        // Lấy token từ cookies
        const token = cookies().get('token')?.value
        if (!token) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Lấy dữ liệu từ body request

        // Gọi API để tạo export order
        const response = await fetch('http://localhost:8017/api/kpi/my-kpi', {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })

        if (!response.ok) {
            const error = await response.json()
            return Response.json(
                { error: error.message || 'Đã có lỗi khi lấy kpi' },
                { status: response.status }
            )
        }

        const data = (await response.json()).data as DataStructure
        console.log(data)
        return Response.json(data)
    } catch (error) {
        console.error('Error get kpi:', error)
        return Response.json(
            { error: error instanceof Error ? error.message : 'Đã có lỗi khi lấy kpi' },
            { status: 500 }
        )
    }
}