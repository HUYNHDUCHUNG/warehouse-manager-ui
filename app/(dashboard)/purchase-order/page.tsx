'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import axiosInstance from '@/config/axiosConfig'
import { PurchaseOrder } from '@/@types'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'

import { Pencil, Trash } from 'lucide-react'
import Link from 'next/link'
import AlertDialogComponent from '@/components/alert-dialog'

const PurchaseOrderPage = () => {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]) // Sử dụng mảng PurchaseOrder
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getPurchaseOrders = async () => {
      try {
        // Gọi API để lấy danh sách đơn hàng nhập kho
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = await axiosInstance.get<any, PurchaseOrder[]>('/purchase-order')
        console.log(data)
        setPurchaseOrders(data) // Lưu danh sách đơn hàng vào state
      } catch (error) {
        console.error('Error fetching purchase orders:', error)
      } finally {
        setLoading(false)
      }
    }
    getPurchaseOrders()
  }, [])

  const onDelete = async (id: number) => {
    try {
      // Gọi API xóa đơn mua hàng theo id
      await axiosInstance.delete(`/purchase-order/${id}`)

      // Cập nhật lại danh sách đơn hàng sau khi xóa
      setPurchaseOrders((prevPurchases) => prevPurchases.filter((purchase) => purchase.id !== id))
    } catch (error) {
      console.error('Error deleting purchase:', error)
      // Hiển thị thông báo lỗi nếu cần (bạn có thể dùng toast hoặc alert)
    }
  }

  return (
    <div>
      <div>
        <div className='mb-4'>
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
        </div>
      </div>
      <div className='bg-white p-4 rounded-xl'>
        <div className='flex justify-between mb-4'>
          <h1 className='text-xl font-bold'>Danh sách đơn hàng nhập</h1>
          <Link href={'/purchase-order/create'}>
            <Button>Tạo đơn nhập mới</Button>
          </Link>
        </div>
        {loading ? (
          <div>
            <Skeleton className='w-full h-[30px] my-2' />
            <Skeleton className='w-full h-[30px] my-2' />
            <Skeleton className='w-full h-[30px] my-2' />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>STT</TableHead>
                <TableHead>Mã phiếu nhập</TableHead>
                <TableHead>Nhà cung cấp</TableHead>
                <TableHead>Tổng giá</TableHead>
                <TableHead>Ghi chú</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchaseOrders.map((order, index) => (
                <TableRow key={order.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{order.codePurchaseOrder}</TableCell>

                  <TableCell className='line-clamp-2'>{order.supplier.supplier_name}</TableCell>
                  <TableCell>{order.total_price}</TableCell>
                  <TableCell>{order.note}</TableCell>
                  <TableCell className='flex items-center gap-2'>
                    <AlertDialogComponent
                      title='Xóa phiếu nhập hàng'
                      description={`Bạn có chắc chắn muốn xóa phiếu nhập hàng này"? Hành động này không thể hoàn tác.`}
                      triggerText='Xóa'
                      actionText='Xác nhận'
                      cancelText='Hủy bỏ'
                      onConfirm={() => onDelete(order.id)} // Thay đổi hàm xóa thành onDeletePurchase
                      triggerElement={
                        <Button className='bg-red-600 hover:bg-red-500'>
                          <Trash size={14} />
                        </Button>
                      }
                    />
                    {order?.id && (
                      <Link href={`/purchase/edit/${order.id}`}>
                        {' '}
                        {/* Thay đổi URL để chỉnh sửa đơn mua hàng */}
                        <Button className='bg-sky-600 hover:bg-sky-500'>
                          <Pencil size={14} />
                        </Button>
                      </Link>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}

export default PurchaseOrderPage
