/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import axiosInstance from '@/config/axiosConfig'

interface TopProductData {
  success: boolean
  stt: number
  product_name: string
  export_quantity: number
  order_count: number
  inventory: number | string
  total_amount: string
}

export default function TopProductsTable() {
  const [products, setProducts] = useState<TopProductData[]>([])
  const [loading, setLoading] = useState(true)
  // const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        setLoading(true)
        const response = await axiosInstance.get<any, TopProductData[]>('/analytic/top-product')
        console.log(response)
        setProducts(response)
      } catch (err) {
        // setError(err.message)
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
        <CardHeader className='font-bold'>Sản phẩm xuất kho nhiều nhất</CardHeader>
        <CardContent>Đang tải dữ liệu...</CardContent>
      </Card>
    )
  }

  // if (error) {
  //   return (
  //     <Card>
  //       <CardHeader className='font-bold'>Sản phẩm xuất kho nhiều nhất</CardHeader>
  //       <CardContent>Có lỗi xảy ra khi tải dữ liệu</CardContent>
  //     </Card>
  //   )
  // }

  return (
    <Card>
      <CardHeader className='font-bold'>Sản phẩm xuất kho nhiều nhất</CardHeader>
      <CardContent>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead>
              <tr className='border-b'>
                <th className='p-2 text-left'>STT</th>
                <th className='p-2 text-left'>Sản phẩm</th>
                <th className='p-2 text-left'>Số lượng xuất</th>
                <th className='p-2 text-left'>Số đơn</th>
                <th className='p-2 text-left'>Tồn kho</th>
                <th className='p-2 text-left'>Tổng giá</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.stt} className='border-b'>
                    <td className='p-2'>{product.stt}</td>
                    <td className='p-2'>{product.product_name}</td>
                    <td className='p-2'>{product.export_quantity}</td>
                    <td className='p-2'>{product.order_count}</td>
                    <td className='p-2'>
                      {product.inventory === 'Out of stock' ? (
                        <span className='text-red-500'>{product.inventory}</span>
                      ) : (
                        product.inventory
                      )}
                    </td>
                    <td className='p-2'>{product.total_amount}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className='text-center p-4 text-gray-500'>
                    Không có dữ liệu sản phẩm
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
