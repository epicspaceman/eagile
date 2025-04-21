'use client'

import Link from "next/link"
import { login } from "@/app/actions/auth"
import { useActionState } from "react"

const LoginForm = () => {
    const [state, action] = useActionState(login, undefined)

    return (
        <form  action={action}>
            <h1>Ready to scavenge?</h1>
            <div>
                <label >Username</label>
                <input type="text" id="username" name="username"/>
                {state?.errors?.username && <p>{state.errors.username}</p>}

                <label>Password</label>
                <input type="password" id="password" name="password"/>
                {state?.errors?.password && <p>{state.errors.password}</p>}
            </div>
            <button type="submit">Log In</button>
            <Link href={"/signup"}>Don't have an account? Sign Up.</Link>
        </form>
    )
}

export default LoginForm