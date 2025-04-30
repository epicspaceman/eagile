'use client'

import Link from "next/link"
import { login } from "@/app/actions/auth"
import { useActionState } from "react"

const LoginForm = () => {
    const [state, action] = useActionState(login, undefined)

    return (
        <form className='flex flex-col gap-5 p-8 rounded-lg w-1/4 shadow-[0_1px_10px_rgba(0,0,0,0.2)]' action={action}>
            <div className='flex flex-col gap-1'>
                <h1 className='text-5xl text-french-purple text-center'>Eagile</h1>
                <p className='text-s text-gray-500 text-center'>Become an agile eagle</p>
            </div>
            <div className='flex flex-col gap-5'>
                <div className='flex flex-col'>
                    <label className='text-gray-500'>Username</label>
                    <input className='bg-gray-200 p-1 rounded-lg' type="text" id="username" name="username"/>
                    {state?.errors?.username && <p>{state.errors.username}</p>}
                </div>

                <div className='flex flex-col'>
                    <label className='text-gray-500'>Password</label>
                    <input className='bg-gray-200 p-1 rounded-lg' type="password" id="password" name="password"/>
                    {state?.errors?.password && <p>{state.errors.password}</p>}
                </div>                
            </div>
            <button className='text-white bg-french-purple w-1/2 self-center rounded-lg mt-1 p-1' type="submit">Log In</button>
            <Link className="text-center text-gray-500 text-sm" href={"/signup"}>Don&apost have an account? Sign Up.</Link>
        </form>
    )
}

export default LoginForm