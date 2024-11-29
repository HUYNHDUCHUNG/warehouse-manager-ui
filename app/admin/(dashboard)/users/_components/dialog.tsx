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
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

export interface User {
  id?: string
  fullName: string
  email: string
  phone: string
  role: string
  contract: string
  status: boolean
  password?: string
  targetRevenue?: number
  targetOrders?: number
}

// Base schema without password
const baseSchema = {
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address').min(5, 'Email is required'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  role: z.enum(['AD', 'SALE', 'WAREHOUSE']).default('AD'),
  contract: z.string().optional(),
  status: z.boolean().default(true),
  // Add optional KPI fields for sales with validation
  targetRevenue: z.number().positive('Mục tiêu doanh thu phải lớn hơn 0').optional(),
  targetOrders: z.number().positive('Mục tiêu đơn hàng phải lớn hơn 0').optional()
}

// Schema for add mode - password required
const addModeSchema = z.object({
  ...baseSchema,
  password: z.string().min(8, 'Password must be at least 8 characters')
})

// Schema for edit mode - password optional
const editModeSchema = z.object({
  ...baseSchema,
  password: z.string().min(8, 'Password must be at least 8 characters').optional().or(z.literal(''))
})

type AddModeFormData = z.infer<typeof addModeSchema>
type EditModeFormData = z.infer<typeof editModeSchema>
type FormData = AddModeFormData | EditModeFormData

export interface UserDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: User) => void
  initialData?: Partial<User>
  mode: 'add' | 'edit'
}

const defaultFormData: Partial<User> = {
  fullName: '',
  email: '',
  phone: '',
  role: 'AD',
  contract: '',
  status: true,
  password: '',
  targetRevenue: undefined,
  targetOrders: undefined
}

export function UserDialog({ isOpen, onOpenChange, onSubmit, initialData, mode }: UserDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<FormData>({
    resolver: zodResolver(mode === 'add' ? addModeSchema : editModeSchema),
    defaultValues: defaultFormData
  })

  // Reset form when dialog opens/closes or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        Object.keys(initialData).forEach((key) => {
          setValue(key as keyof FormData, initialData[key as keyof User])
        })
      } else {
        reset(defaultFormData)
      }
    }
  }, [isOpen, initialData, reset, setValue])

  const onSubmitForm = (data: FormData) => {
    // Convert FormData to User type
    const userData: User = {
      ...data,
      id: initialData?.id,
      // Nếu là edit mode và password rỗng, không gửi password
      ...(mode === 'edit' && !data.password && { password: undefined }),
      // Chỉ gửi targetRevenue và targetOrders nếu role là SALE
      ...(data.role === 'SALE'
        ? {
            targetRevenue: data.targetRevenue,
            targetOrders: data.targetOrders
          }
        : {
            targetRevenue: undefined,
            targetOrders: undefined
          })
    }
    onSubmit(userData)
  }

  const currentRole = watch('role')

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[700px] bg-white'>
        <DialogHeader>
          <DialogTitle>{mode === 'add' ? 'Add New User' : 'Edit User'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmitForm)} className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            {/* Left Column */}
            <div className='space-y-4'>
              <div className='space-y-2'>
                <Label>Họ tên</Label>
                <Input
                  {...register('fullName')}
                  aria-invalid={errors.fullName ? 'true' : 'false'}
                />
                {errors.fullName && (
                  <p className='text-sm text-red-500'>{errors.fullName.message}</p>
                )}
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
                <Label>Role</Label>
                <Select
                  value={watch('role')}
                  onValueChange={(value: 'AD' | 'SALE' | 'WAREHOUSE') => setValue('role', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select role' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='AD'>Admin</SelectItem>
                    <SelectItem value='SALE'>Sales</SelectItem>
                    <SelectItem value='WAREHOUSE'>Warehouse</SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && <p className='text-sm text-red-500'>{errors.role.message}</p>}
              </div>

              <div className='space-y-2'>
                <Label>Password {mode === 'add' && '*'}</Label>
                <Input
                  type='password'
                  {...register('password')}
                  aria-invalid={errors.password ? 'true' : 'false'}
                />
                {errors.password && (
                  <p className='text-sm text-red-500'>{errors.password.message}</p>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className='space-y-4'>
              <div className='space-y-2'>
                <Label>Phone</Label>
                <Input {...register('phone')} aria-invalid={errors.phone ? 'true' : 'false'} />
                {errors.phone && <p className='text-sm text-red-500'>{errors.phone.message}</p>}
              </div>

              <div className='space-y-2'>
                <Label>Contract</Label>
                <Input
                  {...register('contract')}
                  aria-invalid={errors.contract ? 'true' : 'false'}
                />
                {errors.contract && (
                  <p className='text-sm text-red-500'>{errors.contract.message}</p>
                )}
              </div>

              {/* KPI Fields for Sales Role */}
              {currentRole === 'SALE' && (
                <>
                  <div className='space-y-2'>
                    <Label>Mục Tiêu Doanh Thu (VND)</Label>
                    <Input
                      type='number'
                      {...register('targetRevenue', {
                        setValueAs: (v) => (v === '' ? undefined : Number(v))
                      })}
                      placeholder='Nhập mục tiêu doanh thu'
                      aria-invalid={errors.targetRevenue ? 'true' : 'false'}
                    />
                    {errors.targetRevenue && (
                      <p className='text-sm text-red-500'>{errors.targetRevenue.message}</p>
                    )}
                  </div>

                  <div className='space-y-2'>
                    <Label>Mục Tiêu Số Đơn Hàng</Label>
                    <Input
                      type='number'
                      {...register('targetOrders', {
                        setValueAs: (v) => (v === '' ? undefined : Number(v))
                      })}
                      placeholder='Nhập mục tiêu số đơn hàng'
                      aria-invalid={errors.targetOrders ? 'true' : 'false'}
                    />
                    {errors.targetOrders && (
                      <p className='text-sm text-red-500'>{errors.targetOrders.message}</p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          <Button type='submit' className='w-full'>
            {mode === 'add' ? 'Add' : 'Update'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
