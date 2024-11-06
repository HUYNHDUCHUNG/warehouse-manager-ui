// middleware.ts
import { NextResponse, NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value
    const role = request.cookies.get('role')?.value
    // Nếu đã đăng nhập và cố truy cập trang login
    if (token && request.nextUrl.pathname === '/login') {
        // Redirect về trang chủ hoặc dashboard tương ứng với role
        if (role === 'AD') {
            return NextResponse.redirect(new URL('/admin', request.url))
        }
        if (role === 'WAREHOUSE') {
            return NextResponse.redirect(new URL('/warehouse', request.url))
        }
        if (role === 'SALE') {
            return NextResponse.redirect(new URL('/sale', request.url))
        }
        // Thêm các role khác nếu cần
        return NextResponse.redirect(new URL('/', request.url))
    }

    // Nếu chưa đăng nhập và truy cập các trang được bảo vệ
    if (!token && request.nextUrl.pathname !== '/login') {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Kiểm tra quyền truy cập các route admin
    if (request.nextUrl.pathname.startsWith('/admin') && role !== 'AD') {
        return NextResponse.redirect(new URL('/', request.url))
    }

    // if (request.nextUrl.pathname.startsWith('/warehouse') &&
    //     !['AD', 'warehouse_manager'].includes(role || '')) {
    //     return NextResponse.redirect(new URL('/login', request.url))
    // }



    return NextResponse.next()
}

export const config = {
    matcher: [
        '/admin/:path*',
        '/warehouse/:path*',
        '/sale/:path*',
        '/login',
    ],
}