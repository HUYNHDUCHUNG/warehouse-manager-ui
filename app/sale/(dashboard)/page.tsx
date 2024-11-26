'use client'
import { ExportOrder } from '@/@types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { DollarSign, ShoppingCart, Target, TrendingUp } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'

// Định nghĩa types (giữ nguyên như trước)

type User = {
  id: number
  fullName: string
}

type KPIInfo = {
  id: number
  userId: string
  month: number
  year: number
  targetRevenue: string
  actualRevenue: string
  targetOrders: number
  actualOrders: number
  kpiPercentage: string
  status: 'pending' | 'achieved' | 'failed'
  createdAt: string // ISO timestamp
  updatedAt: string // ISO timestamp
  user: User
}

type MonthlyProgress = {
  actualRevenue: string
  targetRevenue: string
  actualOrders: number
  targetOrders: number
  revenueProgress: number
  ordersProgress: number
  kpiPercentage: number
  status: 'pending' | 'achieved' | 'failed'
}

type MonthlyOrders = ExportOrder[] // Update if you have a specific structure for orders.

type DataStructure = {
  kpiInfo: KPIInfo
  monthlyProgress: MonthlyProgress
  monthlyOrders: MonthlyOrders
}

const SalesDashboard: React.FC = () => {
  const [kpiData, setKPI] = useState<DataStructure | undefined>()

  // Mock data cho biểu đồ theo tháng
  const monthlyData = [
    {
      month: 'T1',
      targetRevenue: 100000,
      actualRevenue: 95000,
      targetOrders: 100,
      actualOrders: 90
    },
    {
      month: 'T2',
      targetRevenue: 110000,
      actualRevenue: 105000,
      targetOrders: 110,
      actualOrders: 100
    },
    {
      month: 'T3',
      targetRevenue: 120000,
      actualRevenue: 115000,
      targetOrders: 120,
      actualOrders: 110
    },
    {
      month: 'T4',
      targetRevenue: 130000,
      actualRevenue: 125000,
      targetOrders: 130,
      actualOrders: 120
    },
    {
      month: 'T5',
      targetRevenue: 140000,
      actualRevenue: 135000,
      targetOrders: 140,
      actualOrders: 130
    },
    { month: 'T6', targetRevenue: 150000, actualRevenue: 0, targetOrders: 150, actualOrders: 0 }
  ]

  // Placeholder data
  // const data = {
  //   monthlyProgress: {
  //     actualRevenue: 135000000,
  //     targetRevenue: 150000000,
  //     actualOrders: 130,
  //     targetOrders: 150,
  //     revenueProgress: 90,
  //     ordersProgress: 86.7,
  //     kpiPercentage: 90,
  //     status: true
  //   }
  // }

  useEffect(() => {
    const fetchSaleKPI = async () => {
      try {
        const response = await fetch('/api/my-kpi', {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const result = await response.json()
        setKPI(result)
        console.log(result)
      } catch (error) {
        console.error('Error fetching products or suppliers:', error)
      }
    }
    fetchSaleKPI()
  }, [])

  // Hàm format tiền tệ
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  // Hàm tạo gradient màu
  const generateGradient = (startColor: string, endColor: string) => {
    return (
      <linearGradient id='colorGradient' x1='0%' y1='0%' x2='100%' y2='0%'>
        <stop offset='0%' stopColor={startColor} />
        <stop offset='100%' stopColor={endColor} />
      </linearGradient>
    )
  }

  return (
    <div className='p-6 space-y-6 bg-gray-50'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold text-gray-800'>
          Báo cáo KPI tháng {new Date().getMonth() + 1}/{new Date().getFullYear()}
        </h1>
        <div className='flex items-center space-x-2 text-sm text-gray-600'>
          <TrendingUp className='w-4 h-4' />
          <span>Cập nhật mới nhất: {new Date().toLocaleString()}</span>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {/* KPI Tổng Quan */}
        <Card className='bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200'>
          <CardHeader className='flex flex-row items-center justify-between'>
            <CardTitle className='text-sm font-medium text-blue-800'>Tỉ lệ KPI đạt được</CardTitle>
            <Target className='h-5 w-5 text-blue-600' />
          </CardHeader>
          <CardContent>
            <div className='text-3xl font-bold text-blue-900'>
              {kpiData?.monthlyProgress.kpiPercentage || 0}%
            </div>
            <Progress value={kpiData?.monthlyProgress.kpiPercentage} className='mt-2 bg-blue-200' />
          </CardContent>
        </Card>

        {/* Doanh Thu */}
        <Card className='bg-gradient-to-r from-green-50 to-green-100 border-green-200'>
          <CardHeader className='flex flex-row items-center justify-between'>
            <CardTitle className='text-sm font-medium text-green-800'>Doanh Thu</CardTitle>
            <DollarSign className='h-5 w-5 text-green-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-green-900'>
              {formatCurrency(Number(kpiData?.monthlyProgress.actualRevenue || 0))}
            </div>
            <div className='flex items-center space-x-2 mt-2'>
              <Progress value={kpiData?.monthlyProgress.revenueProgress} className='bg-green-200' />
              <span className='text-sm text-green-700'>
                {kpiData?.monthlyProgress.revenueProgress}%
              </span>
            </div>
            <p className='text-xs text-green-800 mt-1'>
              Mục tiêu: {formatCurrency(Number(kpiData?.monthlyProgress.targetRevenue || 0))}
            </p>
          </CardContent>
        </Card>

        {/* Số Đơn Hàng */}
        <Card className='bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200'>
          <CardHeader className='flex flex-row items-center justify-between'>
            <CardTitle className='text-sm font-medium text-purple-800'>Số Đơn Hàng</CardTitle>
            <ShoppingCart className='h-5 w-5 text-purple-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-purple-900'>
              {kpiData?.monthlyProgress.actualOrders}/{kpiData?.monthlyProgress.targetOrders}
            </div>
            <div className='flex items-center space-x-2 mt-2'>
              <Progress value={kpiData?.monthlyProgress.ordersProgress} className='bg-purple-200' />
              <span className='text-sm text-purple-700'>
                {kpiData?.monthlyProgress.ordersProgress}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Biểu đồ thống kê theo tháng */}
      <Card className='mt-6'>
        <CardHeader>
          <CardTitle className='text-gray-800'>Biểu đồ KPI theo tháng</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width='100%' height={300}>
            <LineChart data={monthlyData}>
              <defs>
                {generateGradient('#3b82f6', '#2563eb')}
                {generateGradient('#22c55e', '#16a34a')}
              </defs>
              <CartesianGrid strokeDasharray='3 3' stroke='#e0e0e0' />
              <XAxis dataKey='month' stroke='#666' />
              <YAxis stroke='#666' />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #ccc',
                  borderRadius: '8px'
                }}
                labelClassName='font-bold'
                formatter={(value, name) => {
                  if (name.includes('Revenue')) {
                    return [formatCurrency(Number(value)), name]
                  }
                  return [value, name]
                }}
              />
              <Legend />
              <Line
                type='monotone'
                dataKey='targetRevenue'
                stroke='url(#colorGradient)'
                strokeWidth={3}
                dot={{ strokeWidth: 2, r: 5 }}
                activeDot={{ r: 8 }}
              />
              <Line
                type='monotone'
                dataKey='actualRevenue'
                stroke='url(#colorGradient)'
                strokeWidth={3}
                strokeDasharray='5 5'
                dot={{ strokeWidth: 2, r: 5 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

export default SalesDashboard
