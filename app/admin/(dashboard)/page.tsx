/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import dynamic from 'next/dynamic'
import { AnalyticCustomers, AnalyticOrder, Incom, PurchaseOrdersData } from '@/@types'
import axiosInstance from '@/config/axiosConfig'
import { ItemCard } from './_components/item-card'
import TopProductsTable from './_components/top-products'
// import DynamicChart from './_components/dynamic-chart'
const DynamicChart = dynamic(() => import('./_components/dynamic-chart'), {
  ssr: false,
  loading: () => <div className='h-[300px] flex items-center justify-center'>Loading chart...</div>
})

const data = [
  { name: 'Jan', Orders: 90, Earnings: 80, Refunds: 10 },
  { name: 'Feb', Orders: 95, Earnings: 100, Refunds: 5 },
  { name: 'Mar', Orders: 100, Earnings: 110, Refunds: 8 },
  { name: 'Apr', Orders: 80, Earnings: 75, Refunds: 25 },
  { name: 'May', Orders: 85, Earnings: 90, Refunds: 20 },
  { name: 'Jun', Orders: 70, Earnings: 85, Refunds: 15 },
  { name: 'Jul', Orders: 75, Earnings: 90, Refunds: 5 },
  { name: 'Aug', Orders: 85, Earnings: 100, Refunds: 10 },
  { name: 'Sep', Orders: 90, Earnings: 90, Refunds: 8 },
  { name: 'Oct', Orders: 95, Earnings: 105, Refunds: 22 },
  { name: 'Nov', Orders: 100, Earnings: 110, Refunds: 25 },
  { name: 'Dec', Orders: 110, Earnings: 120, Refunds: 30 }
]

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
    <div className='p-6 bg-gray-100 min-h-screen'>
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
              <DynamicChart data={data} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <div className='text-xl font-bold'>Bán hàng theo tỉnh thành</div>
            <Button variant='outline' size='sm'>
              Báo cáo
            </Button>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='flex justify-between items-center'>
                <span>Canada</span>
                <div className='w-2/3 bg-gray-200 rounded-full h-2.5'>
                  <div className='bg-blue-600 h-2.5 rounded-full' style={{ width: '75%' }}></div>
                </div>
                <span>75%</span>
              </div>
              <div className='flex justify-between items-center'>
                <span>Greenland</span>
                <div className='w-2/3 bg-gray-200 rounded-full h-2.5'>
                  <div className='bg-blue-600 h-2.5 rounded-full' style={{ width: '47%' }}></div>
                </div>
                <span>47%</span>
              </div>
              <div className='flex justify-between items-center'>
                <span>Russia</span>
                <div className='w-2/3 bg-gray-200 rounded-full h-2.5'>
                  <div className='bg-blue-600 h-2.5 rounded-full' style={{ width: '82%' }}></div>
                </div>
                <span>82%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* <Card>
          <CardHeader>
            <div className='text-xl font-bold'>Sản phẩm xuất kho nhiều nhất</div>
          </CardHeader>
          <CardContent>
            <table className='w-full'>
              <thead>
                <tr>
                  <th className='text-left'>STT</th>
                  <th className='text-left'>Sản phẩm</th>
                  <th className='text-left'>Số lượng xuất</th>
                  <th className='text-left'>Số đơn</th>
                  <th className='text-left'>Tồn kho</th>
                  <th className='text-left'>Tổng giá</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className='py-2 flex items-center'>Branded T-Shirts</td>
                  <td>$29.00</td>
                  <td>62</td>
                  <td>510</td>
                  <td>$1,798</td>
                </tr>
                <tr>
                  <td className='py-2 flex items-center'>Bentwood Chair</td>
                  <td>$85.20</td>
                  <td>35</td>
                  <td className='text-red-500'>Out of stock</td>
                  <td>$2,982</td>
                </tr>
                <tr>
                  <td className='py-2 flex items-center'>Borosil Paper Cup</td>
                  <td>$14.00</td>
                  <td>80</td>
                  <td>749</td>
                  <td>$1,120</td>
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card> */}
        <TopProductsTable />

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <div className='text-xl font-bold'>Nhân viên hàng đầu</div>
            <Button variant='link'>Báo cáo</Button>
          </CardHeader>
          <CardContent>
            <table className='w-full'>
              <thead>
                <tr>
                  <th className='text-left'>STT</th>
                  <th className='text-left'>Nhân viên</th>
                  <th className='text-left'>SL đơn</th>
                  <th className='text-left'>Tổng thu nhập</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className='py-2'>1</td>
                  <td>Nguyễn văn a</td>
                  <td>857</td>
                  <td>100.000.000đ</td>
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard
