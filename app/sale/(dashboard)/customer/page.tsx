/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/CustomerManagement.tsx
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
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, Plus, Pencil, Trash2, FileText, CheckCircle2 } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import axiosInstance from '@/config/axiosConfig'
import { Customer } from '@/@types'
import { CustomerDialog } from './_components/customer-dialog'
import { useToast } from '@/hooks/use-toast'
import AlertDialogComponent from '@/components/alert-dialog'
import BreadcrumbComponent from '@/components/breadcrumb'

export default function CustomerManagement() {
  const { toast } = useToast()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const getCustomers = async () => {
      try {
        const data = await axiosInstance.get<any, Customer[]>('/customer')
        setCustomers(data)
      } catch (error) {
        console.error('Error fetching customers:', error)
      }
    }
    getCustomers()
  }, [])

  const handleAdd = async (formData: Customer) => {
    const newCustomer: Partial<Customer> = {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      contract: formData.contract,
      type: formData.type
    }
    console.log(newCustomer)
    try {
      const customer = await axiosInstance.post<any, Customer>('/customer', newCustomer)
      setCustomers([...customers, customer])
      toast({
        title: 'Thông báo',
        description: 'Thêm khách hàng thành công',
        variant: 'success',
        icon: <CheckCircle2 className='h-5 w-5' />
      })
    } catch (error) {
      toast({
        title: 'Thông báo',
        description: error instanceof Error ? error.message : 'Đã có lỗi khi thêm khách hàng',
        variant: 'destructive'
      })
    } finally {
      setIsAddOpen(false)
    }
  }

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer)
    setIsEditOpen(true)
  }

  const handleUpdate = async (formData: Customer) => {
    if (!selectedCustomer) return

    const updatedCustomer: Customer = {
      ...selectedCustomer,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      contract: formData.contract,
      type: formData.type
    }
    try {
      await axiosInstance.patch<any, Customer>(`/customer/${selectedCustomer.id}`, updatedCustomer)
      const updatedCustomers = customers.map((customer) =>
        customer.id === selectedCustomer.id ? updatedCustomer : customer
      )
      setCustomers(updatedCustomers)

      toast({
        title: 'Thông báo',
        description: 'Chỉnh sửa khách hàng thành công',
        variant: 'success',
        // Optional: Thêm icon cho toast
        icon: <CheckCircle2 className='h-5 w-5' />
      })
    } catch (error) {
      toast({
        title: 'Thông báo',
        description: error instanceof Error ? error.message : 'Đã có lỗi khi chỉnh sửa',
        variant: 'destructive'
      })
    } finally {
      setIsEditOpen(false)
      setSelectedCustomer(null)
    }
  }

  const handleDelete = async (customerId: string) => {
    try {
      await axiosInstance.delete<any, Customer>(`/customer/${customerId}`)

      setCustomers(customers.filter((customer) => customer.id !== customerId))
      toast({
        title: 'Thông báo',
        description: 'Xóa khách hàng thành công',
        variant: 'success',
        // Optional: Thêm icon cho toast
        icon: <CheckCircle2 className='h-5 w-5' />
      })
    } catch (error) {
      toast({
        title: 'Thông báo',
        description: error instanceof Error ? error.message : 'Đã có lỗi khi xóa',
        variant: 'destructive'
      })
    }
  }

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  )
  const items = [{ label: 'Home', href: '/sale' }, { label: 'QL khách hàng' }]

  return (
    <div>
      <div>
        <BreadcrumbComponent items={items} />
      </div>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-2xl font-bold'>Quản Lý Khách Hàng</CardTitle>
          <div className='flex space-x-2'>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant='outline'>
                    <FileText className='h-4 w-4' />
                    <span className='ml-2'>Xuất Excel</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Xuất danh sách khách hàng</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Button className='bg-blue-500 hover:bg-blue-600' onClick={() => setIsAddOpen(true)}>
              <Plus className='mr-2 h-4 w-4' />
              Thêm khách hàng
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {/* Search input */}
          <div className='flex items-center py-4'>
            <div className='relative flex-1'>
              <Search className='absolute left-2 top-2.5 h-4 w-4 text-gray-500' />
              <Input
                placeholder='Tìm kiếm theo tên, email, số điện thoại...'
                className='pl-8'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên KH/Công ty</TableHead>
                <TableHead>Liên hệ</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Loại KH</TableHead>
                <TableHead>Điện thoại</TableHead>
                {/* <TableHead>Cấp độ</TableHead> */}
                {/* <TableHead>Đơn hàng</TableHead> */}
                {/* <TableHead>Doanh thu</TableHead> */}
                <TableHead className='text-right'>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className='font-medium'>{customer.fullName}</TableCell>
                  <TableCell>{customer.contract || 'chưa có'}</TableCell>
                  <TableCell>{customer.email || 'chưa có'}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        customer.type === 'corporate'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {customer.type === 'corporate' ? 'Doanh nghiệp' : 'Cá nhân'}
                    </span>
                  </TableCell>
                  <TableCell>{customer.phone || 'chưa có'}</TableCell>
                  {/* <TableCell>{customer.totalOrders}</TableCell>
                  <TableCell>{customer.totalRevenue.toLocaleString()}đ</TableCell> */}
                  <TableCell className='text-right flex items-center justify-end'>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => handleEdit(customer)}
                            className='mr-2'
                          >
                            <Pencil className='h-4 w-4' />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Chỉnh sửa</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <AlertDialogComponent
                            title='Xóa khách hàng'
                            description={`Bạn có chắc chắn muốn xóa khách hàng "${customer.fullName}"? Hành động này không thể hoàn tác.`}
                            triggerText='Xóa'
                            actionText='Xác nhận'
                            cancelText='Hủy bỏ'
                            onConfirm={() => handleDelete(customer.id)}
                            triggerElement={
                              <Button
                                variant='ghost'
                                size='icon'
                                className='text-red-500 hover:text-red-700'
                              >
                                <Trash2 className='h-4 w-4' />
                              </Button>
                            }
                          />
                          {/* <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => handleDelete(customer.id)}
                            className='text-red-500 hover:text-red-700'
                          >
                            <Trash2 className='h-4 w-4' />
                          </Button> */}
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Xóa</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Dialog */}
      <CustomerDialog
        isOpen={isAddOpen}
        onOpenChange={setIsAddOpen}
        onSubmit={handleAdd}
        mode='add'
      />

      {/* Edit Dialog */}
      <CustomerDialog
        isOpen={isEditOpen}
        onOpenChange={setIsEditOpen}
        onSubmit={handleUpdate}
        initialData={
          selectedCustomer
            ? {
                id: selectedCustomer.id,
                fullName: selectedCustomer.fullName,
                email: selectedCustomer.email,
                phone: selectedCustomer.phone,
                contract: selectedCustomer.contract,
                type: selectedCustomer.type,
                rolte: selectedCustomer.rolte // Add this line
              }
            : undefined
        }
        mode='edit'
      />
    </div>
  )
}
