'use server'

import 'server-only'
import { SignJWT, jwtVerify } from 'jose'
import { SessionPayload } from '@/app/lib/definitions'
import { cookies } from 'next/headers'

// secret key for generating JWTs
const secretKey = process.env.SESSION_SECRET
const encodedKey = new TextEncoder().encode(secretKey)

// create new JWT using user info
export async function encrypt(payload: SessionPayload) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' }) // SHA 256
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(encodedKey)
}

// extract user info from a JWT
export async function decrypt(session: string | undefined = '') {
    try {
        const { payload } = await jwtVerify(session, encodedKey, {
            algorithms: ['HS256'],
        })
        return payload
    } catch {
        console.log('Failed to verify session')
    }
}

// create session for user on login or signup
export async function createSession(userId: string) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    const session = await encrypt({ userId, expiresAt })
    const cookieStore = await cookies()

    cookieStore.set('session', session, {
        httpOnly: true,
        secure: false, // if this is set to true, cookies can only be sent over HTTPS, so if self-hosting, keep false probably
        expires: expiresAt,
        sameSite: 'lax',
        path: '/'
    })
}

// delete session on log out
export async function deleteSession() {
    const cookiesStore = await cookies()
    cookiesStore.delete('session')
}