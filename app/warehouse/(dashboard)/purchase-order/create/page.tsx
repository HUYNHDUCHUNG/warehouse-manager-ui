/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { formatCurrency } from '@/lib/utils'
import BreadcrumbComponent from '@/components/breadcrumb'
import { CheckCircle2 } from 'lucide-react'

const productSchema = z.object({
  productId: z.string().min(1, 'Chọn sản phẩm'),
  unitPrice: z.string().refine(
    (value) => {
      const numValue = parseFloat(value)
      return !isNaN(numValue) && numValue > 0
    },
    { message: 'Đơn giá phải lớn hơn 0' }
  ),
  quantity: z.string().refine(
    (value) => {
      const numValue = parseInt(value)
      return !isNaN(numValue) && numValue > 0
    },
    { message: 'Số lượng phải lớn hơn 0' }
  ),
  totalPrice: z.string().min(1, 'Tổng giá không hợp lệ')
})

const formSchema = z.object({
  supplier_id: z.number().min(1, 'Chọn nhà cung cấp'),
  note: z.string().optional(),
  dateImport: z.string(),
  products: z.array(productSchema).min(1, 'Cần ít nhất một sản phẩm')
})

const CreatePurchaseOrder = () => {
  const router = useRouter()
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [productList, setProductList] = useState<z.infer<typeof productSchema>[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      supplier_id: 0,
      note: '',
      dateImport: new Date().toISOString().split('T')[0],
      products: []
    }
  })

  useEffect(() => {
    const fetchProductsAndSuppliers = async () => {
      try {
        const productsResponse = await axiosInstance.get<any, Product[]>('/product')
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
      const response = await fetch('/api/purchase-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error)
      }

      router.push('/warehouse/purchase-order')
      toast({
        title: 'Thông báo',
        description: 'Thêm đơn nhập hàng thành công',
        variant: 'success',
        icon: <CheckCircle2 className='h-5 w-5' />
      })
    } catch (error) {
      console.error('Error creating purchase order:', error)
      toast({
        title: 'Thông báo',
        description: error instanceof Error ? error.message : 'Đã có lỗi khi thêm đơn hàng',
        variant: 'destructive'
      })
    }
  }

  const addProduct = () => {
    setProductList([...productList, { productId: '', unitPrice: '', quantity: '', totalPrice: '' }])
  }

  const updateProduct = (
    index: number,
    field: keyof z.infer<typeof productSchema>,
    value: string
  ) => {
    const updatedList = [...productList]
    updatedList[index] = { ...updatedList[index], [field]: value }

    if (field === 'unitPrice' || field === 'quantity') {
      const unitPrice = parseFloat(updatedList[index].unitPrice) || 0
      const quantity = parseInt(updatedList[index].quantity) || 0
      updatedList[index].totalPrice = (unitPrice * quantity).toString()
    }

    setProductList(updatedList)
    form.setValue('products', updatedList)
  }
  const totalOrderValue = useMemo(() => {
    return productList.reduce((sum, product) => {
      return sum + (parseFloat(product.totalPrice) || 0)
    }, 0)
  }, [productList])
  const items = [
    { label: 'Home', href: '/warehouse' },
    { label: 'QL nhập kho', href: '/warehouse/purchase-order' },
    { label: 'Thêm đơn nhập kho' }
  ]

  return (
    <div>
      <div className='mb-4'>
        <div className='mt-1'>
          <BreadcrumbComponent items={items} />
        </div>
      </div>
      <div className='bg-white p-4 rounded-xl'>
        <h1 className='text-2xl font-bold mb-4'>Tạo phiếu nhập hàng</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            {/* Form fields for supplier, date, etc. remain the same */}
            <div className='flex items-center gap-4'>
              <FormField
                control={form.control}
                name='supplier_id'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chọn nhà cung cấp</FormLabel>
                    <FormControl>
                      <Select onValueChange={(value) => field.onChange(parseInt(value))}>
                        <SelectTrigger className='w-[180px]'>
                          <SelectValue placeholder='Nhà cung cấp' {...field} />
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
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='dateImport'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày nhập</FormLabel>
                    <FormControl>
                      <Input placeholder='' type='date' {...field} />
                    </FormControl>
                    {/* <FormDescription>This is your public display name.</FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name='note'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ghi chú</FormLabel>
                    <FormControl>
                      <Textarea placeholder='' {...field} />
                    </FormControl>
                    {/* <FormDescription>This is your public display name.</FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <h1>Thêm sản phẩm</h1>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>STT</TableHead>
                    <TableHead>Tên sản phẩm</TableHead>
                    <TableHead>Đơn giá</TableHead>
                    <TableHead>Số lượng</TableHead>
                    <TableHead>Tổng giá</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productList.map((product, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <Select
                          value={product.productId}
                          onValueChange={(value) => updateProduct(index, 'productId', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder='Chọn sản phẩm' />
                          </SelectTrigger>
                          <SelectContent>
                            {products.map((p) => (
                              <SelectItem key={p.id} value={p.id.toString()}>
                                {p.product_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input
                          type='number'
                          value={product.unitPrice}
                          onChange={(e) => updateProduct(index, 'unitPrice', e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type='number'
                          value={product.quantity}
                          onChange={(e) => updateProduct(index, 'quantity', e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <Input type='number' value={product.totalPrice} readOnly />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={4}>Tổng cộng</TableCell>
                    <TableCell className='text-right font-bold'>
                      {formatCurrency(totalOrderValue)}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
              <Button type='button' className='mt-2' onClick={addProduct}>
                Thêm sản phẩm
              </Button>
            </div>

            <Button type='submit'>Tạo phiếu nhập hàng</Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default CreatePurchaseOrder
