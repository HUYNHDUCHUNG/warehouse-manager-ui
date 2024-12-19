'use server'
import { User } from '@/@types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cookies } from 'next/headers'

export default async function InfoUser() {
  const token = cookies().get('token')?.value
  const data = await fetch('http://localhost:8017/api/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  const user = (await data.json()).data.user as User
  console.log(user)
  return (
    <div className='flex gap-2'>
      <Avatar>
        <AvatarImage src='https://github.com/shadcn.png' />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className='hidden md:block text-left min-w-[90px]'>
        <div className='font-medium'>{user.fullName}</div>
        <div className='text-sm text-gray-500'>Nhân viên kho</div>
      </div>
    </div>
  )
}
