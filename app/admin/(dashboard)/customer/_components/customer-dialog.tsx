'use client'

import { useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Customer } from '@/@types'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

// Define Zod schema
const formDataSchema = z.object({
  fullName: z.string().min(1, 'Tên khách hàng không được để trống'),
  email: z.string().email('Email không hợp lệ').min(5, 'Email là bắt buộc'),
  phone: z
    .string()
    .min(10, 'Số điện thoại tối thiểu 10 chữ số')
    .regex(/^[0-9]+$/, 'Số điện thoại chỉ được chứa số'),
  contract: z.string().optional(),
  type: z.enum(['individual', 'corporate'])
})

// Infer TypeScript type from Zod schema
type FormData = z.infer<typeof formDataSchema>

export interface CustomerDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: Customer) => void
  initialData?: Customer
  mode: 'add' | 'edit'
}

const defaultFormData: Partial<Customer> = {
  fullName: '',
  email: '',
  phone: '',
  contract: '',
  type: 'individual'
}

export function CustomerDialog({
  isOpen,
  onOpenChange,
  onSubmit,
  initialData,
  mode
}: CustomerDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<FormData>({
    resolver: zodResolver(formDataSchema),
    defaultValues: defaultFormData
  })

  // Reset form when dialog opens/closes or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        Object.keys(initialData).forEach((key) => {
          setValue(key as keyof FormData, initialData[key as keyof Customer])
        })
      } else {
        reset(defaultFormData)
      }
    }
  }, [isOpen, initialData, reset, setValue])

  const onSubmitForm = (data: FormData) => {
    // Convert FormData to Customer type
    const customerData: Customer = {
      ...data
    }
    onSubmit(customerData)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px] bg-white'>
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' ? 'Thêm Khách Hàng Mới' : 'Chỉnh Sửa Khách Hàng'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmitForm)} className='space-y-4'>
          <div className='space-y-2'>
            <Label>Tên khách hàng/công ty</Label>
            <Input {...register('fullName')} aria-invalid={errors.fullName ? 'true' : 'false'} />
            {errors.fullName && <p className='text-sm text-red-500'>{errors.fullName.message}</p>}
          </div>

          <div className='space-y-2'>
            <Label>Email</Label>
            <Input
              type='email'
              {...register('email')}
              aria-invalid={errors.email ? 'true' : 'false'}
            />
            {errors.email && <p className='text-sm text-red-500'>{errors.email.message}</p>}
          </div>

          <div className='space-y-2'>
            <Label>Số điện thoại</Label>
            <Input {...register('phone')} aria-invalid={errors.phone ? 'true' : 'false'} />
            {errors.phone && <p className='text-sm text-red-500'>{errors.phone.message}</p>}
          </div>

          <div className='space-y-2'>
            <Label>Địa chỉ</Label>
            <Input {...register('contract')} aria-invalid={errors.contract ? 'true' : 'false'} />
            {errors.contract && <p className='text-sm text-red-500'>{errors.contract.message}</p>}
          </div>

          <div className='space-y-2'>
            <Label>Loại khách hàng</Label>
            <Select
              value={watch('type')}
              onValueChange={(value: 'corporate' | 'individual') => setValue('type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder='Chọn loại khách hàng' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='corporate'>Doanh nghiệp</SelectItem>
                <SelectItem value='individual'>Cá nhân</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && <p className='text-sm text-red-500'>{errors.type.message}</p>}
          </div>

          <Button type='submit' className='w-full'>
            {mode === 'add' ? 'Thêm' : 'Cập nhật'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
