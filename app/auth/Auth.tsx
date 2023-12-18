"use client"

import { useEffect, useState } from "react";
import requireAuth from "./require";
import LoadingPage from "@/components/loading/page";

export default function Auth({Comp}: {Comp: any}) {

    const [user, setUser]: any = useState(null)

    useEffect(() => {
        requireAuth().then( (data: any) => {
            if (!data) {
                location.href = '/auth'
            }
            setUser(data)
        })
    }, [])

    return (
        <>
            {
                user !== null
                    ? <Comp />
                    : <LoadingPage info="Loading user data" />
            }
        </>
    )

}