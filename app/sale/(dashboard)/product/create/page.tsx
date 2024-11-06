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
import { Category } from '@/@types'
import axiosInstance from '@/config/axiosConfig'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Textarea } from '@/components/ui/textarea'
import BreadcrumbComponent from '@/components/breadcrumb'
import { CheckCircle2 } from 'lucide-react'

const formSchema = z.object({
  product_name: z.string().min(2).max(100),
  category_id: z.number(),
  description: z.string().min(2).max(10000),
  price: z.coerce.number(),
  unit_calc: z.coerce.string().min(1).max(100)
})

const CreateProduct = () => {
  const router = useRouter()
  const { toast } = useToast()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product_name: '',
      description: '',
      price: 0
    }
  })

  const [categories, setCategories] = useState<Category[]>([])
  useEffect(() => {
    const getCategories = async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = await axiosInstance.get<any, Category[]>(
          '/category' // Điều chỉnh URL để lấy tất cả sản phẩm
        )

        setCategories(data) // Lưu danh sách sản phẩm vào state
        console.log(data)
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    }

    getCategories()
  }, [])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axiosInstance.post('/product', values)
      toast({
        title: 'Thông báo',
        description: 'Thêm sản phẩm thành công',
        variant: 'success',
        // Optional: Thêm icon cho toast
        icon: <CheckCircle2 className='h-5 w-5' />
      })
      router.push(`/sale/product`)
    } catch (error) {
      toast({
        title: 'Thông báo',
        description: error instanceof Error ? error.message : 'Đã có lỗi khi thêm sản phẩm',
        variant: 'destructive'
      })
    }
  }
  const items = [
    { label: 'Home', href: '/sale' },
    { label: 'Sản phẩm', href: '/sale/product' },
    { label: 'Thêm sản phẩm' }
  ]
  return (
    <div>
      <div className='mb-4'>
        <div className='mt-1'>
          <BreadcrumbComponent items={items} />
        </div>
      </div>
      <div className='bg-white p-4 rounded-xl'>
        <h1 className='text-xl font-bold'>Thêm sản phẩm</h1>
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
                      {/* <FormDescription>This is your public display name.</FormDescription> */}
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
                      {/* <FormDescription>This is your public display name.</FormDescription> */}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='w-[50%] gap-4 flex flex-col'>
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
                  {/* <FormDescription>This is your public display name.</FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type='submit'>Thêm sản phẩm</Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default CreateProduct
