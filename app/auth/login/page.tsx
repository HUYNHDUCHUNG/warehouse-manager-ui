/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React from 'react'
import { useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLocalStorage } from 'usehooks-ts'
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
// import { Label } from '@/components/ui/label'
import { Eye, EyeOff, Package } from 'lucide-react'
import axiosInstance from '@/config/axiosConfig'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { useRouter } from 'next/navigation'
// import { useToast } from "@/components/hooks/use-toast"
interface loginRespone {
  token: string
  status: boolean
}

const formSchema = z.object({
  email: z.string().min(1),
  password: z.string().min(1)
})

export default function LoginPage() {
  const router = useRouter()

  const [showPassword, setShowPassword] = useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const [isLoading, setIsLoading] = useState(false)
  const [, setTokenAccess] = useLocalStorage('token', '')
  // const { toast } = useToast()

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // e.preventDefault()
    setIsLoading(true)

    try {
      const isLoginSuccess = await axiosInstance.post<any, loginRespone>(`/auth/login`, values)
      console.log(isLoginSuccess)

      if (isLoginSuccess.status) {
        setTokenAccess(isLoginSuccess.token)
        router.replace('/')
      }
      // toast({
      //   title: "Đăng nhập thành công",
      //   description: "Bạn đã đăng nhập thành công.",
      // })
      // Ở đây bạn có thể lưu token và chuyển hướng người dùng
      // console.log('Login successful', response)
    } catch (error) {
      // toast({
      //   title: "Đăng nhập thất bại",
      //   description: error.message,
      //   variant: "destructive",
      // })
    } finally {
      setIsLoading(false)
    }
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
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent>
                  <div className='space-y-4'>
                    <div className='space-y-2'>
                      <FormField
                        control={form.control}
                        name='email'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tên đăng nhập</FormLabel>
                            <FormControl>
                              <Input placeholder='Nhập Email' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className='space-y-2'>
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
                                  required
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
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className='w-full bg-blue-600 hover:bg-blue-700'
                    disabled={isLoading}
                    type='submit'
                  >
                    Đăng nhập
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
