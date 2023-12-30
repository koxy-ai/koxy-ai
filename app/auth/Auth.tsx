"use client"

import { type User } from "@supabase/auth-helpers-nextjs"
import { useEffect, useState } from "react"
import requireAuth from "./require"
import LoadingPage from "@/components/loading/page"
import { useRouter } from "next/navigation"
import is from "@/scripts/is"

export type Props = {
    user: User
}

const memUser: {value: User | null} = {
    value: null
}

export default function Auth({Comp}: {Comp: any}) {

    const router = useRouter()
    const [user, setUser]: any = useState(memUser.value)

    useEffect(() => {
        is([user, null], () => {
            requireAuth().then( (data: User | null) => {
                if (!data) {
                    router.push("/auth")
                    return undefined
                }
                memUser.value = data
                setUser(data)
            })
        })
    }, [])

    if (!user) {
        return <LoadingPage info="Loading user data" />
    }

    return <Comp user={user} />

}