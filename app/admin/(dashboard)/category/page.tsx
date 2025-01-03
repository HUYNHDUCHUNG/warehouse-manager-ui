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
import { Pencil, Trash, Plus, CheckCircle2, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import BreadcrumbComponent from '@/components/breadcrumb'
import { useToast } from '@/hooks/use-toast'
import { CategoryDialog } from './_components/dialog'
import { Input } from '@/components/ui/input'

const CategoryPage = () => {
  const { toast } = useToast()
  const [categories, setCategories] = useState<Category[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

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

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setSelectedCategory(undefined)
  }

  const handleAdd = async (data: Partial<Category>) => {
    try {
      const newCategory = await axiosInstance.post<Category, any>('/category', data)
      setCategories([newCategory, ...categories])
      toast({
        title: 'Thành công',
        description: 'Thêm danh mục thành công',
        variant: 'success',
        icon: <CheckCircle2 className='h-5 w-5' />
      })
      handleCloseDialog()
    } catch (error) {
      console.error('Error adding category:', error)
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: 'Không thể thêm danh mục'
      })
    }
  }

  const handleUpdate = async (data: Partial<Category>) => {
    try {
      if (!selectedCategory?.id) return
      const updatedCategory = await axiosInstance.patch<Category, any>(
        `/category/${selectedCategory.id}`,
        data
      )
      console.log(updatedCategory)
      setCategories((prev) =>
        prev.map((category) => (category.id === selectedCategory.id ? updatedCategory : category))
      )

      toast({
        title: 'Thành công',
        description: 'Cập nhật danh mục thành công',
        variant: 'success',
        icon: <CheckCircle2 className='h-5 w-5' />
      })
      handleCloseDialog()
    } catch (error) {
      console.error('Error updating category:', error)
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: 'Không thể cập nhật danh mục'
      })
    }
  }

  const handleSubmit = (data: Partial<Category>) => {
    if (selectedCategory) {
      handleUpdate(data)
    } else {
      handleAdd(data)
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
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: 'Không thể xóa danh mục'
      })
    }
  }

  const filteredCategories = categories.filter((category) =>
    category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )
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
        <div className='flex items-center py-4'>
          <div className='relative flex-1'>
            <Search className='absolute left-2 top-2.5 h-4 w-4 text-gray-500' />
            <Input
              placeholder='Tìm kiếm theo tên danh mục...'
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
                <TableHead>Tên danh mục</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead>Ngày cập nhật</TableHead>
                <TableHead className='text-end'>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((category, index) => (
                <TableRow key={category.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{new Date(category.createdAt).toLocaleDateString('vi-VN')}</TableCell>
                  <TableCell>{new Date(category.updatedAt).toLocaleDateString('vi-VN')}</TableCell>
                  <TableCell className='flex items-center gap-2 justify-end'>
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
          onClose={handleCloseDialog}
          onSubmit={handleSubmit}
          initialData={selectedCategory}
        />
      </div>
    </div>
  )
}

export default CategoryPage
