import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(
    request: Request,
) {
    try {
        const req = await request.json()
        const {title, description, epicId, authorId, status, priority} = req
        console.log(req)
        const ticket = await prisma.ticket.create({
            data: {
                title,
                description,
                status,
                priority,
                epicId,
                authorId,
                assigneeId: authorId,
            },
        })
        return Response.json({ ticket })
      } catch (e) {
        if (typeof e === "string") {
            console.log(e)
        } else if (e instanceof Error) {
            console.log(e.message)
        }
        return new Response('Error', {
            status: 500,
            headers: { error: 'Error writing to db'}
        })
      }
}

export async function GET() {
    try {
        const tickets = await prisma.ticket.findMany({
            select: {
                id: true,
                title: true,
                description: true,
                status: true,
                priority: true,
                assignee: {
                    select: {
                        name: true
                    }
                },
                assigneeId: true,
                epicId: true,
                epic: {
                    select: {
                        title: true
                    }
                }
            }
        })
        return Response.json({ tickets })
    } catch (err) {
        return new Response('Error', {
            status: 500,
            headers: { error: 'Error reading from db'}
        })
    }
}