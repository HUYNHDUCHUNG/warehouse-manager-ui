import React from 'react'
import { PurchaseOrder, PurchaseOrderDetail } from '@/@types'

const PurchaseOrderInvoice: React.FC<{ purchaseOrder: PurchaseOrder }> = ({ purchaseOrder }) => {
  return (
    <div className='max-w-3xl mx-auto p-8 bg-white shadow-lg'>
      <div className='flex justify-between items-start mb-8'>
        <div>
          <h1 className='text-2xl font-bold text-red-600'>Purchase Order</h1>
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
            <h2 className='font-bold'>Bill To</h2>
            <p>{purchaseOrder.supplier.supplier_name}</p>
            <p>{purchaseOrder.supplier.contract}</p>
          </div>
          <div className='text-right'>
            <p>
              <span className='font-bold'>Invoice Date:</span>{' '}
              {new Date(purchaseOrder.dateImport).toLocaleDateString()}
            </p>
            <p>
              <span className='font-bold'>P.O.#</span> {purchaseOrder.codePurchaseOrder}
            </p>
            <p>
              <span className='font-bold'>Due Date:</span>{' '}
              {new Date(purchaseOrder.dateImport).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <table className='w-full mb-8'>
        <thead>
          <tr className='bg-red-600 text-white'>
            <th className='py-2 px-4 text-left'>Qty</th>
            <th className='py-2 px-4 text-left'>Description</th>
            <th className='py-2 px-4 text-right'>Unit Price</th>
            <th className='py-2 px-4 text-right'>Amount</th>
          </tr>
        </thead>
        <tbody>
          {purchaseOrder.purchaseOrderDetails.map((detail: PurchaseOrderDetail, index: number) => (
            <tr key={index} className='border-b'>
              <td className='py-2 px-4'>{detail.quantity}</td>
              <td className='py-2 px-4'>{detail.productId}</td>
              <td className='py-2 px-4 text-right'>${parseFloat(detail.unitPrice).toFixed(2)}</td>
              <td className='py-2 px-4 text-right'>${parseFloat(detail.totalPrice).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className='flex justify-end'>
        <div className='w-1/2'>
          <div className='flex justify-between mb-2'>
            <span className='font-bold'>Subtotal</span>
            <span>${parseFloat(purchaseOrder.total_price).toFixed(2)}</span>
          </div>
          <div className='flex justify-between mb-2'>
            <span className='font-bold'>Tax</span>
            <span>$0.00</span>
          </div>
          <div className='flex justify-between font-bold text-xl'>
            <span>Total</span>
            <span>${parseFloat(purchaseOrder.total_price).toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className='mt-8'>
        <h2 className='font-bold mb-2'>Terms & Conditions</h2>
        <p>Payment is due within 15 days</p>
      </div>
    </div>
  )
}

export default PurchaseOrderInvoice
