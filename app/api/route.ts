import { User } from "@/@types"
import { cookies } from "next/headers"

export async function GET() {
    const token = cookies().get('token')?.value
    const data = await fetch('http://localhost:8017/api/auth/me', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    const user = (await data.json()).data.user as User

    return Response.json({ user })
}