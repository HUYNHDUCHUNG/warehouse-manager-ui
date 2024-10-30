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
import { Search, Plus, Pencil } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { User } from '@/@types'
import axiosInstance from '@/config/axiosConfig'
import { UserDialog } from './_components/dialog'

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const getUsers = async () => {
      try {
        const data = await axiosInstance.get<User[]>('/user')
        setUsers(data.rows)
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }
    getUsers()
  }, [])

  const handleAdd = (user: User) => {
    setUsers([...users, user])
    setIsAddOpen(false)
  }

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setIsEditOpen(true)
  }

  const handleUpdate = (updatedUser: User) => {
    const updatedUsers = users.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    setUsers(updatedUsers)
    setIsEditOpen(false)
  }

  const filteredUsers = users.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
              <UserDialog
                isOpen={isAddOpen}
                onOpenChange={setIsAddOpen}
                onSubmit={handleAdd}
                mode='add'
              />
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
                <TableHead>Địa chỉ</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className='text-right'>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className='font-medium'>
                    {user.lastName} {user.firstName}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>
                    {user.role === 'SALE'
                      ? 'Nhân viên bán hàng'
                      : user.role === 'WAREHOUSE'
                      ? 'Nhân viên kho'
                      : 'Admin'}
                  </TableCell>
                  <TableCell>{user.contract}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        user.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {user.status ? 'Đang hoạt động' : 'Không hoạt động'}
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className={dialogContentClass}>
          <UserDialog
            isOpen={isEditOpen}
            onOpenChange={setIsEditOpen}
            onSubmit={handleUpdate}
            initialData={selectedUser}
            mode='edit'
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}