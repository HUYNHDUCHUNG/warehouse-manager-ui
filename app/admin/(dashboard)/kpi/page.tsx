'use client'
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select } from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import axiosInstance from '@/config/axiosConfig'

type Summary = {
  totalEmployees: number
  achievedTarget: number
  pending: number
  failed: number
  totalRevenue: number
  totalOrders: number
}

type KPIInfo = {
  targetRevenue: number
  actualRevenue: number
  targetOrders: number
  actualOrders: number
  kpiPercentage: number
  status: 'pending' | 'achieved' | 'failed'
}

type MonthlyProgress = {
  revenueProgress: number
  ordersProgress: number
}

type EmployeeProgress = {
  userId: string
  userName: string
  email: string
  kpiInfo: KPIInfo
  monthlyProgress: MonthlyProgress
}

type Data = {
  summary: Summary
  employeesProgress: EmployeeProgress[]
}

const KPIDashboard = () => {
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(new Date().getFullYear())
  const [kpiData, setKpiData] = useState<Data>()
  const [loading, setLoading] = useState(false)

  // Tạo options cho select tháng và năm
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: `Tháng ${i + 1}`
  }))

  const years = Array.from({ length: 5 }, (_, i) => ({
    value: new Date().getFullYear() - i,
    label: `Năm ${new Date().getFullYear() - i}`
  }))

  // Format số tiền
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value)
  }

  // Lấy màu cho status
  const getStatusColor = (status) => {
    switch (status) {
      case 'achieved':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Lấy dữ liệu KPI
  const fetchKPIData = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance(`/kpi/report-kpi?month=${month}&year=${year}`)
      // const data = await response.json()
      console.log(response)
      setKpiData(response)
    } catch (error) {
      console.error('Error fetching KPI data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchKPIData()
  }, [month, year])

  if (!kpiData) return <div>Loading...</div>

  return (
    <div className='container mx-auto p-6'>
      {/* Filters */}
      <div className='flex gap-4 mb-6'>
        <Select value={month} onValueChange={setMonth} options={months} className='w-40' />
        <Select value={year} onValueChange={setYear} options={years} className='w-40' />
      </div>

      {/* Summary Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
        <Card>
          <CardHeader>
            <CardTitle>Tổng nhân viên</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{kpiData.summary.totalEmployees}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Đạt chỉ tiêu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-green-600'>
              {kpiData.summary.achievedTarget}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Tổng doanh thu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{formatCurrency(kpiData.summary.totalRevenue)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Tổng đơn hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{kpiData.summary.totalOrders}</div>
          </CardContent>
        </Card>
      </div>

      {/* KPI Chart */}
      <Card className='mb-6'>
        <CardHeader>
          <CardTitle>Biểu đồ KPI theo nhân viên</CardTitle>
        </CardHeader>
        <CardContent>
          <BarChart
            width={800}
            height={300}
            data={kpiData.employeesProgress}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='userName' />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey='kpiInfo.kpiPercentage' name='KPI %' fill='#8884d8' />
          </BarChart>
        </CardContent>
      </Card>

      {/* Detailed Table */}
      <Card>
        <CardHeader>
          <CardTitle>Chi tiết KPI nhân viên</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nhân viên</TableHead>
                <TableHead>Doanh số</TableHead>
                <TableHead>Số đơn</TableHead>
                <TableHead>KPI</TableHead>
                <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {kpiData.employeesProgress.map((employee) => (
                <TableRow key={employee.userId}>
                  <TableCell className='font-medium'>{employee.userName}</TableCell>
                  <TableCell>
                    {formatCurrency(employee.kpiInfo.actualRevenue)}
                    <div className='text-sm text-gray-500'>
                      Target: {formatCurrency(employee.kpiInfo.targetRevenue)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {employee.kpiInfo.actualOrders}
                    <div className='text-sm text-gray-500'>
                      Target: {employee.kpiInfo.targetOrders}
                    </div>
                  </TableCell>
                  <TableCell>{employee.kpiInfo.kpiPercentage}%</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(employee.kpiInfo.status)}>
                      {employee.kpiInfo.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default KPIDashboard
