'use client'

import { useActionState } from 'react'
import { signup } from '@/app/actions/auth'

const SignupForm = () => {
    const [state, action] = useActionState(signup, undefined)

    return (
        <form action={action}>
            <h1>Become a scavenger.</h1>
                <div>
                    <label>Username</label>
                    <input type="text" id="username" name="username"/>
                    {state?.errors?.username && <p>{state.errors.username}</p>}

                    <label>Password</label>
                    <input type="password" id="password" name="password"/>
                    {state?.errors?.password && (
                        <div>
                            <p>Password must:</p>
                            <ul>
                                {state.errors.password.map((error) => (
                                    <li key={error}>- {error}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            <button type="submit">Sign Up</button>
        </form>
    )
}

export default SignupForm