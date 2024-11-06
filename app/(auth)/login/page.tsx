'use client'

import React, { useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { Package, Eye, EyeOff, CheckCircle2 } from 'lucide-react'

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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
// import { loginAction } from '@/action/auth'
import { useToast } from '@/hooks/use-toast'
import { loginAction } from '@/action/auth/login'

const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ').min(1, 'Email là bắt buộc'),
  password: z.string().min(3, 'Mật khẩu phải có ít nhất 3 ký tự')
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = async (values: LoginFormData) => {
    setIsLoading(true)
    try {
      const response = await loginAction(values)
      console.log(response)
      if (response.data.status) {
        toast({
          title: 'Đăng nhập thành công',
          description: 'Chuyển hướng đến trang chủ...',
          variant: 'success',
          // Optional: Thêm icon cho toast
          icon: <CheckCircle2 className='h-5 w-5' />
        })
        if (response.data.role === 'AD') {
          router.replace('/admin')
        }
        if (response.data.role === 'WAREHOUSE') {
          router.replace('/warehouse')
        }
        if (response.data.role === 'SALE') {
          router.replace('/sale')
        }

        // Chuyển hướng dựa vào role từ response
        // const dashboardPath =
        //   response.data.role === 'ADMIN' ? '/dashboard/admin' : '/dashboard/warehouse'
      }
    } catch (error) {
      toast({
        title: 'Đăng nhập thất bại',
        description: error instanceof Error ? error.message : 'Đã có lỗi xảy ra',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-blue-200'>
      <Card className='w-full max-w-4xl shadow-lg'>
        <div className='flex flex-col md:flex-row'>
          {/* Left side - Branding */}
          <div className='md:w-1/2 bg-blue-600 text-white p-8 flex flex-col justify-center items-center rounded-l-lg'>
            <Package size={80} className='mb-4' />
            <h2 className='text-3xl font-bold mb-2'>Quản Lý Kho</h2>
            <p className='text-center'>Hệ thống quản lý kho thông minh và hiệu quả</p>
          </div>

          {/* Right side - Login Form */}
          <div className='md:w-1/2 p-8'>
            <CardHeader>
              <CardTitle className='text-2xl font-bold text-center'>Đăng nhập</CardTitle>
              <CardDescription className='text-center'>
                Vui lòng đăng nhập để tiếp tục
              </CardDescription>
            </CardHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                <CardContent className='space-y-4'>
                  <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder='example@gmail.com' type='email' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='password'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mật khẩu</FormLabel>
                        <FormControl>
                          <div className='relative'>
                            <Input
                              type={showPassword ? 'text' : 'password'}
                              placeholder='Nhập mật khẩu'
                              {...field}
                            />
                            <Button
                              type='button'
                              variant='ghost'
                              size='icon'
                              className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className='h-4 w-4 text-gray-500' />
                              ) : (
                                <Eye className='h-4 w-4 text-gray-500' />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>

                <CardFooter>
                  <Button
                    type='submit'
                    className='w-full bg-blue-600 hover:bg-blue-700'
                    disabled={isLoading}
                  >
                    {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </div>
        </div>
      </Card>
    </div>
  )
}
