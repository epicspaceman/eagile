import { Prisma } from '@prisma/client'
import { z } from 'zod'

// Sign up form rules
export const SignupFormSchema = z.object({
    username: z
        .string()
        .min(2, { message: 'Username must be 2 characters long.' })
        .trim(),
    password: z
        .string()
        .min(8, { message: 'Be at least 8 characters long' })
        .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
        .regex(/[0-9]/, { message: 'Contain at least one number.' })
        .regex(/[^a-zA-Z0-9]/, {
        message: 'Contain at least one special character.',
        })
        .trim(),
})

// Log in form rules
export const LoginFormSchema = z.object({
    username: z
        .string()
        .min(2, { message: 'Username must be 2 characters long.' })
        .trim(),
    password: z
        .string()
        .min(8, { message: 'Passowrd must be at least 8 characters long' })
        .trim(),
})

export type SignupFormState =
    | {
        errors?: {
            username?: string[],
            password?: string[]
        }
        message?: string
     }
    | undefined

export type LoginFormState =
| {
    errors?: {
        username?: string[],
        password?: string[]
    }
    message?: string
    }
| undefined

export type SessionPayload =
     | {
        userId: string
        expiresAt: Date
     }
    | undefined

// Basically just a User object but without the password; a user object that can be exposed to any end user0
export type PublicUser =
     {
        id: number
        username: string
     }

// Epic object with a ticket array
export type TicketedEpic = Prisma.EpicGetPayload<{ include: { tickets: true } }>

export type TicketFilter = 
    {
        user?: PublicUser
        priority?: string
    }