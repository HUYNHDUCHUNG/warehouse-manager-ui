'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  ChevronDown,
  LayoutDashboard,
  PieChart,
  Users,
  Layout,
  PackageSearch,
  ListCheck,
  BaggageClaim,
  Settings,
  Minus
} from 'lucide-react'
import Link from 'next/link'
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
}

const MenuItem = ({
  icon,
  label,
  href,
  hasSubmenu = false,
  subItems = [],
  indented = false,
  hasChip = false,
  chipText
}: MenuItemProps) => {
  const [isOpen, setIsOpen] = useState(false)

  if (!hasSubmenu) {
    return (
      <Link href={href}>
        <Button
          variant='ghost'
          className={`w-full justify-start ${
            indented ? 'pl-8' : 'pl-4'
          } hover:bg-gray-700/50 text-gray-300`}
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
          className='w-full justify-start pl-4 hover:bg-gray-700/50 text-gray-300'
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
              className='w-full justify-start pl-8 hover:bg-gray-700/50 text-gray-300'
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
  const menuItems: MenuItemProps[] = [
    {
      icon: <LayoutDashboard className='w-4 h-4' />,
      label: 'Trang chủ',
      href: '/admin/',
      hasSubmenu: false
    },
    {
      icon: <PackageSearch className='w-4 h-4' />,
      label: 'Sản phẩm',
      href: '/admin/product',
      hasSubmenu: false,
      subItems: [
        { icon: <Users className='w-4 h-4' />, label: 'Calendar', href: '/admin/' },
        { icon: <Users className='w-4 h-4' />, label: 'Chat', href: '/admin/' },
        { icon: <Users className='w-4 h-4' />, label: 'Email', href: '/admin/' }
      ]
    },
    {
      icon: <PackageSearch className='w-4 h-4' />,
      label: 'Nhà cung cấp',
      href: '/admin/supplier',
      hasSubmenu: false
    },
    {
      icon: <ListCheck className='w-4 h-4' />,
      label: 'Quản lý nhập kho',
      href: '/admin/purchase-order',
      hasSubmenu: false
    },
    {
      icon: <BaggageClaim className='w-4 h-4' />,
      label: 'Quản lý xuất kho',
      href: '/admin/export-order',
      hasSubmenu: false
    },
    {
      icon: <PieChart className='w-4 h-4' />,
      label: 'Báo cáo',
      href: '/admin/reports/inventory',
      hasSubmenu: true,
      subItems: [
        {
          icon: <Minus className='w-4 h-4' />,
          label: 'Báo cáo tồn kho',
          href: '/admin/reports/inventory'
        },
        {
          icon: <Minus className='w-4 h-4' />,
          label: 'Báo cáo doanh thu',
          href: '/admin/reports/revenue'
        }
      ]
    },
    {
      icon: <Users className='w-4 h-4' />,
      label: 'Quản lý người dùng',
      href: '/admin/users',
      hasSubmenu: false
    },
    {
      icon: <Layout className='w-4 h-4' />,
      label: 'Layouts',
      href: '/admin/',

      hasChip: true,
      chipText: 'Hot'
    }
  ]

  const setting: MenuItemProps[] = [
    {
      icon: <Settings className='w-4 h-4' />,
      label: 'Settings',
      href: '/admin/',
      hasSubmenu: true,
      subItems: [
        { icon: <Users className='w-4 h-4' />, label: 'Sign In', href: '/admin/' },
        { icon: <Users className='w-4 h-4' />, label: 'Sign Up', href: '/admin/' },
        { icon: <Users className='w-4 h-4' />, label: 'Reset Password', href: '/admin/' }
      ]
    }
  ]

  return (
    <ScrollArea className='h-screen'>
      <div className='w-56 min-h-screen bg-[#1C2434]'>
        {/* Logo */}
        <div className='p-6 mb-4'>
          {/* <h1 className='text-2xl font-bold text-white'>VELZON</h1> */}
          <Logo />
        </div>

        {/* Menu Label */}
        <div className='px-4 py-2'>
          <p className='text-xs text-gray-500 font-semibold'>MENU</p>
        </div>

        {/* Menu Items */}
        <div className='space-y-1'>
          {menuItems.map((item, index) => (
            <MenuItem key={index} {...item} />
          ))}
        </div>

        {/* Pages Label */}
        <div className='px-4 py-2 mt-4'>
          <p className='text-xs text-gray-500 font-semibold'>PAGES</p>
        </div>

        {/* Pages Items */}
        <div className='space-y-1'>
          {setting.map((item, index) => (
            <MenuItem key={index} {...item} />
          ))}
        </div>
      </div>
    </ScrollArea>
  )
}
