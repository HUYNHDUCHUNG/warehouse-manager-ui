'use client'

import React, { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, Plus, Pencil, Trash2, FileText } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export default function CustomerManagement() {
  // State for customers data
  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: 'Công ty TNHH ABC',
      contactName: 'Nguyễn Văn A',
      email: 'contact@abc.com',
      phone: '0123456789',
      address: 'Số 123 Đường XYZ, Quận 1, TP.HCM',
      type: 'corporate',
      status: 'active',
      level: 'vip',
      totalOrders: 50,
      totalRevenue: 150000000
    },
    {
      id: 2,
      name: 'Trần Thị B',
      contactName: 'Trần Thị B',
      email: 'tranthib@gmail.com',
      phone: '0987654321',
      address: 'Số 456 Đường ABC, Quận 2, TP.HCM',
      type: 'individual',
      status: 'active',
      level: 'normal',
      totalOrders: 10,
      totalRevenue: 25000000
    }
  ])

  // State for dialogs
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    contactName: '',
    email: '',
    phone: '',
    address: '',
    type: '',
    status: 'active',
    level: 'normal',
    totalOrders: 0,
    totalRevenue: 0
  })

  // Handle add customer
  const handleAdd = (e) => {
    e.preventDefault()
    const newCustomer = {
      id: customers.length + 1,
      ...formData,
      totalOrders: 0,
      totalRevenue: 0
    }
    setCustomers([...customers, newCustomer])
    setFormData({
      name: '',
      contactName: '',
      email: '',
      phone: '',
      address: '',
      type: '',
      status: 'active',
      level: 'normal',
      totalOrders: 0,
      totalRevenue: 0
    })
    setIsAddOpen(false)
  }

  // Handle edit customer
  const handleEdit = (customer) => {
    setSelectedCustomer(customer)
    setFormData(customer)
    setIsEditOpen(true)
  }

  // Handle update customer
  const handleUpdate = (e) => {
    e.preventDefault()
    const updatedCustomers = customers.map((customer) =>
      customer.id === selectedCustomer.id ? { ...formData } : customer
    )
    setCustomers(updatedCustomers)
    setIsEditOpen(false)
  }

  // Handle delete customer
  const handleDelete = (customerId) => {
    if (confirm('Bạn có chắc muốn xóa khách hàng này?')) {
      setCustomers(customers.filter((customer) => customer.id !== customerId))
    }
  }

  // Filter customers based on search
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className='p-6 space-y-6'>
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

            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button className='bg-blue-500 hover:bg-blue-600'>
                  <Plus className='mr-2 h-4 w-4' />
                  Thêm khách hàng
                </Button>
              </DialogTrigger>
              <DialogContent className='sm:max-w-[425px]'>
                <DialogHeader>
                  <DialogTitle>Thêm Khách Hàng Mới</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAdd} className='space-y-4'>
                  <div className='space-y-2'>
                    <Label>Tên khách hàng/công ty</Label>
                    <Input
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label>Người liên hệ</Label>
                    <Input
                      required
                      value={formData.contactName}
                      onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label>Email</Label>
                    <Input
                      type='email'
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label>Số điện thoại</Label>
                    <Input
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label>Địa chỉ</Label>
                    <Input
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label>Loại khách hàng</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => setFormData({ ...formData, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Chọn loại khách hàng' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='corporate'>Doanh nghiệp</SelectItem>
                        <SelectItem value='individual'>Cá nhân</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className='space-y-2'>
                    <Label>Cấp độ</Label>
                    <Select
                      value={formData.level}
                      onValueChange={(value) => setFormData({ ...formData, level: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Chọn cấp độ' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='vip'>VIP</SelectItem>
                        <SelectItem value='normal'>Thường</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type='submit' className='w-full'>
                    Thêm
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent>
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
                <TableHead>Điện thoại</TableHead>
                <TableHead>Loại KH</TableHead>
                <TableHead>Cấp độ</TableHead>
                <TableHead>Đơn hàng</TableHead>
                <TableHead>Doanh thu</TableHead>
                <TableHead className='text-right'>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className='font-medium'>{customer.name}</TableCell>
                  <TableCell>{customer.contactName}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
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
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        customer.level === 'vip'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {customer.level === 'vip' ? 'VIP' : 'Thường'}
                    </span>
                  </TableCell>
                  <TableCell>{customer.totalOrders}</TableCell>
                  <TableCell>{customer.totalRevenue.toLocaleString()}đ</TableCell>
                  <TableCell className='text-right'>
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
                          <Button
                            variant='ghost'
                            size='icon'
                            onClick={() => handleDelete(customer.id)}
                            className='text-red-500 hover:text-red-700'
                          >
                            <Trash2 className='h-4 w-4' />
                          </Button>
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

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Chỉnh Sửa Khách Hàng</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className='space-y-4'>
            <div className='space-y-2'>
              <Label>Tên khách hàng/công ty</Label>
              <Input
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className='space-y-2'>
              <Label>Người liên hệ</Label>
              <Input
                required
                value={formData.contactName}
                onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
              />
            </div>
            <div className='space-y-2'>
              <Label>Email</Label>
              <Input
                type='email'
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className='space-y-2'>
              <Label>Số điện thoại</Label>
              <Input
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className='space-y-2'>
              <Label>Địa chỉ</Label>
              <Input
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <Button type='submit' className='w-full'>
              Cập nhật
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
