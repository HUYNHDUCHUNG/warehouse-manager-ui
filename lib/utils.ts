/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from "clsx"
// import { NextRequest } from "next/server"
import { twMerge } from "tailwind-merge"
// import { cookies } from 'next/headers'
// import { jwtDecode } from 'jwt-decode'
// interface UserData {
//   id: string
//   email?: string
//   name?: string
//   role: string
// }

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}
export const getCookie = (name: string) => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift()
}



// export async function getUser(): Promise<UserData | null> {
//   const cookieStore = cookies()

//   try {
//     // Lấy token từ cookie
//     const token = cookieStore.get('token')?.value
//     const userId = cookieStore.get('id')?.value
//     const userRole = cookieStore.get('role')?.value

//     // Kiểm tra xem các cookie cần thiết có tồn tại không
//     if (!token || !userId || !userRole) {
//       return null
//     }

//     // Giải mã token để lấy thêm thông tin (nếu cần)
//     let decodedToken: any = {}
//     try {
//       decodedToken = jwtDecode(token)
//     } catch (decodeError) {
//       console.error('Lỗi giải mã token:', decodeError)
//     }

//     // Trả về thông tin người dùng
//     return {
//       id: userId,
//       role: userRole,
//       email: decodedToken.email, // Phụ thuộc vào cấu trúc token của bạn
//       name: decodedToken.name // Phụ thuộc vào cấu trúc token của bạn
//     }
//   } catch (error) {
//     console.error('Lỗi lấy thông tin người dùng:', error)
//     return null
//   }
// }
