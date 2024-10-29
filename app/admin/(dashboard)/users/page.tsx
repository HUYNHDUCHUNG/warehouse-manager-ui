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
import { Search, Plus, Pencil, Trash2 } from 'lucide-react'
import { Label } from '@/components/ui/label'

export default function UserManagement() {
  // Previous state declarations remain the same
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Nguyễn Văn A',
      email: 'vana@gmail.com',
      phone: '0123456789',
      role: 'admin',
      department: 'IT',
      status: 'active'
    },
    {
      id: 2,
      name: 'Trần Thị B',
      email: 'thib@gmail.com',
      phone: '0987654321',
      role: 'user',
      department: 'Sales',
      status: 'active'
    }
  ])

  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    status: 'active'
  })

  // Previous handlers remain the same
  const handleAdd = (e) => {
    e.preventDefault()
    const newUser = {
      id: users.length + 1,
      ...formData
    }
    setUsers([...users, newUser])
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: '',
      department: '',
      status: 'active'
    })
    setIsAddOpen(false)
  }

  const handleEdit = (user) => {
    setSelectedUser(user)
    setFormData(user)
    setIsEditOpen(true)
  }

  const handleUpdate = (e) => {
    e.preventDefault()
    const updatedUsers = users.map((user) => (user.id === selectedUser.id ? { ...formData } : user))
    setUsers(updatedUsers)
    setIsEditOpen(false)
  }

  const handleDelete = (userId) => {
    if (confirm('Bạn có chắc muốn xóa người dùng này?')) {
      setUsers(users.filter((user) => user.id !== userId))
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Custom dialog content style to ensure white background
  const dialogContentClass = 'sm:max-w-[425px] bg-white'

  return (
    <div className='p-6 space-y-6'>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-2xl font-bold'>Quản Lý Người Dùng</CardTitle>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className='bg-blue-500 hover:bg-blue-600'>
                <Plus className='mr-2 h-4 w-4' />
                Thêm người dùng
              </Button>
            </DialogTrigger>
            <DialogContent className={dialogContentClass}>
              <DialogHeader>
                <DialogTitle>Thêm Người Dùng Mới</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAdd} className='space-y-4'>
                <div className='space-y-2'>
                  <Label>Họ tên</Label>
                  <Input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                  <Label>Vai trò</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => setFormData({ ...formData, role: value })}
                  >
                    <SelectTrigger className='bg-white'>
                      <SelectValue placeholder='Chọn vai trò' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='admin'>Admin</SelectItem>
                      <SelectItem value='user'>User</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className='space-y-2'>
                  <Label>Phòng ban</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) => setFormData({ ...formData, department: value })}
                  >
                    <SelectTrigger className='bg-white'>
                      <SelectValue placeholder='Chọn phòng ban' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='IT'>IT</SelectItem>
                      <SelectItem value='Sales'>Sales</SelectItem>
                      <SelectItem value='Marketing'>Marketing</SelectItem>
                      <SelectItem value='HR'>HR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type='submit' className='w-full'>
                  Thêm
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>

        <CardContent>
          <div className='flex items-center py-4'>
            <div className='relative flex-1'>
              <Search className='absolute left-2 top-2.5 h-4 w-4 text-gray-500' />
              <Input
                placeholder='Tìm kiếm theo tên, email, phòng ban...'
                className='pl-8'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Họ tên</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Số điện thoại</TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead>Phòng ban</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className='text-right'>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className='font-medium'>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.department}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        user.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {user.status === 'active' ? 'Đang hoạt động' : 'Không hoạt động'}
                    </span>
                  </TableCell>
                  <TableCell className='text-right'>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => handleEdit(user)}
                      className='mr-2'
                    >
                      <Pencil className='h-4 w-4' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => handleDelete(user.id)}
                      className='text-red-500 hover:text-red-700'
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className={dialogContentClass}>
          <DialogHeader>
            <DialogTitle>Chỉnh Sửa Người Dùng</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className='space-y-4'>
            <div className='space-y-2'>
              <Label>Họ tên</Label>
              <Input
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
              <Label>Vai trò</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger className='bg-white'>
                  <SelectValue placeholder='Chọn vai trò' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='admin'>Admin</SelectItem>
                  <SelectItem value='user'>User</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='space-y-2'>
              <Label>Phòng ban</Label>
              <Select
                value={formData.department}
                onValueChange={(value) => setFormData({ ...formData, department: value })}
              >
                <SelectTrigger className='bg-white'>
                  <SelectValue placeholder='Chọn phòng ban' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='IT'>IT</SelectItem>
                  <SelectItem value='Sales'>Sales</SelectItem>
                  <SelectItem value='Marketing'>Marketing</SelectItem>
                  <SelectItem value='HR'>HR</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='space-y-2'>
              <Label>Trạng thái</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger className='bg-white'>
                  <SelectValue placeholder='Chọn trạng thái' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='active'>Đang hoạt động</SelectItem>
                  <SelectItem value='inactive'>Không hoạt động</SelectItem>
                </SelectContent>
              </Select>
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
