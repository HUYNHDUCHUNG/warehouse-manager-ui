/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { Category } from '@/@types'
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
import { Pencil, Trash, Plus, CheckCircle2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import BreadcrumbComponent from '@/components/breadcrumb'
import { useToast } from '@/hooks/use-toast'
import { CategoryDialog } from './_components/dialog'

const CategoryPage = () => {
  const router = useRouter()
  const { toast } = useToast()
  const [categories, setCategories] = useState<Category[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category>()
  const [isLoading, setIsLoading] = useState(true)

  const fetchCategories = async () => {
    try {
      const data = await axiosInstance.get<any, Category[]>('/category')
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: 'Không thể tải danh sách danh mục'
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleOpenAdd = () => {
    setSelectedCategory(undefined)
    setIsDialogOpen(true)
  }

  const handleOpenEdit = (category: Category) => {
    setSelectedCategory(category)
    setIsDialogOpen(true)
  }

  const handleSubmit = async (data: Partial<Category>) => {
    try {
      if (selectedCategory) {
        // Edit mode
        await axiosInstance.patch(`/category/${selectedCategory.id}`, data)
        toast({
          title: 'Thành công',
          description: 'Cập nhật danh mục thành công',
          variant: 'success',
          icon: <CheckCircle2 className='h-5 w-5' />
        })
      } else {
        // Add mode
        await axiosInstance.post('/category', data)
        toast({
          title: 'Thành công',
          description: 'Thêm danh mục thành công',
          variant: 'success',
          icon: <CheckCircle2 className='h-5 w-5' />
        })
      }
      fetchCategories()
    } catch (error) {
      console.error('Error submitting category:', error)
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: 'Không thể lưu thông tin danh mục'
      })
    }
  }

  const onDeleteCategory = async (id: number) => {
    try {
      await axiosInstance.delete(`/category/${id}`)
      setCategories((prevCategories) => prevCategories.filter((category) => category.id !== id))
      toast({
        title: 'Thành công',
        description: 'Xóa danh mục thành công',
        variant: 'success',
        icon: <CheckCircle2 className='h-5 w-5' />
      })
      router.refresh()
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: 'Không thể xóa danh mục'
      })
    }
  }

  const items = [{ label: 'Home', href: '/admin' }, { label: 'QL danh mục' }]

  return (
    <div>
      <div className='mb-4'>
        <div className='mt-1'>
          <BreadcrumbComponent items={items} />
        </div>
      </div>
      <div className='bg-white min-h-[100vh] p-4 rounded-xl'>
        <div className='flex justify-between mb-4'>
          <h1 className='text-2xl font-bold'>Danh sách danh mục</h1>
          <Button onClick={handleOpenAdd}>
            <Plus className='w-4 h-4 mr-2' />
            Thêm danh mục
          </Button>
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
                <TableHead>Tên danh mục</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead>Ngày cập nhật</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category, index) => (
                <TableRow key={category.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{new Date(category.createdAt).toLocaleDateString('vi-VN')}</TableCell>
                  <TableCell>{new Date(category.updatedAt).toLocaleDateString('vi-VN')}</TableCell>
                  <TableCell className='flex items-center gap-2'>
                    <AlertDialogComponent
                      title='Xóa danh mục'
                      description={`Bạn có chắc chắn muốn xóa danh mục "${category.name}"? Hành động này không thể hoàn tác.`}
                      triggerText='Xóa'
                      actionText='Xác nhận'
                      cancelText='Hủy bỏ'
                      onConfirm={() => onDeleteCategory(category.id)}
                      triggerElement={
                        <Button variant='destructive' size='icon'>
                          <Trash className='w-4 h-4' />
                        </Button>
                      }
                    />
                    <Button
                      variant='secondary'
                      size='icon'
                      onClick={() => handleOpenEdit(category)}
                    >
                      <Pencil className='w-4 h-4' />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <CategoryDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSubmit={handleSubmit}
          initialData={selectedCategory}
        />
      </div>
    </div>
  )
}

export default CategoryPage
