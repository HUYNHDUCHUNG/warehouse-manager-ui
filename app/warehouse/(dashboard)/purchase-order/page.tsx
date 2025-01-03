'use client'

import { PurchaseOrder } from '@/@types'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import axiosInstance from '@/config/axiosConfig'
import { useEffect, useRef, useState } from 'react'

import AlertDialogComponent from '@/components/alert-dialog'
import BreadcrumbComponent from '@/components/breadcrumb'
import { Input } from '@/components/ui/input'
import { formatCurrency } from '@/lib/utils'
import { Printer, Search, Trash } from 'lucide-react'
import Link from 'next/link'

const PurchaseOrderPage = () => {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]) // Sử dụng mảng PurchaseOrder
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [file, setFile] = useState<File | undefined>()
  const fileRef = useRef<HTMLInputElement>(null)
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

  const handleImport = () => {
    fileRef.current?.click()
    console.log(file)
  }
  const handleChangeFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    // Kiểm tra có file được chọn không
    if (!file) {
      console.log('No file selected')
      return
    }

    // Log thông tin file
    console.log('File selected:', {
      name: file.name,
      type: file.type,
      size: file.size
    })

    const formData = new FormData()
    formData.append('file', file)

    try {
      console.log('Sending request...')
      const response = await axiosInstance.post('/purchase-order/import-file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      console.log('Response:', response.data)

      // Xử lý response thành công
      if (response.data.success) {
        // Hiển thị thông báo thành công
        console.log('Import successful:', response.data.data)
      }
    } catch (error) {
      // Log chi tiết về lỗi
      console.error('Import error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      })

      // Hiển thị thông báo lỗi cho người dùng
      if (error.response?.status === 400) {
        console.error('File validation error:', error.response.data.message)
      } else {
        console.error('Server error:', error.message)
      }
    }
  }

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
  const items = [{ label: 'Home', href: '/warehouse' }, { label: 'QL nhập kho' }]
  const filteredPurchaseOrders = purchaseOrders.filter(
    (purchaseOrder) =>
      purchaseOrder?.codePurchaseOrder?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchaseOrder?.supplier.supplier_name?.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className='text-2xl font-bold'>Danh sách đơn hàng nhập</h1>
          <div className='flex gap-2'>
            <Link href={'/admin/purchase-order/create'}>
              <Button>Tạo đơn nhập mới</Button>
            </Link>

            <Button onClick={handleImport}>Import</Button>
            <Input
              className='hidden'
              type='file'
              hidden
              ref={fileRef}
              onChange={handleChangeFile}
            />
          </div>
        </div>
        <div className='flex items-center py-4'>
          <div className='relative flex-1'>
            <Search className='absolute left-2 top-2.5 h-4 w-4 text-gray-500' />
            <Input
              placeholder='Tìm kiếm theo mã phiếu nhập, tên nhà cung cấp...'
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
                <TableHead>Mã phiếu nhập</TableHead>
                <TableHead>Nhà cung cấp</TableHead>
                <TableHead>Tổng giá</TableHead>
                <TableHead>Ngày nhập</TableHead>
                <TableHead>Người tạo</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPurchaseOrders.map((order, index) => (
                <TableRow key={order.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{order.codePurchaseOrder}</TableCell>

                  <TableCell className='line-clamp-2'>{order.supplier.supplier_name}</TableCell>
                  <TableCell>{formatCurrency(parseInt(order.total_price))}</TableCell>
                  <TableCell>{order.dateImport}</TableCell>
                  <TableCell>{order.user.fullName}</TableCell>
                  <TableCell className='flex items-center gap-2'>
                    <AlertDialogComponent
                      title='Xóa phiếu nhập hàng'
                      description={`Bạn có chắc chắn muốn xóa phiếu nhập hàng này"? Hành động này không thể hoàn tác.`}
                      triggerText='Xóa'
                      actionText='Xác nhận'
                      cancelText='Hủy bỏ'
                      onConfirm={() => onDelete(order.id)} // Thay đổi hàm xóa thành onDeletePurchase
                      triggerElement={
                        <Button variant='destructive' size='icon'>
                          <Trash className='w-4 h-4' />
                        </Button>
                      }
                    />
                    {order?.id && (
                      <Button
                        onClick={() =>
                          window.open(
                            `/invoice/purchase-order/${order.id}`,
                            'Print Invoice',
                            'height=600,width=800'
                          )
                        }
                        variant='secondary'
                        size='icon'
                      >
                        <Printer className='w-4 h-4' />
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

export default PurchaseOrderPage
