'use server'
import { redirect } from "next/navigation";
import { SignupFormSchema, SignupFormState, LoginFormSchema, LoginFormState } from "../lib/definitions";
import { createSession, deleteSession } from '@/app/lib/session'
import { PrismaClient } from '@prisma/client'
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

export async function signup(state: SignupFormState, formData: FormData) {
    console.log("checkpoint1")
    const validatedFields = SignupFormSchema.safeParse({
        username: formData.get('username'),
        password: formData.get('password'),
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    const hashedPass = await bcrypt.hash(validatedFields.data.password, 3)

    await prisma.user.create({
        data: {
            username: validatedFields.data.username,
            password: hashedPass,
        },
    })
    const user = await prisma.user.findUnique({
        where: {
            username: validatedFields.data.username,
        },
        select: {
            id: true,
            username: true,
        }
    })


    if (user != null) {
        console.log(user.id.toString())
        await createSession(user.id.toString())
    }
    redirect('/')
}

export async function login(state: LoginFormState, formData: FormData) {
    const validatedFields = LoginFormSchema.safeParse({
        username: formData.get('username'),
        password: formData.get('password'),
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    console.log("b4 primsa")
    const user = await prisma.user.findUnique({
        where: {
            username: validatedFields.data.username,
        },
        select: {
            id: true,
            password: true,
        }
    })

    console.log("after primsa")
    if (user == null) {
        return {
            message: "Could not find user."
        }
    }

    const validPass: boolean = await bcrypt.compare(validatedFields.data.password, user.password)

    console.log(validPass)

    if (!validPass) {
        return {
            message: "Incorrect username or password.",
        }
    }

    await createSession(user.id.toString())
    redirect('/')
}

export async function logout() {
    deleteSession()
    redirect('/login')
}