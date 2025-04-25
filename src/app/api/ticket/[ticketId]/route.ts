import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
    request: Request,
    { params }: { params: Promise<{ ticketId: string }>}
) {
    try {
        const ticketId = Number((await params).ticketId)
        const ticket = await prisma.ticket.findUnique({
            where: {
                id: ticketId
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
            headers: { error: 'Error reading from db'}
        })
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ ticketId: string }>}
) {
    const req = await request.json()
    const { title, description, status, priority } = req
    try {
        const ticketId = Number((await params).ticketId)
        const ticket = await prisma.ticket.update({
            where: {
                id: ticketId
            },
            data: {
                title,
                description,
                status,
                priority
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

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ ticketId: string }>}
) {
    try {
        const ticketId = Number((await params).ticketId)
        const ticket = await prisma.ticket.delete({
            where: {
                id: ticketId
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
            headers: { error: 'Error reading from db'}
        })
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ ticketId: string }>}
) {
    try {
        const req = await request.json()
        const { title, description, status, priority, epicId } = req

        const ticketId = Number((await params).ticketId)
        const ticket = await prisma.ticket.update({
            where: {
                id: ticketId
            },
            data: {
                title,
                description,
                status,
                priority,
                epicId
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