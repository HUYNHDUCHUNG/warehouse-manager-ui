import React from 'react'
import { ExportOrder } from '@/@types'
import { formatCurrency } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { format } from 'date-fns'
const ExportOrderInvoice: React.FC<{ exportOrder: ExportOrder }> = ({ exportOrder }) => {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy')
  }

  return (
    <Card className='max-w-4xl mx-auto p-6'>
      <div className='text-center mb-8'>
        <h1 className='text-2xl font-bold mb-2'>PHIẾU XUẤT KHO</h1>
        <p className='text-gray-600'>Số phiếu: {exportOrder.codeExportOrder}</p>
        <p className='text-gray-600'>Ngày xuất: {formatDate(exportOrder.dateExport)}</p>
      </div>

      <div className='mb-6 space-y-2'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <h2 className='font-semibold mb-2'>Thông tin khách hàng:</h2>
            <div className='space-y-1'>
              <p>Tên: {exportOrder.customer.fullName}</p>
              <p>Địa chỉ: {exportOrder.customer.contract}</p>
              <p>Điện thoại: {exportOrder.customer.phone}</p>
              <p>Email: {exportOrder.customer.email}</p>
            </div>
          </div>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-12'>STT</TableHead>
            <TableHead>Tên sản phẩm</TableHead>
            <TableHead>Đơn vị tính</TableHead>
            <TableHead className='text-right'>Số lượng</TableHead>
            <TableHead className='text-right'>Đơn giá</TableHead>
            <TableHead className='text-right'>Thành tiền</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {exportOrder.exportOrderDetails.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{item.productName}</TableCell>
              <TableCell>{item.unitPrice}</TableCell>
              <TableCell className='text-right'>{item.quantity}</TableCell>
              <TableCell className='text-right'>
                {formatCurrency(parseInt(item.unitPrice))}
              </TableCell>
              <TableCell className='text-right'>
                {formatCurrency(parseInt(item.totalPrice))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className='mt-6'>
        <p className='text-right font-semibold'>
          Tổng tiền: {formatCurrency(parseInt(exportOrder.total_price))}
        </p>
      </div>

      <div className='mt-8 grid grid-cols-2 gap-4'>
        <div className='text-center'>
          <p className='font-semibold'>Người lập phiếu</p>
          <p className='text-sm text-gray-500 mt-12'>(Ký và ghi rõ họ tên)</p>
        </div>
        <div className='text-center'>
          <p className='font-semibold'>Thủ kho</p>
          <p className='text-sm text-gray-500 mt-12'>(Ký và ghi rõ họ tên)</p>
        </div>
      </div>

      {exportOrder.note && (
        <div className='mt-6'>
          <p className='font-semibold'>Ghi chú:</p>
          <p>{exportOrder.note}</p>
        </div>
      )}
    </Card>
  )
}

export default ExportOrderInvoice
