'use client'
import React from 'react'
import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, Package } from 'lucide-react'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-blue-200'>
      <Card className='w-full max-w-4xl shadow-lg'>
        <div className='flex flex-col md:flex-row'>
          <div className='md:w-1/2 bg-blue-600 text-white p-8 flex flex-col justify-center items-center rounded-l-lg'>
            <Package size={80} className='mb-4' />
            <h2 className='text-3xl font-bold mb-2'>Quản Lý Kho</h2>
            <p className='text-center'>Hệ thống quản lý kho thông minh và hiệu quả</p>
            {/* <div className='mt-8'>
              <img
                
                alt='Warehouse Illustration'
                className='rounded-lg shadow-md'
              />
            </div> */}
          </div>
          <div className='md:w-1/2 p-8'>
            <CardHeader>
              <CardTitle className='text-2xl font-bold text-center'>Đăng nhập</CardTitle>
              <CardDescription className='text-center'>
                Vui lòng đăng nhập để tiếp tục
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <div className='space-y-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='username'>Tên đăng nhập</Label>
                    <Input id='username' placeholder='Nhập tên đăng nhập' />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='password'>Mật khẩu</Label>
                    <div className='relative'>
                      <Input
                        id='password'
                        type={showPassword ? 'text' : 'password'}
                        placeholder='Nhập mật khẩu'
                      />
                      <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? (
                          <EyeOff className='h-4 w-4 text-gray-500' />
                        ) : (
                          <Eye className='h-4 w-4 text-gray-500' />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button className='w-full bg-blue-600 hover:bg-blue-700'>Đăng nhập</Button>
            </CardFooter>
          </div>
        </div>
      </Card>
    </div>
  )
}
