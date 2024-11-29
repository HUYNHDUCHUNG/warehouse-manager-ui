import React, { useState, useEffect } from 'react'
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface User {
  id: number
  fullName: string
}

interface SalesKPIData {
  month: number
  year: number
  targetRevenue: string
  actualRevenue: string
  targetOrders: number
  actualOrders: number
  kpiPercentage: string
  status: 'pending' | 'achieved' | 'failed'
  user: User
}

// Function to format numbers with abbreviations
const formatNumber = (value: number) => {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1)}B`
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`
  }
  return value.toString()
}

const SalesKPIChart: React.FC = () => {
  const [kpiData, setKPIData] = useState<SalesKPIData[]>([])

  useEffect(() => {
    const fetchSalesKPI = async () => {
      try {
        const response = await fetch('/api/kpi-all-month')
        const result = await response.json()

        const allMonths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        const fullData = allMonths.map((month) => {
          const dataForMonth = result.find((item: SalesKPIData) => item.month === month)
          return (
            dataForMonth || {
              month,
              year: 0,
              targetRevenue: '0',
              actualRevenue: '0',
              targetOrders: 0,
              actualOrders: 0,
              kpiPercentage: '0',
              status: 'pending',
              user: { id: 0, fullName: '' }
            }
          )
        })
        setKPIData(fullData)
      } catch (error) {
        console.error('Error fetching KPI data:', error)
      }
    }
    fetchSalesKPI()
  }, [])

  const chartData = kpiData.map((item) => ({
    month: `Tháng ${item.month}`,
    targetRevenue: parseFloat(item.targetRevenue),
    actualRevenue: parseFloat(item.actualRevenue),
    targetOrders: item.targetOrders,
    actualOrders: item.actualOrders,
    kpiPercentage: parseFloat(item.kpiPercentage)
  }))

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>Báo cáo Doanh số KPI</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={350}>
          <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray='3 3' stroke='#f5f5f5' />
            <XAxis dataKey='month' />

            <YAxis
              yAxisId='revenue'
              label={{
                value: 'Doanh số',
                angle: -90,
                position: 'insideLeft',
                offset: -10
              }}
              tickFormatter={formatNumber}
            />

            <YAxis
              yAxisId='orders'
              orientation='right'
              label={{
                value: 'Số đơn hàng',
                angle: 90,
                position: 'insideRight',
                offset: -10
              }}
            />

            <Tooltip formatter={(value, name) => [formatNumber(value as number), name]} />

            <Legend />

            <Bar
              yAxisId='revenue'
              dataKey='targetRevenue'
              barSize={20}
              fill='#8884d8'
              name='Doanh số mục tiêu'
            />

            <Bar
              yAxisId='revenue'
              dataKey='actualRevenue'
              barSize={20}
              fill='#82ca9d'
              name='Doanh số thực tế'
            />

            <Line
              yAxisId='orders'
              type='monotone'
              dataKey='targetOrders'
              stroke='#ffc658'
              strokeWidth={2}
              name='Số đơn mục tiêu'
            />

            <Line
              yAxisId='orders'
              type='monotone'
              dataKey='actualOrders'
              stroke='#ff7300'
              strokeWidth={2}
              name='Số đơn thực tế'
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export default SalesKPIChart
