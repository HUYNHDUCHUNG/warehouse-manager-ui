/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Category, Product } from '@/@types'
import axiosInstance from '@/config/axiosConfig'
import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Textarea } from '@/components/ui/textarea'
import BreadcrumbComponent from '@/components/breadcrumb'
import { CheckCircle2 } from 'lucide-react'

const formSchema = z.object({
  product_name: z.string().min(2).max(100),
  category_id: z.number(),
  description: z.string().min(2).max(10000),
  price: z.coerce.number(),
  unit_calc: z.coerce.string().min(1).max(100),
  inventory_quantity: z.coerce.number().min(0)
})

const EditProduct = () => {
  const router = useRouter()
  const { toast } = useToast()
  const { productId } = useParams() // Lấy id của sản phẩm từ URL
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product_name: '',
      category_id: 0,
      description: '',
      price: 0,
      unit_calc: '',
      inventory_quantity: 0
    }
  })

  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getCategories = async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = await axiosInstance.get<any, Category[]>('/category')
        console.log(data)
        setCategories(data)
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    const getProduct = async () => {
      try {
        const data = await axiosInstance.get<Product, any>(`/product/${productId}`)
        console.log(productId)
        console.log(data)
        form.reset(data) // Đặt dữ liệu của sản phẩm vào form
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching product:', error)
      }
    }

    getCategories()
    getProduct()
  }, [productId, form])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axiosInstance.patch(`/product/${productId}`, values)
      toast({
        title: 'Thông báo',
        description: 'Sửa sản phẩm thành công',
        variant: 'success',
        // Optional: Thêm icon cho toast
        icon: <CheckCircle2 className='h-5 w-5' />
      })
      router.push(`/warehouse/product`)
    } catch (error) {
      console.error('Error updating product:', error)
      toast({
        title: 'Thông báo',
        description: error instanceof Error ? error.message : 'Đã có lỗi khi sửa sản phẩm',
        variant: 'destructive'
      })
    }
  }

  if (isLoading) return <p>Loading...</p>

  const items = [
    { label: 'Home', href: '/warehouse' },
    { label: 'Sản phẩm', href: '/warehouse/product' },
    { label: 'Sửa sản phẩm' }
  ]
  return (
    <div>
      <div className='mb-4'>
        <div className='mt-1'>
          <BreadcrumbComponent items={items} />
        </div>
      </div>
      <div className='bg-white p-4 rounded-xl'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <div className='flex gap-10'>
              <div className='w-[50%] flex flex-col gap-4'>
                <FormField
                  control={form.control}
                  name='product_name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên sản phẩm</FormLabel>
                      <FormControl>
                        <Input placeholder='' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='unit_calc'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Đơn vị tính</FormLabel>
                      <FormControl>
                        <Input placeholder='' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='w-[50%] gap-4'>
                <FormField
                  control={form.control}
                  name='category_id'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loại sản phẩm</FormLabel>
                      <FormControl>
                        <Select onValueChange={(value) => field.onChange(parseInt(value))}>
                          <SelectTrigger className='w-[180px]'>
                            <SelectValue placeholder='Loại sản phẩm' {...field} />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id.toString()}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='price'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Giá sản phẩm</FormLabel>
                      <FormControl>
                        <Input placeholder='' {...field} type='number' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả sản phẩm</FormLabel>
                  <FormControl>
                    <Textarea placeholder='' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='inventory_quantity'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số lượng tồn kho</FormLabel>
                  <FormControl>
                    <Input placeholder='' {...field} type='number' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit'>Cập nhật sản phẩm</Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default EditProduct
