// middleware.ts
import { NextResponse, NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value
    const role = request.cookies.get('role')?.value
    // console.log("token:", token)
    // console.log("role:", role)
    // Public routes
    if (request.nextUrl.pathname.startsWith('/login') && token && role === 'AD') {
        return NextResponse.redirect(new URL('/admin', request.url))
    }

    // Check authentication
    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Route protection based on roles
    if (request.nextUrl.pathname.startsWith('/admin') && role !== 'AD') {
        return NextResponse.redirect(new URL('/login', request.url))
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
        '/staff/:path*',
        '/login',
    ],
}