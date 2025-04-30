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
        let message = "Error reading from db"
        if (typeof e === "string") {
            message = e;
        } else if (e instanceof Error) {
            message = e.message;
        }
        return new Response('Error', {
            status: 500,
            headers: { error: message}
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
    } catch (e) {
        let message = "Error reading from db"
        if (typeof e === "string") {
            message = e;
        } else if (e instanceof Error) {
            message = e.message;
        }
        return new Response('Error', {
            status: 500,
            headers: { error: message}
        })
    }
}