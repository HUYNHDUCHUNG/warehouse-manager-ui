'use client'

import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import {
  BaggageClaim,
  ChevronDown,
  Layout,
  LayoutDashboard,
  PackageSearch,
  Settings,
  Tag,
  Users
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useState } from 'react'
import { Logo } from './logo'

interface SubMenuItem {
  icon: React.ReactNode
  label: string
  href: string
}

interface MenuItemProps {
  icon: React.ReactNode
  label: string
  href: string
  hasSubmenu?: boolean
  subItems?: SubMenuItem[]
  indented?: boolean
  hasChip?: boolean
  chipText?: string
  isActive?: boolean
  subItemActive?: boolean
}

const MenuItem = ({
  icon,
  label,
  href,
  hasSubmenu = false,
  subItems = [],
  indented = false,
  hasChip = false,
  chipText,
  isActive = false,
  subItemActive = false
}: MenuItemProps) => {
  const [isOpen, setIsOpen] = useState(subItemActive) // Open submenu if a subitem is active

  if (!hasSubmenu) {
    return (
      <Link href={href}>
        <Button
          variant='ghost'
          className={cn(
            'w-full justify-start hover:bg-gray-700/50 text-gray-300',
            indented ? 'pl-8' : 'pl-4',
            isActive && 'bg-gray-700/50 text-white font-medium'
          )}
        >
          <div className='flex items-center justify-between w-full'>
            <div className='flex items-center gap-2'>
              {icon}
              <span className='text-sm'>{label}</span>
            </div>
            {hasChip && chipText && (
              <span className='text-xs bg-red-500 text-white px-2 py-0.5 rounded'>{chipText}</span>
            )}
          </div>
        </Button>
      </Link>
    )
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button
          variant='ghost'
          className={cn(
            'w-full justify-start pl-4 hover:bg-gray-700/50 text-gray-300',
            (isActive || subItemActive) && 'bg-gray-700/50 text-white font-medium'
          )}
        >
          <div className='flex items-center justify-between w-full'>
            <div className='flex items-center gap-2'>
              {icon}
              <span className='text-sm'>{label}</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                isOpen ? 'transform rotate-180' : ''
              }`}
            />
          </div>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        {subItems.map((item, index) => (
          <Link key={index} href={item.href}>
            <Button
              variant='ghost'
              className={cn(
                'w-full justify-start pl-8 hover:bg-gray-700/50 text-gray-300',
                item.href === href && 'bg-gray-700/50 text-white font-medium'
              )}
            >
              <div className='flex items-center gap-2'>
                {item.icon}
                <span className='text-sm'>{item.label}</span>
              </div>
            </Button>
          </Link>
        ))}
      </CollapsibleContent>
    </Collapsible>
  )
}

export default function Sidebar() {
  const pathname = usePathname()

  const menuItems: MenuItemProps[] = [
    {
      icon: <LayoutDashboard className='w-4 h-4' />,
      label: 'Trang chủ',
      href: '/sale/',
      hasSubmenu: false
    },
    {
      icon: <Tag className='w-4 h-4' />,
      label: 'Danh mục',
      href: '/sale/category',
      hasSubmenu: false
    },
    {
      icon: <PackageSearch className='w-4 h-4' />,
      label: 'Sản phẩm',
      href: '/sale/product',
      hasSubmenu: false
    },
    {
      icon: <Users className='w-4 h-4' />,
      label: 'Quản lý khách hàng',
      href: '/sale/customer',
      hasSubmenu: false
    },
    {
      icon: <BaggageClaim className='w-4 h-4' />,
      label: 'Quản lý đơn hàng',
      href: '/sale/export-order',
      hasSubmenu: false
    },
    {
      icon: <Layout className='w-4 h-4' />,
      label: 'Layouts',
      href: '/sale/layouts',
      hasChip: true,
      chipText: 'Hot'
    }
  ]

  const setting: MenuItemProps[] = [
    {
      icon: <Settings className='w-4 h-4' />,
      label: 'Settings',
      href: '/sale/settings',
      hasSubmenu: true,
      subItems: [
        { icon: <Users className='w-4 h-4' />, label: 'Sign In', href: '/admin/settings/signin' },
        { icon: <Users className='w-4 h-4' />, label: 'Sign Up', href: '/admin/settings/signup' },
        {
          icon: <Users className='w-4 h-4' />,
          label: 'Reset Password',
          href: '/admin/settings/reset-password'
        }
      ]
    }
  ]

  // Check if a submenu item is active
  const isSubmenuItemActive = (subItems: SubMenuItem[] = []) => {
    return subItems.some((item) => pathname === item.href)
  }

  return (
    <ScrollArea className='h-screen'>
      <div className='w-56 min-h-screen bg-[#1C2434]'>
        <div className='p-6 mb-4'>
          <Logo />
        </div>

        <div className='px-4 py-2'>
          <p className='text-xs text-gray-500 font-semibold'>MENU</p>
        </div>

        <div className='space-y-1'>
          {menuItems.map((item, index) => (
            <MenuItem
              key={index}
              {...item}
              isActive={pathname === item.href}
              subItemActive={isSubmenuItemActive(item.subItems)}
            />
          ))}
        </div>

        <div className='px-4 py-2 mt-4'>
          <p className='text-xs text-gray-500 font-semibold'>PAGES</p>
        </div>

        <div className='space-y-1'>
          {setting.map((item, index) => (
            <MenuItem
              key={index}
              {...item}
              isActive={pathname === item.href}
              subItemActive={isSubmenuItemActive(item.subItems)}
            />
          ))}
        </div>
      </div>
    </ScrollArea>
  )
}
