'use client'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
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
import { Textarea } from '@/components/ui/textarea'
import { Product, Supplier } from '@/@types'
import axiosInstance from '@/config/axiosConfig'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const formSchema = z.object({
  product_id: z.number().min(1, 'Chọn sản phẩm'),
  supplier_id: z.number().min(1, 'Chọn nhà cung cấp'),
  quantity: z.coerce.number().min(1, 'Số lượng phải lớn hơn 0'),
  unit_price: z.coerce.number().min(0, 'Đơn giá không thể âm'),
  note: z.string().optional()
})

const CreatePurchaseOrder = () => {
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product_id: 0,
      supplier_id: 0,
      quantity: 1,
      unit_price: 0,
      note: ''
    }
  })

  const [products, setProducts] = useState<Product[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])

  useEffect(() => {
    const fetchProductsAndSuppliers = async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const productsResponse = await axiosInstance.get<any, Product[]>('/product')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const suppliersResponse = await axiosInstance.get<any, Supplier[]>('/supplier')
        setProducts(productsResponse)
        setSuppliers(suppliersResponse)
      } catch (error) {
        console.error('Error fetching products or suppliers:', error)
      }
    }
    fetchProductsAndSuppliers()
  }, [])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axiosInstance.post('/purchase-order', values)
      router.push('/purchase-order') // Chuyển hướng về trang danh sách đơn hàng nhập
    } catch (error) {
      console.error('Error creating purchase order:', error)
    }
  }

  return (
    <div className='bg-white p-4 rounded-xl'>
      <h1 className='text-2xl font-bold mb-4'>Tạo phiếu nhập hàng</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <div className='flex gap-10'>
            <div className='w-[50%] flex flex-col gap-4'>
              <FormField
                control={form.control}
                name='product_id'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sản phẩm</FormLabel>
                    <FormControl>
                      <Select onValueChange={(value) => field.onChange(parseInt(value))}>
                        <SelectTrigger className='w-[180px]'>
                          <SelectValue placeholder='Chọn sản phẩm' />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((product) => (
                            <SelectItem key={product.id} value={product.id.toString()}>
                              {product.product_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='quantity'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số lượng</FormLabel>
                    <FormControl>
                      <Input type='number' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='w-[50%] flex flex-col gap-4'>
              <FormField
                control={form.control}
                name='supplier_id'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nhà cung cấp</FormLabel>
                    <FormControl>
                      <Select onValueChange={(value) => field.onChange(parseInt(value))}>
                        <SelectTrigger className='w-[180px]'>
                          <SelectValue placeholder='Chọn nhà cung cấp' />
                        </SelectTrigger>
                        <SelectContent>
                          {suppliers.map((supplier) => (
                            <SelectItem key={supplier.id} value={supplier.id.toString()}>
                              {supplier.supplier_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='unit_price'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Đơn giá</FormLabel>
                    <FormControl>
                      <Input type='number' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <FormField
            control={form.control}
            name='note'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ghi chú</FormLabel>
                <FormControl>
                  <Textarea placeholder='Nhập ghi chú...' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type='submit'>Tạo phiếu nhập hàng</Button>
        </form>
      </Form>
    </div>
  )
}

export default CreatePurchaseOrder
