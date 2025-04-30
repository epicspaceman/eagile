import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
    request: Request,
    { params }: { params: Promise<{ entries: string}>}
) {
    try {
        const entries = Number((await params).entries)
        const users = await prisma.user.findMany({
            take: entries,
            select: {
                id: true,
                username: true
            }
        })
        return Response.json({ users })
    } catch (e) {
        if (typeof e === "string") {
            console.log(e)
        } else if (e instanceof Error) {
            console.log(e.message)
        }
        return new Response('Error', {
            status: 500,
            headers: { error: 'Error reading from db'}
        })
    }
}