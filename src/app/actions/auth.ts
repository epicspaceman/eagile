'use server'
import { redirect } from "next/navigation";
import { SignupFormSchema, SignupFormState, LoginFormSchema, LoginFormState } from "../lib/definitions";
import { createSession, deleteSession } from '@/app/lib/session'
import { PrismaClient } from '@prisma/client'
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

// Handle sign-up form submission
export async function signup(state: SignupFormState, formData: FormData) {
    // Get username and password from form
    const validatedFields = SignupFormSchema.safeParse({
        username: formData.get('username'),
        password: formData.get('password'),
    })

    // return errors if they exist
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    // hash the password with three salt rounds
    const hashedPass = await bcrypt.hash(validatedFields.data.password, 3)

    // create new user in the db
    await prisma.user.create({
        data: {
            username: validatedFields.data.username,
            password: hashedPass,
        },
    })

    // fetch user after we create them
    const user = await prisma.user.findUnique({
        where: {
            username: validatedFields.data.username,
        },
        select: {
            id: true,
            username: true,
        }
    })

    // create session for user with JWT
    if (user != null) {
        await createSession(user.id.toString())
    }

    // redirect to home page
    redirect('/')
}

// Handle log-in form submission
export async function login(state: LoginFormState, formData: FormData) {
    // get username and password from form
    const validatedFields = LoginFormSchema.safeParse({
        username: formData.get('username'),
        password: formData.get('password'),
    })

    // return errors if they exist
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    // fetch user based on username
    const user = await prisma.user.findUnique({
        where: {
            username: validatedFields.data.username,
        },
        select: {
            id: true,
            password: true,
        }
    })

    // If the user doesn't exist return this error message
    if (user == null) {
        return {
            message: "Could not find user."
        }
    }

    // check pass against stored hashed pass using bcrypt then store result in bool validPass
    const validPass: boolean = await bcrypt.compare(validatedFields.data.password, user.password)

    // if the password doesn't match, return this error message
    if (!validPass) {
        return {
            message: "Incorrect username or password.",
        }
    }

    // create session with JWT and redirect to home page
    await createSession(user.id.toString())
    redirect('/')
}

// Handle logout button click
export async function logout() {
    // delete current session with JWT and redirect away from home page
    deleteSession()
    redirect('/login')
}