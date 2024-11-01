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

interface Supplier {
  id: number
  supplier_name: string
  contract: string
  email: string
  phone: string
  createdAt?: string
  updatedAt?: string
}

interface SupplierDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Partial<Supplier>) => void
  initialData?: Supplier
}

export function SupplierDialog({ isOpen, onClose, onSubmit, initialData }: SupplierDialogProps) {
  const [formData, setFormData] = useState<Partial<Supplier>>(
    initialData || {
      supplier_name: '',
      contract: '',
      email: '',
      phone: ''
    }
  )

  const [errors, setErrors] = useState<Partial<Record<keyof Supplier, string>>>({})

  const validateForm = () => {
    const newErrors: Partial<Record<keyof Supplier, string>> = {}

    if (!formData.supplier_name?.trim()) {
      newErrors.supplier_name = 'Supplier name is required'
    }

    if (!formData.contract?.trim()) {
      newErrors.contract = 'Contract is required'
    }

    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    if (!formData.phone?.trim()) {
      newErrors.phone = 'Phone is required'
    } else if (!/^\d{10,}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Invalid phone number format'
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

  const handleChange = (field: keyof Supplier) => (e: React.ChangeEvent<HTMLInputElement>) => {
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
          <DialogTitle>{initialData ? 'Edit Supplier' : 'Add New Supplier'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='supplier_name' className='text-right'>
                Name
              </Label>
              <Input
                id='supplier_name'
                value={formData.supplier_name}
                onChange={handleChange('supplier_name')}
                className='col-span-3'
              />
              {errors.supplier_name && (
                <p className='col-span-3 col-start-2 text-sm text-red-500'>
                  {errors.supplier_name}
                </p>
              )}
            </div>

            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='contract' className='text-right'>
                Contract
              </Label>
              <Input
                id='contract'
                value={formData.contract}
                onChange={handleChange('contract')}
                className='col-span-3'
              />
              {errors.contract && (
                <p className='col-span-3 col-start-2 text-sm text-red-500'>{errors.contract}</p>
              )}
            </div>

            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='email' className='text-right'>
                Email
              </Label>
              <Input
                id='email'
                type='email'
                value={formData.email}
                onChange={handleChange('email')}
                className='col-span-3'
              />
              {errors.email && (
                <p className='col-span-3 col-start-2 text-sm text-red-500'>{errors.email}</p>
              )}
            </div>

            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='phone' className='text-right'>
                Phone
              </Label>
              <Input
                id='phone'
                value={formData.phone}
                onChange={handleChange('phone')}
                className='col-span-3'
              />
              {errors.phone && (
                <p className='col-span-3 col-start-2 text-sm text-red-500'>{errors.phone}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type='button' variant='outline' onClick={onClose}>
              Cancel
            </Button>
            <Button type='submit'>{initialData ? 'Save changes' : 'Add supplier'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
