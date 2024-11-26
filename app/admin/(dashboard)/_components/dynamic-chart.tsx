/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useEffect, useState } from 'react'
import axiosInstance from '@/config/axiosConfig'

// Define types
interface OrderData {
  name: string
  Orders: number
  ExportOrder: number
}

type ChartComponentType = React.ComponentType<{ data: OrderData[] }>

interface ChartProps {
  success: boolean
  data: OrderData[]
  message: string
}

const DynamicChart: React.FC = () => {
  const [ChartComponent, setChartComponent] = useState<ChartComponentType | null>(null)
  const [chartData, setChartData] = useState<OrderData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get<any, ChartProps>('/analytic/order-statistics')
        console.log(response)
        if (response.success) {
          setChartData(response.data)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Load Recharts components
  useEffect(() => {
    import('recharts').then((RechartsModule) => {
      const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } =
        RechartsModule

      const Chart: ChartComponentType = ({ data }) => (
        <ResponsiveContainer width='100%' height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='name' tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{ fontSize: 12 }}
              formatter={(value: number) => [`${value}`, '']}
            />
            <Bar dataKey='Orders' fill='#8884d8' name='Orders' />
            <Bar dataKey='ExportOrder' fill='#82ca9d' name='ExportOrder' />
          </BarChart>
        </ResponsiveContainer>
      )

      setChartComponent(() => Chart)
    })
  }, [])

  if (loading) {
    return (
      <div className='h-[400px] flex items-center justify-center'>
        <div className='text-gray-600'>Đang tải dữ liệu...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='h-[400px] flex items-center justify-center'>
        <div className='text-red-500'>Lỗi: {error}</div>
      </div>
    )
  }

  if (!ChartComponent) {
    return (
      <div className='h-[400px] flex items-center justify-center'>
        <div className='text-gray-600'>Đang tải biểu đồ...</div>
      </div>
    )
  }

  return <ChartComponent data={chartData} />
}

export default DynamicChart
