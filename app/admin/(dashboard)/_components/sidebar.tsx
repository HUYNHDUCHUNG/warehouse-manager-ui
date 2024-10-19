import { Button } from '@/components/ui/button'
import { Logo } from './logo'
import {
  BaggageClaim,
  ChartArea,
  LayoutDashboard,
  ListCheck,
  PackageSearch,
  User
} from 'lucide-react'
import Link from 'next/link'

export const Sidebar = () => {
  return (
    <div className='h-full bg-sky-700'>
      <div className='p-6'>
        <Logo />
      </div>
      <div>
        <Link href={'/admin'}>
          <Button className='px-6 py-6 flex items-center gap-x-2 bg-transparent w-full justify-start hover:bg-sky-600 rounded-none shadow-none'>
            <div>
              <LayoutDashboard />
            </div>
            <span>Trang chủ</span>
          </Button>
        </Link>
        <Link href={'/admin/product'}>
          <Button className='px-6 py-6 flex items-center gap-x-2 bg-transparent w-full justify-start hover:bg-sky-600 rounded-none shadow-none'>
            <div>
              <PackageSearch />
            </div>
            <span>Quản lý sản phẩm</span>
          </Button>
        </Link>
        <Link href={'/admin/supplier'}>
          <Button className='px-6 py-6 flex items-center gap-x-2 bg-transparent w-full justify-start hover:bg-sky-600 rounded-none shadow-none'>
            <div>
              <PackageSearch />
            </div>
            <span>Quản lý nhà cung cấp</span>
          </Button>
        </Link>
        <Link href={'/admin/purchase-order'}>
          <Button className='px-6 py-6 flex items-center gap-x-2 bg-transparent w-full justify-start hover:bg-sky-600 rounded-none shadow-none'>
            <div>
              <ListCheck />
            </div>
            <span>Quản lý nhập kho</span>
          </Button>
        </Link>
        <Link href={'/admin/export-order'}>
          <Button className='px-6 py-6 flex items-center gap-x-2 bg-transparent w-full justify-start hover:bg-sky-600 rounded-none shadow-none'>
            <div>
              <BaggageClaim />
            </div>
            <span>Quản lý xuất kho</span>
          </Button>
        </Link>
        <Link href={'/admin/product'}>
          <Button className='px-6 py-6 flex items-center gap-x-2 bg-transparent w-full justify-start hover:bg-sky-600 rounded-none shadow-none'>
            <div>
              <ChartArea />
            </div>
            <span>Thống kê báo cáo</span>
          </Button>
        </Link>
        <Link href={'/admin/product'}>
          <Button className='px-6 py-6 flex items-center gap-x-2 bg-transparent w-full justify-start hover:bg-sky-600 rounded-none shadow-none'>
            <div>
              <User />
            </div>
            <span>Quản lý người dùng</span>
          </Button>
        </Link>
      </div>
    </div>
  )
}
