'use client'
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { useToast } from '@/components/hooks/use-toast'
// import { ToastAction } from '@/components/ui/toast'
import { Supplier } from '@/@types'
import { useRouter } from 'next/navigation'

interface SupplierFormProps {
  initialData?: Supplier
}

const SupplierForm: React.FC<SupplierFormProps> = ({ initialData }) => {
  const router = useRouter()
  //   const { toast } = useToast()
  const [formData, setFormData] = useState<Supplier>({
    id: 0,
    supplier_name: '',
    contract: '',
    email: '',
    phone: ''
  })

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    }
  }, [initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = initialData ? `/supplier/${initialData.id}` : '/supplier'
      const method = initialData ? 'PUT' : 'POST'
      console.log(formData)
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error('Failed to save supplier')
      }

      //   toast({
      //     title: initialData ? 'Supplier Updated' : 'Supplier Added',
      //     description: 'The supplier has been successfully saved.'
      //   })

      router.push('/admin/supplier')
    } catch (error) {
      console.error('Error saving supplier:', error)
      //   toast({
      //     title: 'Error',
      //     description: 'Failed to save supplier. Please try again.',
      //     variant: 'destructive'
      //   })
    }
  }

  return (
    <Card className='w-full max-w-2xl mx-auto'>
      <CardHeader>
        <CardTitle>{initialData ? 'Edit Supplier' : 'Add New Supplier'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='supplier_name'>Supplier Name</Label>
            <Input
              id='supplier_name'
              name='supplier_name'
              value={formData.supplier_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='contract'>Contract</Label>
            <Input
              id='contract'
              name='contract'
              value={formData.contract}
              onChange={handleChange}
              required
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='email'>Email</Label>
            <Input
              id='email'
              name='email'
              type='email'
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='phone'>Phone</Label>
            <Input
              id='phone'
              name='phone'
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <Button type='submit' className='w-full'>
            {initialData ? 'Update Supplier' : 'Add Supplier'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default SupplierForm
