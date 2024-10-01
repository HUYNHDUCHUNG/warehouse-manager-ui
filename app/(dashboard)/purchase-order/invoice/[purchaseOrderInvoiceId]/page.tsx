/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useState } from 'react'
import axiosInstance from '@/config/axiosConfig'
import { PurchaseOrder } from '@/@types'
import PurchaseOrderInvoice from './components/purchase-order-invoice'
import { Skeleton } from '@/components/ui/skeleton'
import { useParams } from 'next/navigation'
// import { useParams, useRouter } from 'next/navigation'

const InvoicePage = () => {
  // const router = useRouter()
  const { purchaseOrderInvoiceId: id } = useParams()
  const [purchaseOrder, setPurchaseOrder] = useState<PurchaseOrder | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPurchaseOrder = async () => {
      if (id) {
        try {
          const data = await axiosInstance.get<any, PurchaseOrder>(`/purchase-order/${id}`)
          setPurchaseOrder(data)
        } catch (error) {
          console.error('Error fetching purchase order:', error)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchPurchaseOrder()
  }, [id])

  if (loading) {
    return <Skeleton className='w-full h-screen' />
  }

  if (!purchaseOrder) {
    return <div>Purchase order not found</div>
  }

  return <PurchaseOrderInvoice purchaseOrder={purchaseOrder} />
}

export default InvoicePage
