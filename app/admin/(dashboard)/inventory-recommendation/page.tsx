'use client'
import React, { useState, useEffect } from 'react'
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
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog'
import { Package, AlertTriangle, FileText } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'

import axiosInstance from '@/config/axiosConfig'

// Define TypeScript interfaces
interface Customer {
  id: string
  fullName: string
}

interface ExportOrder {
  id: string
  codeExportOrder: string
  dateExport: string
  customer: Customer
}

interface ExportOrderDetail {
  id: string
  exportOrder: ExportOrder
  quantity: number
}

interface Product {
  productId: string
  productName: string
  currentInventory: number
  totalUnprocessedExportQuantity: number
  recommendedImportQuantity: number
}

interface SuggestionForm {
  quantity: string
  notes: string
}

interface RecommendationsResponse {
  recommendations: Product[]
}

interface UnprocessedOrdersResponse {
  unprocessedOrders: ExportOrderDetail[]
}

const InventoryRecommendationDashboard: React.FC = () => {
  const { toast } = useToast()

  // States with proper typing
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [recommendations, setRecommendations] = useState<RecommendationsResponse | null>(null)
  const [unprocessedOrders, setUnprocessedOrders] = useState<UnprocessedOrdersResponse | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [ordersLoading, setOrdersLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)
  const [ordersError, setOrdersError] = useState<Error | null>(null)
  const [suggestionForm, setSuggestionForm] = useState<SuggestionForm>({
    quantity: '',
    notes: ''
  })

  // Fetch recommendations
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setIsLoading(true)
        const response = await axiosInstance.get<RecommendationsResponse>(
          '/recommendation/inventory'
        )
        setRecommendations(response)
        // console.log(response.data)
      } catch (err) {
        setError(err as Error)
        toast({
          variant: 'destructive',
          title: 'Lỗi',
          description: 'Không thể tải dữ liệu đề xuất nhập hàng'
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecommendations()
  }, [])

  // Fetch unprocessed orders when selected product changes
  useEffect(() => {
    const fetchUnprocessedOrders = async () => {
      if (!selectedProduct?.productId) return

      try {
        setOrdersLoading(true)
        const response = await axiosInstance.get<UnprocessedOrdersResponse>(
          `/recommendation/unprocessed-orders/${selectedProduct.productId}`
        )
        setUnprocessedOrders(response)
        console.log(response)
      } catch (err) {
        setOrdersError(err as Error)
        toast({
          variant: 'destructive',
          title: 'Lỗi',
          description: 'Không thể tải chi tiết đơn hàng'
        })
      } finally {
        setOrdersLoading(false)
      }
    }

    fetchUnprocessedOrders()
  }, [selectedProduct?.productId])

  const handleCreateSuggestion = async () => {
    try {
      if (!selectedProduct) return

      await axiosInstance.post('/recommendation/import-suggestions', {
        productId: selectedProduct.productId,
        suggestedQuantity: parseInt(suggestionForm.quantity),
        notes: suggestionForm.notes
      })

      toast({
        title: 'Thành công',
        description: 'Đã tạo đề xuất nhập hàng'
      })

      // Reset form
      setSuggestionForm({ quantity: '', notes: '' })
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: 'Không thể tạo đề xuất nhập hàng'
      })
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
            Danh sách sản phẩm cần nhập hàng (tồn kho &lt; 100 và có đơn hàng vượt tồn kho)
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
              {recommendations?.recommendations.map((item) => (
                <TableRow key={item.productId}>
                  <TableCell className='font-medium'>{item.productName}</TableCell>
                  <TableCell className='text-right'>
                    <Badge variant={item.currentInventory < 100 ? 'destructive' : 'secondary'}>
                      {item.currentInventory}
                    </Badge>
                  </TableCell>
                  <TableCell className='text-right'>
                    {item.totalUnprocessedExportQuantity}
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
                          onClick={() => {
                            setSelectedProduct(item)
                            setSuggestionForm({
                              quantity: item.recommendedImportQuantity.toString(),
                              notes: ''
                            })
                          }}
                        >
                          Chi tiết
                        </Button>
                      </DialogTrigger>
                      <DialogContent className='max-w-3xl bg-white'>
                        <DialogHeader>
                          <DialogTitle>Chi tiết đơn hàng và đề xuất nhập hàng</DialogTitle>
                          <DialogDescription>
                            Sản phẩm: {selectedProduct?.productName}
                          </DialogDescription>
                        </DialogHeader>

                        {ordersLoading ? (
                          <div className='flex items-center justify-center h-32'>
                            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900'></div>
                          </div>
                        ) : ordersError ? (
                          <Alert variant='destructive'>
                            <AlertTriangle className='h-4 w-4' />
                            <AlertTitle>Lỗi</AlertTitle>
                            <AlertDescription>
                              Không thể tải chi tiết đơn hàng. Vui lòng thử lại sau.
                            </AlertDescription>
                          </Alert>
                        ) : (
                          <>
                            {/* Form đề xuất nhập hàng */}
                            <div className='space-y-4 mb-4'>
                              <h3 className='text-lg font-medium'>Tạo đề xuất nhập hàng</h3>
                              <div className='space-y-4'>
                                <div>
                                  <label className='text-sm font-medium'>Số lượng đề xuất</label>
                                  <Input
                                    type='number'
                                    value={suggestionForm.quantity}
                                    onChange={(e) =>
                                      setSuggestionForm((prev) => ({
                                        ...prev,
                                        quantity: e.target.value
                                      }))
                                    }
                                    className='mt-1'
                                  />
                                </div>
                                <div>
                                  <label className='text-sm font-medium'>Ghi chú</label>
                                  <Textarea
                                    value={suggestionForm.notes}
                                    onChange={(e) =>
                                      setSuggestionForm((prev) => ({
                                        ...prev,
                                        notes: e.target.value
                                      }))
                                    }
                                    className='mt-1'
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Danh sách đơn hàng chưa xử lý */}
                            <div className='max-h-96 overflow-y-auto'>
                              <h3 className='text-lg font-medium mb-4'>Đơn hàng chưa xử lý</h3>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Mã đơn</TableHead>
                                    <TableHead>Khách hàng</TableHead>
                                    <TableHead className='text-right'>Số lượng</TableHead>
                                    <TableHead className='text-right'>Ngày xuất</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {unprocessedOrders?.unprocessedOrders.map((order) => (
                                    <TableRow key={order.id}>
                                      <TableCell>{order.exportOrder.codeExportOrder}</TableCell>
                                      <TableCell>{order.exportOrder.customer.fullName}</TableCell>
                                      <TableCell className='text-right'>{order.quantity}</TableCell>
                                      <TableCell className='text-right'>
                                        {order.exportOrder.dateExport}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>

                            <DialogFooter>
                              <Button onClick={handleCreateSuggestion} className='w-full sm:w-auto'>
                                <FileText className='w-4 h-4 mr-2' />
                                Tạo đề xuất nhập hàng
                              </Button>
                            </DialogFooter>
                          </>
                        )}
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
