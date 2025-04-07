import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ epicId: string }>}
) {
    try {
        const req = await request.json()
        const { title } = req

        const epicId = Number((await params).epicId)
        const epic = await prisma.epic.update({
            where: {
                id: epicId
            },
            data: {
                title
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