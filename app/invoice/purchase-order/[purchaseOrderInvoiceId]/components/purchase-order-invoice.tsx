import React from 'react'
import { PurchaseOrder, PurchaseOrderDetail } from '@/@types'
import { formatCurrency } from '@/lib/utils'

const PurchaseOrderInvoice: React.FC<{ purchaseOrder: PurchaseOrder }> = ({ purchaseOrder }) => {
  return (
    <div className='max-w-3xl mx-auto p-8 bg-white shadow-lg'>
      <div className='flex justify-between items-start mb-8'>
        <div>
          <h1 className='text-2xl font-bold text-red-600'>Hóa đơn nhập kho</h1>
          <p>{purchaseOrder.supplier.supplier_name}</p>
          <p>{purchaseOrder.supplier.contract}</p>
        </div>
        <div className='text-right'>
          <div className='w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center'>
            <span className='text-white font-bold'>LOGO</span>
          </div>
        </div>
      </div>

      <div className='mb-8'>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <h2 className='font-bold'>Hóa đơn từ</h2>
            <p>{purchaseOrder.supplier.supplier_name}</p>
            <p>{purchaseOrder.supplier.contract}</p>
          </div>
          <div className='text-right'>
            <p>
              <span className='font-bold'>Ngày nhập kho:</span>{' '}
              {new Date(purchaseOrder.dateImport).toLocaleDateString()}
            </p>
            <p>
              <span className='font-bold'>Mã hóa đơn</span> {purchaseOrder.codePurchaseOrder}
            </p>
            {/* <p>
              <span className='font-bold'>Due Date:</span>{' '}
              {new Date(purchaseOrder.dateImport).toLocaleDateString()}
            </p> */}
          </div>
        </div>
      </div>

      <table className='w-full mb-8'>
        <thead>
          <tr className='bg-red-600 text-white'>
            <th className='py-2 px-4 text-left'>Tên sản phẩm</th>
            <th className='py-2 px-4 text-left'>Số lượng</th>
            <th className='py-2 px-4 text-right'>Đơn giá</th>
            <th className='py-2 px-4 text-right'>Tổng giá</th>
          </tr>
        </thead>
        <tbody>
          {purchaseOrder.purchaseOrderDetails.map((detail: PurchaseOrderDetail, index: number) => (
            <tr key={index} className='border-b'>
              <td className='py-2 px-4'>{detail.product.product_name}</td>
              <td className='py-2 px-4'>{detail.quantity}</td>
              <td className='py-2 px-4 text-right'>{formatCurrency(parseInt(detail.unitPrice))}</td>
              <td className='py-2 px-4 text-right'>
                {formatCurrency(parseInt(detail.totalPrice))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className='flex justify-end'>
        <div className='w-1/2'>
          <div className='flex justify-between mb-2'>
            <span className='font-bold'>Tổng phụ</span>
            <span>{formatCurrency(parseInt(purchaseOrder.total_price))}</span>
          </div>
          <div className='flex justify-between mb-2'>
            <span className='font-bold'>Thuế</span>
            <span>{formatCurrency(0)}</span>
          </div>
          <div className='flex justify-between font-bold text-xl'>
            <span>Total</span>
            <span>{formatCurrency(parseInt(purchaseOrder.total_price))}</span>
          </div>
        </div>
      </div>

      <div className='mt-8'>
        <h2 className='font-bold mb-2'>Điều khoản và điều kiện</h2>
        <p>Thời hạn thanh toán trong vòng 15 ngày</p>
      </div>
    </div>
  )
}

export default PurchaseOrderInvoice