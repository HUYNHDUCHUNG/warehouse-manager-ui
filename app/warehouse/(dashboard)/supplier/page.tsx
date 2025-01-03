/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { Supplier } from '@/@types'
import AlertDialogComponent from '@/components/alert-dialog'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import axiosInstance from '@/config/axiosConfig'
import { Pencil, Trash, Plus, CheckCircle2, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import BreadcrumbComponent from '@/components/breadcrumb'
import { useToast } from '@/hooks/use-toast'
import { SupplierDialog } from './_components/dialog'
import { Input } from '@/components/ui/input'

const SupplierPage = () => {
  const router = useRouter()
  const { toast } = useToast()
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier>()
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchSuppliers = async () => {
    try {
      const data = await axiosInstance.get<any, Supplier[]>('/supplier')
      setSuppliers(data)
    } catch (error) {
      console.error('Error fetching suppliers:', error)
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: 'Không thể tải danh sách nhà cung cấp'
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSuppliers()
  }, [])

  const handleOpenAdd = () => {
    setSelectedSupplier(undefined)
    setIsDialogOpen(true)
  }

  const handleOpenEdit = (supplier: Supplier) => {
    setSelectedSupplier(supplier)
    setIsDialogOpen(true)
  }

  const handleSubmit = async (data: Partial<Supplier>) => {
    try {
      if (selectedSupplier) {
        // Edit mode
        await axiosInstance.patch(`/supplier/${selectedSupplier.id}`, data)
        toast({
          title: 'Thành công',
          description: 'Cập nhật nhà cung cấp thành công',
          variant: 'success',
          icon: <CheckCircle2 className='h-5 w-5' />
        })
      } else {
        // Add mode
        await axiosInstance.post('/supplier', data)
        toast({
          title: 'Thành công',
          description: 'Thêm nhà cung cấp thành công',
          variant: 'success',
          icon: <CheckCircle2 className='h-5 w-5' />
        })
      }
      fetchSuppliers()
    } catch (error) {
      console.error('Error submitting supplier:', error)
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: 'Không thể lưu thông tin nhà cung cấp'
      })
    }
  }

  const onDeleteSupplier = async (id: number) => {
    try {
      await axiosInstance.delete(`/supplier/${id}`)
      setSuppliers((prevSuppliers) => prevSuppliers.filter((supplier) => supplier.id !== id))
      toast({
        title: 'Thành công',
        description: 'Xóa nhà cung cấp thành công',
        variant: 'success',
        icon: <CheckCircle2 className='h-5 w-5' />
      })
      router.refresh()
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: 'Không thể xóa nhà cung cấp'
      })
    }
  }

  const items = [{ label: 'Home', href: '/warehouse' }, { label: 'QL nhà cung cấp' }]
  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier?.supplier_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier?.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  )
  return (
    <div>
      <div className='mb-4'>
        <div className='mt-1'>
          <BreadcrumbComponent items={items} />
        </div>
      </div>
      <div className='bg-white min-h-[100vh] p-4 rounded-xl'>
        <div className='flex justify-between mb-4'>
          <h1 className='text-2xl font-bold'>Danh sách nhà cung cấp</h1>
          <Button onClick={handleOpenAdd}>
            <Plus className='w-4 h-4 mr-2' />
            Thêm nhà cung cấp
          </Button>
        </div>
        <div className='flex items-center py-4'>
          <div className='relative flex-1'>
            <Search className='absolute left-2 top-2.5 h-4 w-4 text-gray-500' />
            <Input
              placeholder='Tìm kiếm theo tên, email, sđt...'
              className='pl-8'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <>
            {[...Array(10)].map((_, index) => (
              <Skeleton key={index} className='w-full h-[30px] my-1' />
            ))}
          </>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>STT</TableHead>
                <TableHead>Mã nhà cung cấp</TableHead>
                <TableHead>Tên nhà cung cấp</TableHead>
                <TableHead>Địa chỉ</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>SĐT</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSuppliers.map((supplier, index) => (
                <TableRow key={supplier.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{supplier.code}</TableCell>
                  <TableCell>{supplier.supplier_name}</TableCell>
                  <TableCell>{supplier.contract}</TableCell>
                  <TableCell>{supplier.email}</TableCell>
                  <TableCell>{supplier.phone}</TableCell>
                  <TableCell className='flex items-center gap-2'>
                    <AlertDialogComponent
                      title='Xóa nhà cung cấp'
                      description={`Bạn có chắc chắn muốn xóa nhà cung cấp "${supplier.supplier_name}"? Hành động này không thể hoàn tác.`}
                      triggerText='Xóa'
                      actionText='Xác nhận'
                      cancelText='Hủy bỏ'
                      onConfirm={() => onDeleteSupplier(supplier.id)}
                      triggerElement={
                        <Button variant='destructive' size='icon'>
                          <Trash className='w-4 h-4' />
                        </Button>
                      }
                    />
                    <Button
                      variant='secondary'
                      size='icon'
                      onClick={() => handleOpenEdit(supplier)}
                    >
                      <Pencil className='w-4 h-4' />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <SupplierDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSubmit={handleSubmit}
          initialData={selectedSupplier}
        />
      </div>
    </div>
  )
}

export default SupplierPage
