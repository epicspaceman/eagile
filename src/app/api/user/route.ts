import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(
    request: Request,
) {
    try {
        const req = await request.json()
        const {name, email, password} = req
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password,
            },
        })
        return Response.json({ user })
      } catch (err) {
        return new Response('Error', {
            status: 500,
            headers: { error: 'Error writing to db'}
        })
      }
}

export async function GET() {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
            }
        })
        return Response.json({ users })
    } catch (err) {
        return new Response('Error', {
            status: 500,
            headers: { error: 'Error reading from db'}
        })
    }
}