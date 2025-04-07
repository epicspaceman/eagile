import { PrismaClient } from '@prisma/client'
import { preloadStyle } from 'next/dist/server/app-render/entry-base'

const prisma = new PrismaClient()

export async function GET(
    request: Request,
    { params }: { params: Promise<{ epicId: string }>}
) {
    try {
        const epicId = Number((await params).epicId)
        const epic = await prisma.epic.findUnique({
            where: {
                id: epicId
            },
            select: {
                id: true,
                title: true,
                tickets: true,
                author: true,
                authorId: true,
            }
        })
        return Response.json({ epic })
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
    { params }: { params: Promise<{ epicId: string }>}
) {
    try {
        const epicId = Number((await params).epicId)
        const epic = await prisma.epic.delete({
            where: {
                id: epicId
            },
        })
        return Response.json({ epic })
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