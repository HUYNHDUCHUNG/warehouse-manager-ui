/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import axiosInstance from '@/config/axiosConfig'
import { Button } from '@/components/ui/button'

interface EmployeeData {
  id: number
  name: string
  totalOrders: number
  totalRevenue: number
  completedOrders: number
  pendingOrders: number
}
const EmployeeTable = () => {
  const [employees, setEmployees] = useState<EmployeeData[]>([])
  const [loading, setLoading] = useState(true)
  //   const [error, setError] = useState(null)

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const topEmployee = await axiosInstance.get<any, EmployeeData[]>(`/report/employees`)

        setEmployees(topEmployee)
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }

    fetchEmployees()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardContent className='p-4'>
          <div className='text-center'>Đang tải dữ liệu...</div>
        </CardContent>
      </Card>
    )
  }

  //   if (error) {
  //     return (
  //       <Card>
  //         <CardContent className='p-4'>
  //           <div className='text-red-500'>Lỗi: {error}</div>
  //         </CardContent>
  //       </Card>
  //     )
  //   }

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <div className='font-bold'>Nhân viên hàng đầu</div>
        <Button variant='link'>Báo cáo</Button>
      </CardHeader>
      <CardContent className='p-4'>
        <table className='w-full'>
          <thead>
            <tr className='border-b'>
              <th className='text-left p-2'>STT</th>
              <th className='text-left p-2'>Nhân viên</th>
              <th className='text-left p-2'>SL đơn</th>
              <th className='text-left p-2'>Hoàn thành</th>
              <th className='text-left p-2'>Đang xử lý</th>
              <th className='text-left p-2'>Tổng thu nhập</th>
            </tr>
          </thead>
          <tbody>
            {employees.length > 0 ? (
              employees.map((employee, index) => (
                <tr key={employee.id} className='border-b hover:bg-gray-50'>
                  <td className='p-2'>{index + 1}</td>
                  <td className='p-2'>{employee.name}</td>
                  <td className='p-2'>{employee.totalOrders}</td>
                  <td className='p-2'>{employee.completedOrders}</td>
                  <td className='p-2'>{employee.pendingOrders}</td>
                  <td className='p-2'>{formatCurrency(employee.totalRevenue)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className='text-center p-4 text-gray-500'>
                  Không có dữ liệu nhân viên
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}

export default EmployeeTable
