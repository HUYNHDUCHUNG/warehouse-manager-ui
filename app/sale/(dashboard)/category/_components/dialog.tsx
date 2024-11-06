import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Category } from '@/@types'

interface CategoryDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Partial<Category>) => void
  initialData?: Category
}

export function CategoryDialog({ isOpen, onClose, onSubmit, initialData }: CategoryDialogProps) {
  const [formData, setFormData] = useState<Partial<Category>>(
    initialData || {
      name: ''
    }
  )

  const [errors, setErrors] = useState<Partial<Record<keyof Category, string>>>({})

  const validateForm = () => {
    const newErrors: Partial<Record<keyof Category, string>> = {}

    if (!formData.name?.trim()) {
      newErrors.name = 'Tên danh mục không được để trống'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      onSubmit(formData)
      onClose()
    }
  }

  const handleChange = (field: keyof Category) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value
    }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined
      }))
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[425px] bg-white'>
        <DialogHeader>
          <DialogTitle>{initialData ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='name' className='text-right'>
                Tên danh mục
              </Label>
              <Input
                id='name'
                value={formData.name}
                onChange={handleChange('name')}
                className='col-span-3'
              />
              {errors.name && (
                <p className='col-span-3 col-start-2 text-sm text-red-500'>{errors.name}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type='button' variant='outline' onClick={onClose}>
              Hủy
            </Button>
            <Button type='submit'>{initialData ? 'Lưu thay đổi' : 'Thêm danh mục'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
