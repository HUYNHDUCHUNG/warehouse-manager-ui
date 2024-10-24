/* eslint-disable @typescript-eslint/no-explicit-any */
// types/income.ts

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface ItemCardProps {
  label: string
  growth_rate: string
  growth_direction: string
  value: string
}

export const ItemCard = ({ label, growth_rate, growth_direction, value }: ItemCardProps) => {
  //   if (isLoading) {
  //     return (
  //       <Card>
  //         <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
  //           <div className='text-sm font-medium'>Đang tải...</div>
  //         </CardHeader>
  //         <CardContent>
  //           <div className='h-8 w-24 bg-gray-200 animate-pulse rounded'></div>
  //         </CardContent>
  //       </Card>
  //     )
  //   }

  //   if (error) {
  //     return (
  //       <Card>
  //         <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
  //           <div className='text-sm font-medium text-red-500'>Lỗi tải dữ liệu</div>
  //         </CardHeader>
  //         <CardContent>
  //           <div className='text-sm text-gray-500'>Vui lòng thử lại sau</div>
  //         </CardContent>
  //       </Card>
  //     )
  //   }

  //   const { total_income, growth_rate } = incomeData?.data || {}

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <div className='text-sm font-medium'>{label}</div>
        <div
          className={`text-sm font-medium ${
            growth_direction == 'increase'
              ? 'text-green-500'
              : `${growth_direction == 'stable' ? 'text-black' : 'text-red-500'}`
          }`}
        >
          {growth_rate}%
        </div>
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>{value}</div>
        <Button variant='link' className='p-0 h-auto'>
          Xem chi tiết
        </Button>
      </CardContent>
    </Card>
  )
}
