'use client'
import { Product } from '@/@types'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  //   TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import axiosInstance from '@/config/axiosConfig'
// import { AxiosResponse } from 'axios'
import { useEffect, useState } from 'react'

const ProductPage = () => {
  const [products, setProducts] = useState<Product[]>([]) // Sử dụng mảng Product

  useEffect(() => {
    const getProducts = async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = await axiosInstance.get<any, Product[]>(
          '/product' // Điều chỉnh URL để lấy tất cả sản phẩm
        )

        setProducts(data) // Lưu danh sách sản phẩm vào state
        console.log(data)
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    }

    getProducts()
  }, []) // Không cần params, vì bạn muốn lấy tất cả sản phẩm
  return (
    <div className='p-8'>
      <Button>Thêm sản phẩm</Button>
      <Table>
        <TableCaption>Danh sách sản phẩm</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>STT</TableHead>
            <TableHead>Tên sản phẩm</TableHead>
            <TableHead>Danh mục sản phẩm</TableHead>
            <TableHead>Mô tả</TableHead>
            <TableHead>Giá</TableHead>
            <TableHead>Số lượng</TableHead>
            {/* <TableHead>Ngày nhập gần nhất</TableHead> */}
            {/* <TableHead>Số lượng </TableHead> */}
            <TableHead>Ngày chỉnh sửa</TableHead>
            <TableHead>Ngày tạo</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product, index) => (
            <TableRow key={product.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{product.product_name}</TableCell>
              <TableCell>{product.category.name}</TableCell>
              <TableCell>{product.description}</TableCell>
              <TableCell>{product.price}</TableCell>
              <TableCell>{product.inventory_quantity}</TableCell>
              {/* <TableCell>{product.warehouse_latest}</TableCell> */}
              {/* <TableCell>{product.quantity_warehouse_latest}</TableCell> */}
              <TableCell>{product.updatedAt}</TableCell>
              <TableCell>{product.createdAt}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        {/* <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className='text-right'>$2,500.00</TableCell>
          </TableRow>
        </TableFooter> */}
      </Table>
    </div>
  )
}
export default ProductPage
