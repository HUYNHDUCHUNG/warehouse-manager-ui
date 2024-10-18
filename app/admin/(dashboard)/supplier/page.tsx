'use client'
import { Supplier } from '@/@types'
import AlertDialogComponent from '@/components/alert-dialog'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  //   TableFooter,
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
import axiosInstance from '@/config/axiosConfig'
import { Pencil, Trash } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
// import { AxiosResponse } from 'axios'
import { useEffect, useState } from 'react'

const SupplierPage = () => {
  const router = useRouter()
  const [suppliers, setSuppliers] = useState<Supplier[]>([]) // Sử dụng mảng Product

  useEffect(() => {
    const getProducts = async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = await axiosInstance.get<any, Supplier[]>(
          '/supplier' // Điều chỉnh URL để lấy tất cả sản phẩm
        )

        setSuppliers(data) // Lưu danh sách sản phẩm vào state
        console.log(data)
      } catch (error) {
        console.error('Error fetching suppliers:', error)
      }
    }

    getProducts()
  }, []) // Không cần params, vì bạn muốn lấy tất cả sản phẩm

  const onDeleteSupplier = async (id: number) => {
    try {
      await axiosInstance.delete(`/product/${id}`)
      //   toast.success('Course created')
      setSuppliers((prevSuppliers) => prevSuppliers.filter((supplier) => supplier.id !== id))
      router.refresh()
    } catch (error) {
      //   toast.error('Something Wrong')
    }
  }

  return (
    <div>
      <div className='mb-4'>
        <div className='mt-1'>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href='/admin'>Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Quản lý nhà cung cấp</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
      <div className='bg-white min-h-[100vh] p-4 rounded-xl'>
        <div className='flex justify-between mb-4'>
          <h1 className='text-xl font-bold'>Danh sách nhà cung cấp</h1>
          <Link href={'/supplier/create'}>
            <Button>Thêm nhà cung cấp</Button>
          </Link>
        </div>

        {!suppliers.length ? (
          <>
            <Skeleton className='w-full h-[30px] my-1' />
            <Skeleton className='w-full h-[30px] my-1' />
            <Skeleton className='w-full h-[30px] my-1' />
            <Skeleton className='w-full h-[30px] my-1' />
            <Skeleton className='w-full h-[30px] my-1' />
            <Skeleton className='w-full h-[30px] my-1' />
            <Skeleton className='w-full h-[30px] my-1' />
            <Skeleton className='w-full h-[30px] my-1' />
            <Skeleton className='w-full h-[30px] my-1' />
            <Skeleton className='w-full h-[30px] my-1' />
            <Skeleton className='w-full h-[30px] my-1' />
          </>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>STT</TableHead>
                <TableHead>Tên nhà cung cấp</TableHead>
                <TableHead>Địa chỉ</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>SĐT</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suppliers.map((supplier, index) => (
                <TableRow key={supplier.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{supplier.supplier_name}</TableCell>
                  <TableCell>{supplier.contract}</TableCell>
                  <TableCell>{supplier.email}</TableCell>
                  <TableCell>{supplier.phone}</TableCell>
                  <TableCell className='flex items-center gap-2'>
                    <AlertDialogComponent
                      title='Xóa sản phẩm'
                      description={`Bạn có chắc chắn muốn xóa sản phẩm "${supplier.supplier_name}"? Hành động này không thể hoàn tác.`}
                      triggerText='Xóa'
                      actionText='Xác nhận'
                      cancelText='Hủy bỏ'
                      onConfirm={() => onDeleteSupplier(supplier.id)}
                      triggerElement={
                        <Button className=' bg-red-600 hover:bg-red-500'>
                          <Trash size={14} />
                        </Button>
                      }
                    />
                    {supplier?.id && (
                      <Link href={`/supplier/create/${supplier.id}`}>
                        <Button className=' bg-sky-600 hover:bg-sky-500'>
                          <Pencil size={14} />
                        </Button>
                      </Link>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}
export default SupplierPage
