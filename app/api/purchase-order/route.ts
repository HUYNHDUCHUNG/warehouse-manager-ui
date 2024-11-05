import { cookies } from "next/headers"

// export async function GET() {
//     const token = cookies().get('token')?.value
//     const data = await fetch('http://localhost:8017/api/auth/me', {
//         headers: {
//             Authorization: `Bearer ${token}`
//         }
//     })

//     const user = (await data.json()).data.user as User

//     return Response.json({ user })
// }

export async function POST(request: Request) {
    try {
        // Lấy token từ cookies
        const token = cookies().get('token')?.value
        if (!token) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Lấy dữ liệu từ body request
        const values = await request.json()

        // Gọi API để tạo purchase order
        const response = await fetch('http://localhost:8017/api/purchase-order', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(values)
        })

        if (!response.ok) {
            const error = await response.json()
            return Response.json({ error: error.message || 'Đã có lỗi khi tạo đơn nhập hàng' },
                { status: response.status })
        }

        const purchaseOrder = await response.json()
        return Response.json({ purchaseOrder })

    } catch (error) {
        console.error('Error creating purchase order:', error)
        return Response.json(
            { error: error instanceof Error ? error.message : 'Đã có lỗi khi tạo đơn nhập hàng' },
            { status: 500 }
        )
    }
}