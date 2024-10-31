'use server'

import { cookies } from 'next/headers'
import { ACCESS_TOKEN_COOKIE_NAME, ACCESS_TOKEN_EXPIRY_DAYS } from '@/constants/auth'
import { z } from 'zod'
const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ').min(1, 'Email là bắt buộc'),
  password: z.string().min(3, 'Mật khẩu phải có ít nhất 3 ký tự')
})

interface LoginResponse {
  data: {
    token: string
    role: string
    status: boolean
    id: string
  }
}

export async function loginAction(
  credentials: z.infer<typeof loginSchema>
): Promise<LoginResponse> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `Đăng nhập thất bại: ${response.status}`)
    }

    const loginData: LoginResponse = await response.json()

    // Set access token cookie
    cookies().set({
      name: ACCESS_TOKEN_COOKIE_NAME,
      value: loginData.data.token,

      path: '/',
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * ACCESS_TOKEN_EXPIRY_DAYS)
    })
    // Set role cookie
    cookies().set({
      name: 'role',
      value: loginData.data.role, // Giả sử API trả về role dạng 'AD'
      path: '/',
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * ACCESS_TOKEN_EXPIRY_DAYS)
    })
    cookies().set({
      name: 'id',
      value: loginData.data.id,
      path: '/',
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * ACCESS_TOKEN_EXPIRY_DAYS)
    })

    return loginData
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Đã xảy ra lỗi khi đăng nhập')
  }
}
