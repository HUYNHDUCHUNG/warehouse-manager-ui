/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar as CalendarIcon } from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import axiosInstance from '@/config/axiosConfig'
import BreadcrumbComponent from '@/components/breadcrumb'

// interface InventoryReport {
//   product_name: string
//   unit: string
//   beginning_inventory: number
//   quantity_imported: number
//   quantity_exported: number
//   ending_inventory: number
//   inventory_value: number
// }

interface DateRange {
  from: Date | undefined
  to: Date | undefined
}
type InventoryDetail = {
  product_id: number
  product_name: string
  category_name: string
  unit: string
  beginning_inventory: string
  quantity_imported: string
  quantity_exported: string
  ending_inventory: string
  unit_price: string
  inventory_value: string
  last_updated: string | null // có thể là null hoặc chuỗi ngày tháng
}

// Type cho phần tổng hợp
type InventorySummary = {
  total_beginning: number
  total_imported: number
  total_exported: number
  total_ending: number
  total_value: number
}

// Type cho phần dữ liệu kỳ báo cáo
type InventoryPeriod = {
  start_date: string // yyyy-mm-dd
  end_date: string // yyyy-mm-dd
}

// Type chính cho báo cáo tồn kho
type InventoryReport = {
  success: boolean
  period: InventoryPeriod
  summary: InventorySummary
  details: InventoryDetail[]
}

