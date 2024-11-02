'use client'
import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Package, AlertTriangle, CheckCircle } from 'lucide-react'
import axiosInstance from '@/config/axiosConfig'

// Define interfaces for API responses
interface ApiResponse<T> {
  data: T
  message: string
  status: number
}

interface Customer {
  id: string
  name: string
}

interface User {
  id: string
  name: string
}

interface ExportOrder {
  id: string
  codeExportOrder: string
  dateExport: string
  customer: Customer
  user: User
  status: boolean
}

interface ExportOrderDetail {
  id: string
  exportOrder: ExportOrder
  quantity: number
  unitPrice: string
  totalPrice: string
}

interface Product {
  productId: string
  productName: string
  currentInventory: number
  totalUnprocessedExportQuantity: number
  recommendedImportQuantity: number
}

interface RecommendationsResponse {
  recommendations: Product[]
}

interface UnprocessedOrdersResponse {
  unprocessedOrders: ExportOrderDetail[]
}

const InventoryRecommendationDashboard: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  // Fetch inventory recommendations
  const {
    data: recommendations,
    isLoading,
    error
  } = useQuery<RecommendationsResponse>({
    queryKey: ['inventory-recommendations'],
    queryFn: async () => {
      const response = await axiosInstance.get<ApiResponse<RecommendationsResponse>>(
        '/inventory-recommendations'
      )
      return response // axiosInstance.interceptors đã xử lý response.data.data
    }
  })

  // Fetch unprocessed orders for a specific product
  const { data: unprocessedOrders, refetch: refetchOrders } = useQuery<UnprocessedOrdersResponse>({
    queryKey: ['unprocessed-orders', selectedProduct?.productId],
    queryFn: async () => {
      if (!selectedProduct?.productId) throw new Error('No product selected')
      const response = await axiosInstance.get<ApiResponse<UnprocessedOrdersResponse>>(
        `/unprocessed-orders/${selectedProduct.productId}`
      )
      return response
    },
    enabled: !!selectedProduct?.productId
  })

  const handleProcessOrder = async (orderId: string) => {
    try {
      await axiosInstance.put<ApiResponse<void>>(`/process-export-order/${orderId}`)
      refetchOrders()
    } catch (error) {
      console.error('Error processing order:', error)
    }
  }

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900'></div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant='destructive'>
        <AlertTriangle className='h-4 w-4' />
        <AlertTitle>Lỗi</AlertTitle>
        <AlertDescription>
          Không thể tải dữ liệu đề xuất nhập hàng. Vui lòng thử lại sau.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className='container mx-auto p-6 space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle className='text-2xl flex items-center gap-2'>
            <Package className='w-6 h-6' />
            Đề Xuất Nhập Hàng
          </CardTitle>
          <CardDescription>
            Danh sách sản phẩm cần nhập hàng dựa trên đơn hàng chưa xử lý
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sản phẩm</TableHead>
                <TableHead className='text-right'>Tồn kho hiện tại</TableHead>
                <TableHead className='text-right'>Số lượng xuất chưa xử lý</TableHead>
                <TableHead className='text-right'>Số lượng đề xuất nhập</TableHead>
                <TableHead className='text-right'>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recommendations?.recommendations.map((item: Product) => (
                <TableRow key={item.productId}>
                  <TableCell className='font-medium'>{item.productName}</TableCell>
                  <TableCell className='text-right'>{item.currentInventory}</TableCell>
                  <TableCell className='text-right'>
                    <Badge
                      variant={
                        item.totalUnprocessedExportQuantity > item.currentInventory
                          ? 'destructive'
                          : 'secondary'
                      }
                    >
                      {item.totalUnprocessedExportQuantity}
                    </Badge>
                  </TableCell>
                  <TableCell className='text-right font-bold'>
                    {item.recommendedImportQuantity}
                  </TableCell>
                  <TableCell className='text-right'>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => setSelectedProduct(item)}
                        >
                          Chi tiết
                        </Button>
                      </DialogTrigger>
                      <DialogContent className='max-w-3xl'>
                        <DialogHeader>
                          <DialogTitle>Chi tiết đơn hàng chưa xử lý</DialogTitle>
                          <DialogDescription>Sản phẩm: {item.productName}</DialogDescription>
                        </DialogHeader>
                        <div className='max-h-96 overflow-y-auto'>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Mã đơn</TableHead>
                                <TableHead>Khách hàng</TableHead>
                                <TableHead className='text-right'>Số lượng</TableHead>
                                <TableHead className='text-right'>Ngày xuất</TableHead>
                                <TableHead></TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {unprocessedOrders?.unprocessedOrders.map(
                                (order: ExportOrderDetail) => (
                                  <TableRow key={order.id}>
                                    <TableCell>{order.exportOrder.codeExportOrder}</TableCell>
                                    <TableCell>{order.exportOrder.customer.name}</TableCell>
                                    <TableCell className='text-right'>{order.quantity}</TableCell>
                                    <TableCell className='text-right'>
                                      {order.exportOrder.dateExport}
                                    </TableCell>
                                    <TableCell className='text-right'>
                                      <Button
                                        size='sm'
                                        variant='outline'
                                        onClick={() => handleProcessOrder(order.exportOrder.id)}
                                      >
                                        <CheckCircle className='w-4 h-4 mr-1' />
                                        Đánh dấu đã xử lý
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                )
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default InventoryRecommendationDashboard
