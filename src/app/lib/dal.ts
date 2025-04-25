'use server'

import 'server-only'

import { cookies } from 'next/headers'
import { decrypt } from './session'
import { redirect } from 'next/navigation'
import { cache } from 'react'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const verifySession = cache(async () => {
    const cookie = (await cookies()).get('session')?.value
    const session = await decrypt(cookie)

    if (!session?.userId) {
        redirect('/login')
    }

    return { isAuth: true, userId: session.userId}
})

export const getUser = cache(async () => {
    const session = await verifySession()
    if (!session) return null

    const id = Number(session.userId) 

    const user = await prisma.user.findUnique({
        where: {
            id
        },
        select: {
            id: true,
            username: true,
        }
    })

    return user
})

export const sessionExists = cache(async () =>{
    const cookieStore = await cookies()
    return cookieStore.has('session')
})