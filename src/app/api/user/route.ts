import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(
    request: Request,
) {
    try {
        const req = await request.json()
        const {username, password} = req
        const user = await prisma.user.create({
            data: {
                username,
                password,
            },
        })
        return Response.json({ user })
      } catch (err) {
        if (typeof err === 'string') {
            console.log(err)
        } else if (err instanceof Error) {
            console.log(err.message)
        }
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
                username: true,
            }
        })
        return Response.json({ users })
    } catch (err) {
        if (typeof err === 'string') {
            console.log(err)
        } else if (err instanceof Error) {
            console.log(err.message)
        }
        return new Response('Error', {
            status: 500,
            headers: { error: 'Error reading from db'}
        })
    }
}