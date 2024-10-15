import React from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Shirt, Coffee, Sofa, ChartPie } from 'lucide-react'
import dynamic from 'next/dynamic'
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
  return (
    <div className='p-6 bg-gray-100 min-h-screen'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Chào buổi sáng, Admin!</h1>
        <div className='flex items-center space-x-4'>
          <div className='text-sm text-gray-500'>01 Jan, 2024 to 31 Jan, 2024</div>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <div className='text-sm font-medium'>Tổng thu nhập</div>
            <div className='text-sm font-medium text-green-500'>+16.24%</div>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>$559.25k</div>
            <Button variant='link' className='p-0 h-auto'>
              Xem thu nhập ròng
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <div className='text-sm font-medium'>Đơn hàng</div>
            <div className='text-sm font-medium text-red-500'>-3.57%</div>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>36,894</div>
            <Button variant='link' className='p-0 h-auto'>
              Xem tất cả đơn hàng
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <div className='text-sm font-medium'>Khách hàng</div>
            <div className='text-sm font-medium text-green-500'>+29.08%</div>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>183.35M</div>
            <Button variant='link' className='p-0 h-auto'>
              Xem chi tiết
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <div className='text-sm font-medium'>MY BALANCE</div>
            <div className='text-sm font-medium'>+0.00%</div>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>$165.89k</div>
            <Button variant='link' className='p-0 h-auto'>
              Withdraw money
            </Button>
          </CardContent>
        </Card>
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
            <div className='text-xl font-bold'>Sales by Locations</div>
            <Button variant='outline' size='sm'>
              Export Report
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
        <Card>
          <CardHeader>
            <div className='text-xl font-bold'>Đơn hàng xuất nhiều nhất</div>
          </CardHeader>
          <CardContent>
            <table className='w-full'>
              <thead>
                <tr>
                  <th className='text-left'>Product</th>
                  <th className='text-left'>Price</th>
                  <th className='text-left'>Orders</th>
                  <th className='text-left'>Stock</th>
                  <th className='text-left'>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className='py-2 flex items-center'>
                    <Shirt className='mr-2' /> Branded T-Shirts
                  </td>
                  <td>$29.00</td>
                  <td>62</td>
                  <td>510</td>
                  <td>$1,798</td>
                </tr>
                <tr>
                  <td className='py-2 flex items-center'>
                    <ChartPie className='mr-2' /> Bentwood Chair
                  </td>
                  <td>$85.20</td>
                  <td>35</td>
                  <td className='text-red-500'>Out of stock</td>
                  <td>$2,982</td>
                </tr>
                <tr>
                  <td className='py-2 flex items-center'>
                    <Coffee className='mr-2' /> Borosil Paper Cup
                  </td>
                  <td>$14.00</td>
                  <td>80</td>
                  <td>749</td>
                  <td>$1,120</td>
                </tr>
                <tr>
                  <td className='py-2 flex items-center'>
                    <Sofa className='mr-2' /> One Seater Sofa
                  </td>
                  <td>$127.50</td>
                  <td>56</td>
                  <td className='text-red-500'>Out of stock</td>
                  <td>$7,140</td>
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <div className='text-xl font-bold'>Top Sellers</div>
            <Button variant='link'>Report</Button>
          </CardHeader>
          <CardContent>
            <table className='w-full'>
              <thead>
                <tr>
                  <th className='text-left'>Sellers</th>
                  <th className='text-left'>Product</th>
                  <th className='text-left'>Stock</th>
                  <th className='text-left'>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className='py-2'>iTest Factory</td>
                  <td>Bags and Wallets</td>
                  <td>8547</td>
                  <td>$541200</td>
                </tr>
                <tr>
                  <td className='py-2'>Digitech Galaxy</td>
                  <td>Watches</td>
                  <td>895</td>
                  <td>$75030</td>
                </tr>
                <tr>
                  <td className='py-2'>Nesta Technologies</td>
                  <td>Bike Accessories</td>
                  <td>3470</td>
                  <td>$45600</td>
                </tr>
                <tr>
                  <td className='py-2'>Zoetic Fashion</td>
                  <td>Clothes</td>
                  <td>5488</td>
                  <td>$29456</td>
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
