import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

// API functions
const getKPIData = async (userId, startMonth, startYear, endMonth, endYear) => {
  const response = await axios.get(
    `/api/kpi?userId=${userId}&startMonth=${startMonth}&startYear=${startYear}&endMonth=${endMonth}&endYear=${endYear}`
  )
  return response.data
}

const updateKPI = async (kpiData) => {
  await axios.put('/api/kpi', kpiData)
}

// KPI Dashboard component
const KPIDashboard = () => {
  const { userId } = useParams()
  const [kpiData, setKPIData] = useState([])

  useEffect(() => {
    const fetchKPIData = async () => {
      const currentDate = new Date()
      const kpiData = await getKPIData(
        userId,
        currentDate.getMonth() + 1,
        currentDate.getFullYear() - 1,
        currentDate.getMonth() + 1,
        currentDate.getFullYear()
      )
      setKPIData(kpiData)
    }
    fetchKPIData()
  }, [userId])

  const handleKPIUpdate = async (kpiItem) => {
    await updateKPI(kpiItem)
    setKPIData((prevData) => prevData.map((item) => (item.id === kpiItem.id ? kpiItem : item)))
  }

  return (
    <Card className='w-full max-w-4xl'>
      <CardHeader>
        <CardTitle>KPI Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <LineChart width={600} height={400} data={kpiData}>
          <XAxis dataKey='month' />
          <YAxis />
          <CartesianGrid strokeDasharray='3 3' />
          <Tooltip />
          <Legend />
          <Line type='monotone' dataKey='kpiPercentage' stroke='#8884d8' />
        </LineChart>
        <table className='w-full mt-4 border-collapse'>
          <thead>
            <tr>
              <th className='p-2 border'>Month</th>
              <th className='p-2 border'>Target Revenue</th>
              <th className='p-2 border'>Actual Revenue</th>
              <th className='p-2 border'>Target Orders</th>
              <th className='p-2 border'>Actual Orders</th>
              <th className='p-2 border'>KPI %</th>
              <th className='p-2 border'>Status</th>
              <th className='p-2 border'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {kpiData.map((item) => (
              <tr key={item.id}>
                <td className='p-2 border'>{`${item.month}/${item.year}`}</td>
                <td className='p-2 border'>{item.targetRevenue.toLocaleString()}</td>
                <td className='p-2 border'>{item.actualRevenue.toLocaleString()}</td>
                <td className='p-2 border'>{item.targetOrders}</td>
                <td className='p-2 border'>{item.actualOrders}</td>
                <td className='p-2 border'>{item.kpiPercentage.toFixed(2)}%</td>
                <td className='p-2 border'>{item.status}</td>
                <td className='p-2 border'>
                  <button
                    className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded'
                    onClick={() => handleKPIUpdate(item)}
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}

export default KPIDashboard
