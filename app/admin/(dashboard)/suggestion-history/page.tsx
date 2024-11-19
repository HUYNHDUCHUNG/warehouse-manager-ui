'use client'
import { Product, User } from '@/@types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import axiosInstance from '@/config/axiosConfig'
import { Printer } from 'lucide-react'
import { useEffect, useState } from 'react'

interface InventoryRequest {
  id: number
  productId: string
  product: Product
  user: User
  currentInventory: number
  suggestedQuantity: number
  totalUnprocessedOrders: number
  status: string // thêm các trạng thái khác nếu cần
  note?: string
  createdAt: string // có thể chuyển thành `Date` nếu bạn muốn làm việc với đối tượng Date
}

const ImportSuggestionHistory = () => {
  const [selectedItem, setSelectedItem] = useState(null)
  const [showInvoice, setShowInvoice] = useState(false)
  const [suggestions, setSuggestion] = useState<InventoryRequest[]>([])
  useEffect(() => {
    const getSuggestion = async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = await axiosInstance.get<any, InventoryRequest[]>(
          '/import-suggestion' // Điều chỉnh URL để lấy tất cả sản phẩm
        )

        setSuggestion(data) // Lưu danh sách sản phẩm vào state
        console.log(data)
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    }

    getSuggestion()
  }, []) // Không cần params, vì bạn muốn lấy tất cả sản phẩm

  const handleShowInvoice = (item) => {
    setSelectedItem(item)
    setShowInvoice(true)
  }

  const handleConfirmProcessed = (item) => {
    // Add your confirmation logic here
    console.log('Xác nhận đã xử lý:', item)
  }

  const Invoice = ({ item }) => (
    <div className='space-y-4'>
      <div className='flex justify-between'>
        <div>
          <h3 className='font-bold'>Hóa Đơn Đề Xuất Nhập Hàng</h3>
          <p>Ngày: {new Date(item.createdAt).toLocaleDateString()}</p>
        </div>
        <div className='text-right'>
          <p>Số hóa đơn: {item.id}</p>
          <p>Đề xuất bởi: {item?.user?.fullName || 'Hệ thống'}</p>
        </div>
      </div>

      <table className='w-full border-collapse border'>
        <thead>
          <tr className='bg-gray-100'>
            <th className='p-2 border'>Mã SP</th>
            <th className='p-2 border'>Tên Sản Phẩm</th>
            <th className='p-2 border'>Tồn Kho Hiện Tại</th>
            <th className='p-2 border'>Số Lượng Đề Xuất</th>
            <th className='p-2 border'>Đơn Vị</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className='p-2 border'>{item.productId}</td>
            <td className='p-2 border'>{item.product.product_name}</td>
            <td className='p-2 border'>{item.currentInventory}</td>
            <td className='p-2 border'>{item.suggestedQuantity}</td>
            <td className='p-2 border'>{item.product.unit_calc}</td>
          </tr>
        </tbody>
      </table>

      <div className='mt-4'>
        <p>
          <strong>Tổng Đơn Hàng Chưa Xử Lý:</strong> {item.totalUnprocessedOrders}
        </p>
        <p>
          <strong>Ghi Chú:</strong> {item.note}
        </p>
      </div>
    </div>
  )

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>Lịch Sử Đề Xuất Nhập Hàng</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead>
              <tr className='border-b'>
                <th className='p-2 text-left'>Sản Phẩm</th>
                <th className='p-2 text-left'>Tồn Kho Hiện Tại</th>
                <th className='p-2 text-left'>SL Đề Xuất</th>
                <th className='p-2 text-left'>Trạng Thái</th>
                <th className='p-2 text-left'>Ngày</th>

                <th className='p-2 text-left'>Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {suggestions.map((item) => (
                <tr key={item.id} className='border-b'>
                  <td className='p-2'>{item.product.product_name}</td>
                  <td className='p-2'>{item.currentInventory}</td>
                  <td className='p-2'>{item.suggestedQuantity}</td>
                  <td className='p-2'>
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        item.status === 'peddding'
                          ? 'bg-yellow-100 text-yellow-800'
                          : item.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className='p-2'>{new Date(item.createdAt).toLocaleDateString()}</td>

                  <td className='p-2'>
                    <div className='flex space-x-2'>
                      <Button variant='outline' size='sm' onClick={() => handleShowInvoice(item)}>
                        <Printer className='h-4 w-4 mr-1' />
                        Hóa Đơn
                      </Button>
                      {item.status === 'đang chờ' && (
                        <Button
                          variant='default'
                          size='sm'
                          onClick={() => handleConfirmProcessed(item)}
                        >
                          Xác Nhận Đã Xử Lý
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Dialog open={showInvoice} onOpenChange={setShowInvoice}>
          <DialogContent className='max-w-3xl bg-white'>
            <DialogHeader>
              <DialogTitle>Hóa Đơn Đề Xuất Nhập Hàng</DialogTitle>
            </DialogHeader>
            {selectedItem && <Invoice item={selectedItem} />}
            <DialogFooter>
              <Button variant='outline' onClick={() => setShowInvoice(false)}>
                Đóng
              </Button>
              <Button onClick={() => window.print()}>
                <Printer className='h-4 w-4 mr-1' />
                In
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

export default ImportSuggestionHistory
