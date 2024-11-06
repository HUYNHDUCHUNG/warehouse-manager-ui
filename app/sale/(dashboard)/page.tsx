/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { AnalyticCustomers, AnalyticOrder, Incom, PurchaseOrdersData } from '@/@types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import axiosInstance from '@/config/axiosConfig'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { ItemCard } from './_components/item-card'
// import DynamicChart from './_components/dynamic-chart'
const DynamicChart = dynamic(() => import('./_components/dynamic-chart'), {
  ssr: false,
  loading: () => <div className='h-[300px] flex items-center justify-center'>Loading chart...</div>
})

// const data = [
//   { name: 'T1', Orders: 90, ExportOrders: 80 },
//   { name: 'T2', Orders: 95, ExportOrders: 100 },
//   { name: 'T3', Orders: 100, ExportOrders: 110 },
//   { name: 'T4', Orders: 80, ExportOrders: 75 },
//   { name: 'T5', Orders: 85, ExportOrders: 90 },
//   { name: 'T6', Orders: 70, ExportOrders: 85 },
//   { name: 'T7', Orders: 75, ExportOrders: 90 },
//   { name: 'T8', Orders: 85, ExportOrders: 100 },
//   { name: 'T9', Orders: 90, ExportOrders: 90 },
//   { name: 'T10', Orders: 95, ExportOrders: 105 },
//   { name: 'T11', Orders: 100, ExportOrders: 110 },
//   { name: 'T12', Orders: 110, ExportOrders: 120 }
// ]

const Dashboard = () => {
  const [incom, setIncom] = useState<Incom>()
  const [order, setOrder] = useState<AnalyticOrder>()
  const [purchaeOrder, setPurchaseOrder] = useState<PurchaseOrdersData>()
  const [customer, setCustomer] = useState<AnalyticCustomers>()
  useEffect(() => {
    const getIcom = async () => {
      try {
        const dataIcom = await axiosInstance.get<any, Incom>('/analytic/incom')
        const dataOrder = await axiosInstance.get<any, AnalyticOrder>('/analytic/order')
        const dataPurchaseOrder = await axiosInstance.get<any, PurchaseOrdersData>(
          '/analytic/purchase-order'
        )
        const dataCustomer = await axiosInstance.get<any, AnalyticCustomers>('/analytic/customer')

        setIncom(dataIcom)
        setOrder(dataOrder)
        setPurchaseOrder(dataPurchaseOrder)
        setCustomer(dataCustomer)
      } catch (error) {
        console.error('Error fetching purchase orders:', error)
      }
    }
    getIcom()
  }, [])
  return (
    <div className='bg-gray-100 min-h-screen'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Chào buổi sáng, Admin!</h1>
        <div className='flex items-center space-x-4'>
          <div className='text-sm text-gray-500'>01 Jan, 2024 to 31 Jan, 2024</div>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6'>
        <ItemCard
          label={'Tổng thu nhập'}
          growth_rate={incom?.growth_rate || ''}
          growth_direction={incom?.growth_direction || 'increase'}
          value={incom?.current_month.formatted_income || '0'}
        />
        <ItemCard
          label={'Đơn hàng'}
          growth_rate={order?.growth_rate || ''}
          growth_direction={order?.growth_direction || 'increase'}
          value={order?.current_month.total_orders || '0'}
        />
        <ItemCard
          label={'Nhập kho'}
          growth_rate={purchaeOrder?.growth_rate || ''}
          growth_direction={purchaeOrder?.growth_direction || 'increase'}
          value={purchaeOrder?.current_month.total_orders || '0'}
        />
        <ItemCard
          label={'Khách hàng'}
          growth_rate={customer?.growth_rate || '0'}
          growth_direction={customer?.growth_direction || 'increase'}
          value={customer?.current_month.new_customers || '0'}
        />
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6'>
        <Card className='col-span-2'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <div className='text-xl font-bold'>Doanh thu</div>
            <div className='flex space-x-2'>
              <Button variant='outline' size='sm'>
                ALL
              </Button>
              <Button variant='outline' size='sm'>
                1M
              </Button>
              <Button variant='outline' size='sm'>
                6M
              </Button>
              <Button variant='outline' size='sm'>
                1Y
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className='h-[300px]'>
              <DynamicChart />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <TopProductsTable />
        <EmployeeTable />
      </div> */}
    </div>
  )
}

export default Dashboard
