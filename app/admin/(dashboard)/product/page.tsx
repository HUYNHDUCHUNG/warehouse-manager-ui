'use client'
import { Product } from '@/@types'
import AlertDialogComponent from '@/components/alert-dialog'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  //   TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

import axiosInstance from '@/config/axiosConfig'
import { Pencil, Search, Trash } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
// import { AxiosResponse } from 'axios'
import { useEffect, useState } from 'react'
import BreadcrumbComponent from '@/components/breadcrumb'
import { Input } from '@/components/ui/input'

const ProductPage = () => {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([]) // Sử dụng mảng Product
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const getProducts = async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = await axiosInstance.get<any, Product[]>(
          '/product' // Điều chỉnh URL để lấy tất cả sản phẩm
        )

        setProducts(data) // Lưu danh sách sản phẩm vào state
        console.log(data)
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    }

    getProducts()
  }, []) // Không cần params, vì bạn muốn lấy tất cả sản phẩm

  const onDeleteProduct = async (id: number) => {
    try {
      await axiosInstance.delete(`/product/${id}`)
      //   toast.success('Course created')
      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id))
      router.refresh()
    } catch (error) {
      //   toast.error('Something Wrong')
    }
  }

  const items = [{ label: 'Home', href: '/admin' }, { label: 'Sản phẩm' }]
  const filteredProducts = products.filter((product) =>
    product?.product_name?.toLowerCase().includes(searchTerm.toLowerCase())
  )
  return (
    <div>
      <div className='mb-4'>
        <div className='mt-1'>
          <BreadcrumbComponent items={items} />
        </div>
      </div>
      <div className='bg-white min-h-[100vh] p-4 rounded-xl'>
        <div className='flex justify-between mb-4'>
          <h1 className='text-2xl font-bold'>Danh sách sản phẩm</h1>
          <Link href={'/admin/product/create'}>
            <Button>Thêm sản phẩm</Button>
          </Link>
        </div>
        <div className='flex items-center py-4'>
          <div className='relative flex-1'>
            <Search className='absolute left-2 top-2.5 h-4 w-4 text-gray-500' />
            <Input
              placeholder='Tìm kiếm theo tên sản phẩm...'
              className='pl-8'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {!products.length ? (
          <>
            <Skeleton className='w-full h-[30px] my-1' />
            <Skeleton className='w-full h-[30px] my-1' />
            <Skeleton className='w-full h-[30px] my-1' />
            <Skeleton className='w-full h-[30px] my-1' />
            <Skeleton className='w-full h-[30px] my-1' />
            <Skeleton className='w-full h-[30px] my-1' />
            <Skeleton className='w-full h-[30px] my-1' />
            <Skeleton className='w-full h-[30px] my-1' />
            <Skeleton className='w-full h-[30px] my-1' />
            <Skeleton className='w-full h-[30px] my-1' />
            <Skeleton className='w-full h-[30px] my-1' />
          </>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>STT</TableHead>
                <TableHead>Mã sản phẩm</TableHead>
                <TableHead>Tên sản phẩm</TableHead>
                <TableHead>Loại sản phẩm</TableHead>
                {/* <TableHead>Mô tả</TableHead> */}
                {/* <TableHead>Giá</TableHead> */}
                <TableHead>Đơn vị tính</TableHead>
                <TableHead>Số lượng</TableHead>
                {/* <TableHead>Ngày nhập gần nhất</TableHead> */}
                {/* <TableHead>Số lượng </TableHead> */}
                {/* <TableHead>Ngày chỉnh sửa</TableHead> */}
                {/* <TableHead>Ngày tạo</TableHead> */}
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product, index) => (
                <TableRow key={product.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{product.code}</TableCell>
                  <TableCell>{product.product_name}</TableCell>
                  <TableCell>{product.category.name}</TableCell>
                  {/* <TableCell className=''>{product.description}</TableCell> */}
                  {/* <TableCell>{product.price}</TableCell> */}
                  <TableCell>{product.unit_calc}</TableCell>
                  <TableCell>{product.inventory_quantity}</TableCell>
                  {/* <TableCell>{product.warehouse_latest}</TableCell> */}
                  {/* <TableCell>{product.quantity_warehouse_latest}</TableCell> */}
                  {/* <TableCell>{product.updatedAt}</TableCell>
                <TableCell>{product.createdAt}</TableCell> */}
                  <TableCell className='flex items-center gap-2'>
                    <AlertDialogComponent
                      title='Xóa sản phẩm'
                      description={`Bạn có chắc chắn muốn xóa sản phẩm "${product.product_name}"? Hành động này không thể hoàn tác.`}
                      triggerText='Xóa'
                      actionText='Xác nhận'
                      cancelText='Hủy bỏ'
                      onConfirm={() => onDeleteProduct(product.id)}
                      triggerElement={
                        <Button variant='destructive' size='icon'>
                          <Trash className='w-4 h-4' />
                        </Button>
                      }
                    />
                    {product?.id && (
                      <Link href={`/admin/product/edit/${product.id}`}>
                        <Button variant='secondary' size='icon'>
                          <Pencil className='w-4 h-4' />
                        </Button>
                      </Link>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            {/* <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className='text-right'>$2,500.00</TableCell>
            </TableRow>
          </TableFooter> */}
          </Table>
        )}
      </div>
    </div>
  )
}
export default ProductPage
