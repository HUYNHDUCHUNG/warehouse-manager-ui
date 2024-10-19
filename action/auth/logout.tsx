'use server'

import { cookies } from 'next/headers'

interface LogoutResponse {
  success: boolean
  redirectUrl: string
  error?: string
}

export async function logout(): Promise<LogoutResponse> {
  try {
    cookies().delete('token')
    cookies().delete('role')

    return {
      success: true,
      redirectUrl: '/login'
    }
  } catch (error) {
    return {
      success: false,
      redirectUrl: '/login',
      error: error instanceof Error ? error.message : 'Đăng xuất thất bại'
    }
  }
}
