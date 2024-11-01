/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import axiosInstance from '@/config/axiosConfig'

// Define interfaces for type safety
interface OverallStats {
  totalOrders: number
  totalRevenue: number
  completedOrders: number
  completionRate: number
  revenueGrowth: number
  orderGrowth: number
}

interface ChartDataPoint {
  name: string
  'Doanh thu': number
}

interface EmployeeData {
  id: number
  name: string
  totalOrders: number
  totalRevenue: number
  completedOrders: number
  pendingOrders: number
}

export default function Revenue() {
  const [timeRange, setTimeRange] = useState<string>('thisMonth')
  const [overallStats, setOverallStats] = useState<OverallStats>({
    totalOrders: 0,
    totalRevenue: 0,
    completedOrders: 0,
    completionRate: 0,
    revenueGrowth: 0,
    orderGrowth: 0
  })
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [employeeData, setEmployeeData] = useState<EmployeeData[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  // Fetch data function
  const fetchData = async () => {
    try {
      setLoading(true)

      // Fetch overall stats
      const statsData = await axiosInstance.get<any, OverallStats>(
        `/report/stats?timeRange=${timeRange}`
      )

      // Fetch monthly revenue
      const monthlyData = await axiosInstance.get<any, ChartDataPoint[]>('/report/monthly')

      // Fetch employee stats
      const employeeResponse = await axiosInstance.get<any, EmployeeData[]>(
        `/report/employees?timeRange=${timeRange}`
      )

      setOverallStats(statsData)
      setChartData(monthlyData)
      setEmployeeData(employeeResponse)
    } catch (error) {
      console.error('Error fetching data:', error)
      // Có thể thêm xử lý toast thông báo lỗi ở đây
    } finally {
      setLoading(false)
    }
  }

  // Fetch data on component mount and timeRange change
  useEffect(() => {
    fetchData()
  }, [timeRange])

  // Handle time range change
  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value)
  }

  if (loading) {
    return <div className='p-6'>Loading...</div>
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>Thống Kê Doanh Thu</h1>
        <div className='flex gap-4'>
          <Select value={timeRange} onValueChange={handleTimeRangeChange}>
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Chọn thời gian' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='thisMonth'>Tháng này</SelectItem>
              <SelectItem value='lastMonth'>Tháng trước</SelectItem>
              <SelectItem value='thisYear'>Năm nay</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Overview Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <Card>
          <CardHeader>
            <CardTitle>Tổng Đơn Hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-3xl font-bold'>{overallStats.totalOrders}</p>
            {timeRange === 'thisMonth' && (
              <p className='text-sm text-gray-500'>
                {overallStats.orderGrowth > 0 ? '+' : ''}
                {overallStats.orderGrowth}% so với tháng trước
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tổng Doanh Thu</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-3xl font-bold'>{overallStats.totalRevenue.toLocaleString()}đ</p>
            {timeRange === 'thisMonth' && (
              <p className='text-sm text-gray-500'>
                {overallStats.revenueGrowth > 0 ? '+' : ''}
                {overallStats.revenueGrowth}% so với tháng trước
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Đơn Hàng Hoàn Thành</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-3xl font-bold'>{overallStats.completedOrders}</p>
            <p className='text-sm text-gray-500'>
              Tỷ lệ hoàn thành: {overallStats.completionRate}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Biểu Đồ Doanh Số Theo Tháng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='w-full h-[400px]'>
            <LineChart
              width={1000}
              height={400}
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='name' />
              <YAxis />
              <Tooltip formatter={(value: number) => `${value.toLocaleString()}đ`} />
              <Legend />
              <Line type='monotone' dataKey='Doanh thu' stroke='#8884d8' />
            </LineChart>
          </div>
        </CardContent>
      </Card>

      {/* Detail Table */}
      <Card>
        <CardHeader>
          <CardTitle>Chi Tiết Theo Nhân Viên</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nhân viên</TableHead>
                <TableHead>Tổng đơn</TableHead>
                <TableHead>Doanh thu</TableHead>
                <TableHead>Hoàn thành</TableHead>
                <TableHead>Đang xử lý</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employeeData.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className='font-medium'>{employee.name}</TableCell>
                  <TableCell>{employee.totalOrders}</TableCell>
                  <TableCell>{employee.totalRevenue.toLocaleString()}đ</TableCell>
                  <TableCell>{employee.completedOrders}</TableCell>
                  <TableCell>{employee.pendingOrders}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
