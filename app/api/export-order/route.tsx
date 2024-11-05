import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    // Lấy token từ cookies
    const token = cookies().get('token')?.value
    if (!token) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Lấy dữ liệu từ body request
    const values = await request.json()

    // Gọi API để tạo export order
    const response = await fetch('http://localhost:8017/api/export-order', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(values)
    })

    if (!response.ok) {
      const error = await response.json()
      return Response.json(
        { error: error.message || 'Đã có lỗi khi tạo đơn xuất hàng' },
        { status: response.status }
      )
    }

    const exportOrder = await response.json()
    return Response.json({ exportOrder })
  } catch (error) {
    console.error('Error creating export order:', error)
    return Response.json(
      { error: error instanceof Error ? error.message : 'Đã có lỗi khi tạo đơn xuất hàng' },
      { status: 500 }
    )
  }
}
