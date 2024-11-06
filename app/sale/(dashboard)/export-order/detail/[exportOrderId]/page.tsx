/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useParams } from 'next/navigation'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Badge } from '@/components/ui/badge'
import { ExportOrder } from '@/@types'
import axiosInstance from '@/config/axiosConfig'
import { formatCurrency } from '@/lib/utils'

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const ExportOrderDetailPage = () => {
  // const router = useRouter()
  const { exportOrderId } = useParams()
  const [order, setOrder] = useState<ExportOrder>()

  useEffect(() => {
    const getOrder = async () => {
      try {
        const data = await axiosInstance.get<any, ExportOrder>(`/export-order/${exportOrderId}`)
        console.log(data)
        setOrder(data)
      } catch (error) {
        console.error('Error fetching product:', error)
      }
    }
    getOrder()
  }, [exportOrderId])
  return (
    <div className='container mx-auto p-4 space-y-6'>
      <div className='mb-4'>
        <div className='mt-1'>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href='/sale'>Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href='/sale/export-order'>Quản lý xuất kho</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Chi tiết đơn xuất kho</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin Đơn hàng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <p>
                <strong>Mã đơn hàng:</strong> {order?.codeExportOrder}
              </p>
              <p>
                <strong>Ngày xuất dự kiến:</strong> {formatDate(order?.dateExport || 'Null')}
              </p>
              <p>
                <strong>Tổng giá trị:</strong> {formatCurrency(order?.total_price)}
              </p>
              <p>
                <strong>Ghi chú:</strong> {order?.note || 'Không có'}
              </p>
            </div>
            <div>
              {/* <p>
                <strong>Trạng thái:</strong>
                <Badge
                  variant={order.?statusOrder ? 'default' : 'destructive'}

                  className={order?.statusOrder ? 'bg-green-500' : ''}
                >
                  {order?.statusOrder ? 'Hoàn thành' : 'Chưa hoàn thành'}
                </Badge>
              </p> */}
              <p>
                <strong>Số lượng đáp ứng trong kho:</strong>
                <Badge
                  variant={order?.isFullyAvailable ? 'default' : 'secondary'}
                  className={order?.isFullyAvailable ? 'bg-green-500' : 'bg-yellow-500'}
                >
                  {order?.isFullyAvailable ? 'Có' : 'Không đủ'}
                </Badge>
              </p>
              <p>
                <strong>Ngày tạo đơn:</strong> {formatDateTime(order?.createdAt)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin Khách hàng</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Tên khách hàng:</strong> {order?.customer.fullName}
          </p>
          <p>
            <strong>Số hợp đồng:</strong> {order?.customer.contract}
          </p>
          <p>
            <strong>Email:</strong> {order?.customer.email}
          </p>
          <p>
            <strong>Số điện thoại:</strong> {order?.customer.phone}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Chi tiết Sản phẩm</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>STT</TableHead>
                <TableHead>Mã Sản phẩm</TableHead>
                <TableHead>Số lượng</TableHead>
                <TableHead>Đơn giá</TableHead>
                <TableHead>Thành tiền</TableHead>
                <TableHead>Tình trạng</TableHead>
                <TableHead>SL Có sẵn</TableHead>
                <TableHead>SL Thiếu</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order?.exportOrderDetails.map((detail, index) => (
                <TableRow key={detail.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{detail.productName}</TableCell>
                  <TableCell>{detail.quantity}</TableCell>
                  <TableCell> {formatCurrency(parseInt(detail.unitPrice))}</TableCell>
                  <TableCell>{formatCurrency(parseInt(detail.totalPrice))}</TableCell>
                  <TableCell>
                    <Badge
                      variant={detail.isAvailable ? 'default' : 'destructive'}
                      className={detail.isAvailable ? 'bg-green-500' : ''}
                    >
                      {detail.isAvailable ? 'Có sẵn' : 'Không đủ'}
                    </Badge>
                  </TableCell>
                  <TableCell>{detail.availableQuantity}</TableCell>
                  <TableCell>{detail.shortageQuantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default ExportOrderDetailPage
