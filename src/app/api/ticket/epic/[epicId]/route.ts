import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
    request: Request,
    { params }: { params: Promise<{ epicId: string }>}
) {
    try {
        const epicId = Number((await params).epicId)
        const tickets = await prisma.ticket.findMany({
            where: {
                epicId: epicId
            },
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