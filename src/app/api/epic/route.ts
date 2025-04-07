import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(
    request: Request,
) {
    try {
        const req = await request.json()
        const {title, authorId} = req
        console.log(req)
        const epic = await prisma.epic.create({
            data: {
                title,
                authorId,
            },
        })
        return Response.json({ epic })
      } catch (e) {
        return new Response('Error', {
            status: 500,
            headers: { error: 'Error writing to db'}
        })
      }
}

export async function GET() {
    try {
        const epics = await prisma.epic.findMany({
            select: {
                id: true,
                title: true,
            }
        })
        return Response.json({ epics })
    } catch (err) {
        return new Response('Error', {
            status: 500,
            headers: { error: 'Error reading from db'}
        })
    }
}