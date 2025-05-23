import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
    request: Request,
    { params }: { params: Promise<{ epicId: string, priorityName: string }>}
) {
    try {
        const epicId = Number((await params).epicId)
        const priorityName = (await params).priorityName
        const tickets = await prisma.ticket.findMany({
            where: {
                epicId: epicId,
                priority: priorityName
            },
            select: {
                id: true,
                title: true,
                description: true,
                status: true,
                priority: true,
                assignee: {
                    select: {
                        username: true
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