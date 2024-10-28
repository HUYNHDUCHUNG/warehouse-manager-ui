/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import axiosInstance from '@/config/axiosConfig'

interface TopProductData {
  success: boolean
  stt: number
  product_name: string
  export_quantity: number
  order_count: number
  inventory: number | string // inventory có thể là số hoặc chuỗi "Out of stock"
  total_amount: string // tổng số tiền ở dạng chuỗi vì có ký hiệu tiền tệ
}

export default function TopProductsTable() {
  const [products, setProducts] = useState<TopProductData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        setLoading(true)
        const response = await axiosInstance.get<any, TopProductData[]>('/analytic/top-product')
        console.log(response)
        setProducts(response)
      } catch (err) {
        setError(err.message)
        console.error('Error fetching top products:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTopProducts()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className='text-xl font-bold'>Sản phẩm xuất kho nhiều nhất</div>
        </CardHeader>
        <CardContent>
          <div className='w-full text-center py-4'>Đang tải dữ liệu...</div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <div className='text-xl font-bold'>Sản phẩm xuất kho nhiều nhất</div>
        </CardHeader>
        <CardContent>
          <div className='w-full text-center py-4 text-red-500'>Có lỗi xảy ra khi tải dữ liệu</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className='text-xl font-bold'>Sản phẩm xuất kho nhiều nhất</div>
      </CardHeader>
      <CardContent>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead>
              <tr className='border-b'>
                <th className='text-left py-2'>STT</th>
                <th className='text-left py-2'>Sản phẩm</th>
                <th className='text-left py-2'>Số lượng xuất</th>
                <th className='text-left py-2'>Số đơn</th>
                <th className='text-left py-2'>Tồn kho</th>
                <th className='text-left py-2'>Tổng giá</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.stt} className='border-b'>
                  <td className='py-2'>{product.stt}</td>
                  <td className='py-2'>{product.product_name}</td>
                  <td className='py-2'>{product.export_quantity}</td>
                  <td className='py-2'>{product.order_count}</td>
                  <td className='py-2'>
                    {product.inventory === 'Out of stock' ? (
                      <span className='text-red-500'>{product.inventory}</span>
                    ) : (
                      product.inventory
                    )}
                  </td>
                  <td className='py-2'>{product.total_amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
