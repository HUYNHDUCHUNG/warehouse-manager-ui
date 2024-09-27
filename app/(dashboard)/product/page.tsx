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
import { Pencil, Trash } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
// import { AxiosResponse } from 'axios'
import { useEffect, useState } from 'react'

const ProductPage = () => {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([]) // Sử dụng mảng Product

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
  return (
    <div className='bg-white min-h-[100vh] p-4 rounded-xl'>
      <Link href={'/product/create'}>
        <Button>Thêm sản phẩm</Button>
      </Link>
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
              <TableHead>Tên sản phẩm</TableHead>
              <TableHead>Loại sản phẩm</TableHead>
              {/* <TableHead>Mô tả</TableHead> */}
              <TableHead>Giá</TableHead>
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
            {products.map((product, index) => (
              <TableRow key={product.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{product.product_name}</TableCell>
                <TableCell>{product.category.name}</TableCell>
                {/* <TableCell className=''>{product.description}</TableCell> */}
                <TableCell>{product.price}</TableCell>
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
                      <Button className=' bg-red-600 hover:bg-red-500'>
                        <Trash size={14} />
                      </Button>
                    }
                  />
                  {product?.id && (
                    <Link href={`/product/edit/${product.id}`}>
                      <Button className=' bg-sky-600 hover:bg-sky-500'>
                        <Pencil size={14} />
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
  )
}
export default ProductPage
