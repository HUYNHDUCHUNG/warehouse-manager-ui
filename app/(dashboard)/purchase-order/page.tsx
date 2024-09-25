'use client'
import { PurchaseOrder } from '@/@types'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
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
import { Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const PurchaseOrder = () => {
  //   const router = useRouter()
  const [purchaseOrsers, setPurchaseOrser] = useState<PurchaseOrder[]>([]) // Sử dụng mảng Product

  useEffect(() => {
    const getProducts = async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = await axiosInstance.get<any, PurchaseOrder[]>(
          '/product' // Điều chỉnh URL để lấy tất cả sản phẩm
        )

        setPurchaseOrser(data) // Lưu danh sách sản phẩm vào state
        console.log(data)
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    }

    getProducts()
  }, []) // Không cần params, vì bạn muốn lấy tất cả sản phẩm
  return (
    <div className='p-8'>
      <h1 className='text-xl'>Quản lý nhập kho</h1>
      <div className='mt-1'>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/'>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            {/* <BreadcrumbItem>
              <BreadcrumbLink href='/purchase-order'>Quản lý nhập kho</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator /> */}
            <BreadcrumbItem>
              <BreadcrumbPage>Quản lý nhập kho</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div>
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
            {purchaseOrsers.map((pushchaseOrser, index) => (
              <TableRow key={pushchaseOrser.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{pushchaseOrser.quantity}</TableCell>
                <TableCell>{pushchaseOrser.total_price}</TableCell>
                {/* <TableCell className=''>{product.description}</TableCell> */}
                <TableCell>{pushchaseOrser.unit_price}</TableCell>
                {/* <TableCell>{product.warehouse_latest}</TableCell> */}
                {/* <TableCell>{product.quantity_warehouse_latest}</TableCell> */}
                {/* <TableCell>{product.updatedAt}</TableCell>
                <TableCell>{product.createdAt}</TableCell> */}
                <TableCell>
                  {/* <Button
                    onClick={() => onDeleteProduct(product.id)}
                    className=' bg-red-600 hover:bg-red-500'
                  >
                    <Trash size={14} />
                  </Button> */}
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
      </div>
    </div>
  )
}

export default PurchaseOrder
