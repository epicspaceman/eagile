'use client'

import { logout } from "@/app/actions/auth"
import { getUser } from "@/app/lib/dal"
import { PublicUser } from "@/app/lib/definitions"
import Link from "next/link"
import { useEffect, useState } from "react"
import UserIcon from "../userIcon"

const Navbar = () => {
    const [user, setUser] = useState<PublicUser>()

    useEffect(() => {
        const fetchUser = async () => {
            const data = await getUser()
            setUser(data ?? undefined)
        }

        fetchUser()
    }, [])

    return (
        <div className="flex flex-row p-2 mb-2 sticky items-center justify-between">
            <Link className="text-3xl text-french-purple" href='/'>Eagile</Link>
            {user !== undefined
            ? (
                <div className="flex flex-row gap-3 items-center">
                    <UserIcon name={user.username}/>
                    <button className="text-xl text-white bg-french-purple rounded-lg p-2" onClick={() => logout()}>Sign out</button>
                </div>
            ) 
            : (<div className="flex flex-row gap-3">
                    <Link className="text-xl text-white bg-french-purple rounded-lg p-2" href="/signup">Sign Up</Link>
                    <Link className="text-xl text-white bg-french-purple rounded-lg p-2" href="/login">Log In</Link>
                </div>
            )}
            
        </div>
    )
}

export default Navbar