'use client'

import React from 'react'
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

export default function Revenue() {
  // Demo data
  const employeeData = [
    {
      id: 1,
      name: 'Nguyễn Văn A',
      totalOrders: 150,
      totalRevenue: 45000000,
      completedOrders: 142,
      pendingOrders: 8
    },
    {
      id: 2,
      name: 'Trần Thị B',
      totalOrders: 180,
      totalRevenue: 52000000,
      completedOrders: 175,
      pendingOrders: 5
    },
    {
      id: 3,
      name: 'Lê Văn C',
      totalOrders: 120,
      totalRevenue: 38000000,
      completedOrders: 115,
      pendingOrders: 5
    }
  ]

  const chartData = [
    { name: 'T1', 'Nguyễn Văn A': 35, 'Trần Thị B': 42, 'Lê Văn C': 28 },
    { name: 'T2', 'Nguyễn Văn A': 38, 'Trần Thị B': 48, 'Lê Văn C': 32 },
    { name: 'T3', 'Nguyễn Văn A': 42, 'Trần Thị B': 45, 'Lê Văn C': 30 },
    { name: 'T4', 'Nguyễn Văn A': 35, 'Trần Thị B': 45, 'Lê Văn C': 30 }
  ]

  return (
    <div className='p-6 space-y-6'>
      {/* Header */}
      <div className='flex justify-between items-center'>
        <h1 className='text-3xl font-bold'>Thống Kê Doanh Thu</h1>
        <div className='flex gap-4'>
          <Select defaultValue='thisMonth'>
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
            <p className='text-3xl font-bold'>450</p>
            <p className='text-sm text-gray-500'>+12% so với tháng trước</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tổng Doanh Thu</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-3xl font-bold'>135.000.000đ</p>
            <p className='text-sm text-gray-500'>+8% so với tháng trước</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Đơn Hàng Hoàn Thành</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-3xl font-bold'>432</p>
            <p className='text-sm text-gray-500'>Tỷ lệ hoàn thành: 96%</p>
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
              <Tooltip />
              <Legend />
              <Line type='monotone' dataKey='Nguyễn Văn A' stroke='#8884d8' />
              <Line type='monotone' dataKey='Trần Thị B' stroke='#82ca9d' />
              <Line type='monotone' dataKey='Lê Văn C' stroke='#ffc658' />
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
