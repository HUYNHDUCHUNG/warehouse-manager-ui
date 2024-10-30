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
  firstName: string
  lastName: string
  email: string
  phone: string
  role: string
  contract: string
  status: boolean
}

// Define Zod schema
const formDataSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address').min(5, 'Email is required'),
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .regex(/^[0-9]+$/, 'Phone number must contain only digits'),
  role: z.enum(['AD', 'SALE', 'WAREHOUSE']).default('AD'),
  contract: z.string().optional(),
  status: z.boolean().default(true)
})

type FormData = z.infer<typeof formDataSchema>

export interface UserDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: User) => void
  initialData?: Partial<User>
  mode: 'add' | 'edit'
}

const defaultFormData: Partial<User> = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  role: 'AD',
  contract: '',
  status: true
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
    resolver: zodResolver(formDataSchema),
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
      id: initialData?.id
    }
    onSubmit(userData)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px] bg-white'>
        <DialogHeader>
          <DialogTitle>{mode === 'add' ? 'Add New User' : 'Edit User'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmitForm)} className='space-y-4'>
          <div className='space-y-2'>
            <Label>First Name</Label>
            <Input {...register('firstName')} aria-invalid={errors.firstName ? 'true' : 'false'} />
            {errors.firstName && <p className='text-sm text-red-500'>{errors.firstName.message}</p>}
          </div>

          <div className='space-y-2'>
            <Label>Last Name</Label>
            <Input {...register('lastName')} aria-invalid={errors.lastName ? 'true' : 'false'} />
            {errors.lastName && <p className='text-sm text-red-500'>{errors.lastName.message}</p>}
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
            <Label>Phone</Label>
            <Input {...register('phone')} aria-invalid={errors.phone ? 'true' : 'false'} />
            {errors.phone && <p className='text-sm text-red-500'>{errors.phone.message}</p>}
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
            <Label>Contract</Label>
            <Input {...register('contract')} aria-invalid={errors.contract ? 'true' : 'false'} />
            {errors.contract && <p className='text-sm text-red-500'>{errors.contract.message}</p>}
          </div>

          <Button type='submit' className='w-full'>
            {mode === 'add' ? 'Add' : 'Update'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
