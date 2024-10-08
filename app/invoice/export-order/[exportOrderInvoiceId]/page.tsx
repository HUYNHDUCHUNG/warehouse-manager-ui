/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useState } from 'react'
import axiosInstance from '@/config/axiosConfig'
import { ExportOrder } from '@/@types'
import { Skeleton } from '@/components/ui/skeleton'
import { useParams } from 'next/navigation'
import ExportOrderInvoice from './components/export-order-invoice'
// import { useParams, useRouter } from 'next/navigation'

const InvoicePage = () => {
  // const router = useRouter()
  const { exportOrderInvoiceId: id } = useParams()
  const [exportOrder, setExportOrder] = useState<ExportOrder | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchExportOrder = async () => {
      if (id) {
        try {
          const data = await axiosInstance.get<any, ExportOrder>(`/export-order/${id}`)
          console.log(data)
          setExportOrder(data)
        } catch (error) {
          console.error('Error fetching export order:', error)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchExportOrder()
  }, [id])

  if (loading) {
    return <Skeleton className='w-full h-screen' />
  }

  if (!exportOrder) {
    return <div>Purchase order not found</div>
  }

  return <ExportOrderInvoice exportOrder={exportOrder} />
}

export default InvoicePage
