/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useEffect, useState } from 'react'
// import type {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer
// } from 'recharts'

type ChartComponentType = React.ComponentType<{ data: any[] }>

const DynamicChart: React.FC<{ data: any[] }> = ({ data }) => {
  const [ChartComponent, setChartComponent] = useState<ChartComponentType | null>(null)

  useEffect(() => {
    import('recharts').then((RechartsModule) => {
      const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } =
        RechartsModule

      const Chart: ChartComponentType = ({ data }) => (
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='name' />
            <YAxis />
            <Tooltip />
            <Bar dataKey='Orders' fill='#8884d8' />
            <Bar dataKey='Earnings' fill='#82ca9d' />
            <Bar dataKey='Refunds' fill='#ffc658' />
          </BarChart>
        </ResponsiveContainer>
      )

      setChartComponent(() => Chart)
    })
  }, [])

  if (!ChartComponent) {
    return <div className='h-full flex items-center justify-center'>Loading chart...</div>
  }

  return <ChartComponent data={data} />
}

export default DynamicChart
