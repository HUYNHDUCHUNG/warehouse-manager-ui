'use client'
import React from 'react'
import { Bell, Settings, Grid, Moon, Maximize, MessageSquare } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
// import Image from 'next/image'
import { logout } from '@/action/auth/logout'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const Navbar = () => {
  const router = useRouter()
  const handleLogout = async () => {
    try {
      const result = await logout()

      // Type guard
      if (result && 'redirectUrl' in result && typeof result.redirectUrl === 'string') {
        if (result.success) {
          // Sử dụng Next.js router
          router.push(result.redirectUrl)

          // Hoặc reload toàn trang
          window.location.href = result.redirectUrl
        }
      } else {
        console.error('Invalid response format')
      }
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error)
    }
  }
  return (
    <nav className='flex items-center justify-between px-4 py-2 bg-white border-b'>
      {/* Left side */}
      <div className='flex items-center gap-4'>
        <Button variant='ghost' size='icon' className='lg:hidden'>
          <Grid className='h-5 w-5' />
        </Button>

        <div className='relative flex items-center'>
          <input
            type='text'
            placeholder='Search...'
            className='w-64 px-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>
      </div>

      {/* Right side */}
      <div className='flex items-center gap-4'>
        {/* Country selector */}
        {/* <Button variant='ghost' size='icon'>
          <img src='/api/placeholder/24/24' alt='US Flag' className='w-6 h-6 rounded' />
        </Button> */}

        {/* App grid */}
        <Button variant='ghost' size='icon'>
          <Grid className='h-5 w-5' />
        </Button>

        {/* Messages */}
        <Button variant='ghost' size='icon' className='relative'>
          <MessageSquare className='h-5 w-5' />
          <Badge className='absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-blue-500'>
            5
          </Badge>
        </Button>

        {/* Fullscreen */}
        <Button variant='ghost' size='icon'>
          <Maximize className='h-5 w-5' />
        </Button>

        {/* Dark mode */}
        <Button variant='ghost' size='icon'>
          <Moon className='h-5 w-5' />
        </Button>

        {/* Notifications */}
        <Button variant='ghost' size='icon' className='relative'>
          <Bell className='h-5 w-5' />
          <Badge className='absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-red-500'>
            3
          </Badge>
        </Button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='flex items-center gap-2'>
              {/* <Image
                src={'https://github.com/shadcn.png'}
                alt='User avatar'
                className='w-8 h-8 rounded-full'
              /> */}
              <Avatar>
                <AvatarImage src='https://github.com/shadcn.png' />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className='hidden md:block text-left'>
                <div className='font-medium'>Anna Adame</div>
                <div className='text-sm text-gray-500'>Founder</div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-56'>
            <DropdownMenuLabel>Welcome Anna!</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Messages</DropdownMenuItem>
            <DropdownMenuItem>Taskboard</DropdownMenuItem>
            <DropdownMenuItem>Help</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className='mr-2 h-4 w-4' />
              <span>Settings</span>
              <Badge className='ml-auto' variant='secondary'>
                New
              </Badge>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Lock screen</DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}

export default Navbar
