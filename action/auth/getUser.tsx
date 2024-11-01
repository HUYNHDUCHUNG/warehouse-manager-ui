'use server'

import { cookies } from 'next/headers'
import { ACCESS_TOKEN_COOKIE_NAME } from '@/constants/auth'
import axiosInstance from '@/config/axiosConfig'

interface UserDetail {
  id: string
  role: string
  email?: string
  name?: string
  // Thêm các trường thông tin khác của user
  isAuthenticated: boolean
}

export async function getUserDetail(): Promise<UserDetail> {
  try {
    const cookieStore = cookies()
    const id = cookieStore.get('id')?.value
    const token = cookieStore.get(ACCESS_TOKEN_COOKIE_NAME)?.value

    if (!token || !id) {
      return {
        id: '',
        role: '',
        isAuthenticated: false
      }
    }

    // Gọi API để lấy thông tin chi tiết của user
    const response = await axiosInstance(`/user/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (!response) {
      throw new Error('Failed to fetch user details')
    }
    console.log(response)
    const userData = await response.json()

    return {
      ...userData,
      isAuthenticated: true
    }
  } catch (error) {
    console.error('Error fetching user details:', error)
    return {
      id: '',
      role: '',
      isAuthenticated: false
    }
  }
}
