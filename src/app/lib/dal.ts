'use server'

import 'server-only'

import { cookies } from 'next/headers'
import { decrypt } from './session'
import { cache } from 'react'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// grab session from cookies, decrypt it, then verify that it contains a user id
export const verifySession = cache(async () => {
    const cookie = (await cookies()).get('session')?.value
    const session = await decrypt(cookie)

    if (!session?.userId) {
        return
    }

    return { isAuth: true, userId: session.userId}
})

// verify session, fetch user, return user
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