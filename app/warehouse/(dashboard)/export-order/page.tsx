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
import { ExportOrder } from '@/@types'

import { Search, Trash } from 'lucide-react'
import Link from 'next/link'
import AlertDialogComponent from '@/components/alert-dialog'
import { formatCurrency } from '@/lib/utils'
import BreadcrumbComponent from '@/components/breadcrumb'
import { Input } from '@/components/ui/input'

const ExportOrderPage = () => {
  const [exportOrders, setExportOrders] = useState<ExportOrder[]>([]) // Sử dụng mảng PurchaseOrder
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const getExportOrders = async () => {
      try {
        // Gọi API để lấy danh sách đơn hàng nhập kho
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = await axiosInstance.get<any, ExportOrder[]>('/export-order')
        console.log(data)
        setExportOrders(data) // Lưu danh sách đơn hàng vào state
      } catch (error) {
        console.error('Error fetching purchase orders:', error)
      } finally {
        setLoading(false)
      }
    }
    getExportOrders()
  }, [])

  const onDelete = async (id: number) => {
    try {
      // Gọi API xóa đơn mua hàng theo id
      await axiosInstance.delete(`/export-order/${id}`)

      // Cập nhật lại danh sách đơn hàng sau khi xóa
      setExportOrders((prevExports) => prevExports.filter((exportOrders) => exportOrders.id !== id))
    } catch (error) {
      console.error('Error deleting purchase:', error)
      // Hiển thị thông báo lỗi nếu cần (bạn có thể dùng toast hoặc alert)
    }
  }

  const onComfirm = async (id: number) => {
    try {
      window.open(`/invoice/export-order/${id}`, '_blank')
      await axiosInstance.patch(`/export-order/${id}`)
    } catch (error) {
      console.error('Error update purchase:', error)
    }
  }
  const items = [{ label: 'Home', href: '/admin' }, { label: 'QL xuất kho' }]
  const filteredExportOrders = exportOrders.filter(
    (exportOrder) =>
      exportOrder?.codeExportOrder?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exportOrder?.customer.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  )
  return (
    <div>
      <div>
        <div className='mb-4'>
          <div className='mt-1'>
            <BreadcrumbComponent items={items} />
          </div>
        </div>
      </div>
      <div className='bg-white p-4 rounded-xl'>
        <div className='flex justify-between mb-4'>
          <h1 className='text-xl font-bold'>Danh sách đơn hàng xuất</h1>
          <Link href={'/admin/export-order/create'}>
            <Button>Tạo đơn xuất mới</Button>
          </Link>
        </div>
        <div className='flex items-center py-4'>
          <div className='relative flex-1'>
            <Search className='absolute left-2 top-2.5 h-4 w-4 text-gray-500' />
            <Input
              placeholder='Tìm kiếm theo mã phiếu xuất, tên khách hàng...'
              className='pl-8'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
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
                <TableHead>Mã phiếu xuất</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Tổng giá</TableHead>
                <TableHead>Ngày tạo đơn</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Người tạo</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExportOrders.map((exportOrder, index) => (
                <TableRow key={exportOrder.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{exportOrder.codeExportOrder}</TableCell>

                  <TableCell className='line-clamp-2'>{exportOrder.customer.fullName}</TableCell>
                  <TableCell>{formatCurrency(parseInt(exportOrder.total_price))}</TableCell>
                  <TableCell>{exportOrder.dateExport}</TableCell>
                  <TableCell>
                    {exportOrder.status ? (
                      'Đã hoàn thành'
                    ) : exportOrder.isFullyAvailable ? (
                      <span className='bg-green-800 text-white'>Đủ hàng</span>
                    ) : (
                      <span className='bg-red-600 text-white'>Thiếu hàng</span>
                    )}
                  </TableCell>
                  <TableCell>{exportOrder.user.fullName}</TableCell>
                  <TableCell className='flex items-center gap-2'>
                    <AlertDialogComponent
                      title='Xóa phiếu nhập hàng'
                      description={`Bạn có chắc chắn muốn xóa phiếu nhập hàng này"? Hành động này không thể hoàn tác.`}
                      triggerText='Xóa'
                      actionText='Xác nhận'
                      cancelText='Hủy bỏ'
                      onConfirm={() => onDelete(exportOrder.id)} // Thay đổi hàm xóa thành onDeletePurchase
                      triggerElement={
                        <Button className='bg-red-600 hover:bg-red-500'>
                          <Trash size={14} />
                        </Button>
                      }
                    />

                    {exportOrder?.id && (
                      <Link href={`/admin/export-order/detail/${exportOrder.id}`}>
                        <Button className='bg-sky-600 hover:bg-sky-500'>Detail</Button>
                      </Link>
                    )}
                    {exportOrder.isFullyAvailable && !exportOrder.status && (
                      <Button
                        onClick={() => onComfirm(exportOrder.id)}
                        className='bg-sky-600 hover:bg-sky-500'
                      >
                        Xác nhận
                      </Button>
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

export default ExportOrderPage