const InventoryReportPage = () => {
  const [report, setReports] = useState<InventoryReport>()
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState<'date' | 'month'>('month')
  const [date, setDate] = useState<DateRange>({
    from: undefined,
    to: undefined
  })
  const [selectedMonth, setSelectedMonth] = useState<string>(format(new Date(), 'MM-yyyy'))

  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(2024, i, 1)
    return {
      value: format(date, 'MM-yyyy'),
      label: format(date, 'MMMM yyyy', { locale: vi })
    }
  })

  useEffect(() => {
    fetchInventoryReports()
  }, [])

  const fetchInventoryReports = async (params?: {
    startDate?: string
    endDate?: string
    month?: string
  }) => {
    setLoading(true)
    try {
      const queryParams = new URLSearchParams()
      if (params?.startDate) queryParams.append('startDate', params.startDate)
      if (params?.endDate) queryParams.append('endDate', params.endDate)
      if (params?.month) queryParams.append('month', params.month)

      const url = `/report/inventory${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
      const data = await axiosInstance.get<any, InventoryReport>(url)
      setReports(data)
    } catch (error) {
      console.error('Error fetching inventory reports:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (filterType === 'date') {
      if (date.from && date.to) {
        fetchInventoryReports({
          startDate: format(date.from, 'yyyy-MM-dd'),
          endDate: format(date.to, 'yyyy-MM-dd')
        })
      }
    } else {
      fetchInventoryReports({ month: selectedMonth })
    }
  }

  const calculateTotalValue = () => {
    return report?.details.reduce((sum, detail) => sum + (parseInt(detail.inventory_value) || 0), 0)
  }
  const items = [{ label: 'Home', href: '/admin' }, { label: 'Báo cáo tồn kho' }]
  return (
    <div>
      <div className='mb-4'>
        <BreadcrumbComponent items={items} />
      </div>

      <div className='space-y-4'>
        <Card>
          <CardHeader>
            <CardTitle>Lọc báo cáo</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div className='space-y-2'>
                <RadioGroup
                  defaultValue='month'
                  className='flex items-center space-x-4'
                  onValueChange={(value) => setFilterType(value as 'date' | 'month')}
                >
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem value='month' id='month' />
                    <Label htmlFor='month'>Theo tháng</Label>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem value='date' id='date' />
                    <Label htmlFor='date'>Theo khoảng thời gian</Label>
                  </div>
                </RadioGroup>
              </div>

              {filterType === 'month' ? (
                <div className='flex items-center gap-4'>
                  <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger className='w-[240px]'>
                      <SelectValue placeholder='Chọn tháng' />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((month) => (
                        <SelectItem key={month.value} value={month.value}>
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className='flex flex-wrap items-center gap-4'>
                  <div className='grid gap-2'>
                    <Label>Từ ngày</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant='outline'
                          className={cn(
                            'w-[240px] justify-start text-left font-normal',
                            !date.from && 'text-muted-foreground'
                          )}
                        >
                          <CalendarIcon className='mr-2 h-4 w-4' />
                          {date.from ? format(date.from, 'dd/MM/yyyy') : 'Chọn ngày'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className='w-auto p-0' align='start'>
                        <Calendar
                          mode='single'
                          selected={date.from}
                          onSelect={(date) => setDate((prev) => ({ ...prev, from: date }))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className='grid gap-2'>
                    <Label>Đến ngày</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant='outline'
                          className={cn(
                            'w-[240px] justify-start text-left font-normal',
                            !date.to && 'text-muted-foreground'
                          )}
                        >
                          <CalendarIcon className='mr-2 h-4 w-4' />
                          {date.to ? format(date.to, 'dd/MM/yyyy') : 'Chọn ngày'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className='w-auto p-0' align='start'>
                        <Calendar
                          mode='single'
                          selected={date.to}
                          onSelect={(date) => setDate((prev) => ({ ...prev, to: date }))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              )}

              <Button type='submit'>Xem báo cáo</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tổng quan tồn kho</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='p-4 bg-blue-50 rounded-lg'>
                <p className='text-sm text-blue-600'>Tổng giá trị tồn kho</p>
                <p className='text-2xl font-bold text-blue-700'>
                  {loading ? (
                    <Skeleton className='h-8 w-32' />
                  ) : (
                    formatCurrency(calculateTotalValue() || 0)
                  )}
                </p>
              </div>
              <div className='p-4 bg-green-50 rounded-lg'>
                <p className='text-sm text-green-600'>Tổng số mặt hàng</p>
                <p className='text-2xl font-bold text-green-700'>
                  {loading ? <Skeleton className='h-8 w-32' /> : report?.details.length}
                </p>
              </div>
              <div className='p-4 bg-purple-50 rounded-lg'>
                <p className='text-sm text-purple-600'>Hàng tồn kho cao</p>
                <p className='text-2xl font-bold text-purple-700'>
                  {loading ? (
                    <Skeleton className='h-8 w-32' />
                  ) : (
                    report?.details.filter((detail) => parseInt(detail.ending_inventory) > 100)
                      .length
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className='bg-white p-4 rounded-xl'>
          <div className='mb-4'>
            <h1 className='text-xl font-bold'>Chi tiết báo cáo tồn kho</h1>
          </div>

          {loading ? (
            <>
              {[...Array(5)].map((_, index) => (
                <Skeleton key={index} className='w-full h-[30px] my-1' />
              ))}
            </>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>STT</TableHead>
                  <TableHead>Tên hàng hóa</TableHead>
                  <TableHead>Đơn vị tính</TableHead>
                  <TableHead className='text-right'>Tồn đầu kỳ</TableHead>
                  <TableHead className='text-right'>Nhập kho</TableHead>
                  <TableHead className='text-right'>Xuất kho</TableHead>
                  <TableHead className='text-right'>Tồn cuối kỳ</TableHead>
                  <TableHead className='text-right'>Giá trị tồn kho</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {report?.details.map((detail, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className='font-medium'>{detail.product_name}</TableCell>
                    <TableCell>{detail.unit}</TableCell>
                    <TableCell className='text-right'>{detail.beginning_inventory}</TableCell>
                    <TableCell className='text-right'>{detail.quantity_imported}</TableCell>
                    <TableCell className='text-right'>{detail.quantity_exported}</TableCell>
                    <TableCell className='text-right'>{detail.ending_inventory}</TableCell>
                    <TableCell className='text-right'>
                      {formatCurrency(parseInt(detail.inventory_value) || 0)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className='bg-gray-50 font-medium'>
                  <TableCell colSpan={7} className='text-right'>
                    Tổng giá trị tồn kho:
                  </TableCell>
                  <TableCell className='text-right'>
                    {formatCurrency(calculateTotalValue() || 0)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  )
}

export default InventoryReportPage
