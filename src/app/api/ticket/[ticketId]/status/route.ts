import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ ticketId: string }>}
) {
    const req = await request.json()
    const { status } = req
    try {
        const ticketId = Number((await params).ticketId)
        const ticket = await prisma.ticket.update({
            where: {
                id: ticketId
            },
            data: {
                status: {
                    set: status
                }
            }
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
            headers: { error: 'Error reading from db'}
        })
    }
}