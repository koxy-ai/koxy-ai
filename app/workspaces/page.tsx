"use client"

import { InterfaceNav } from '../../components/layout/Navbar'
import Auth, { type Props } from "../auth/Auth"
import SideBar from '../../components/layout/Sidebar'
import { useEffect } from "react"
import getAllWorkspaces from "@/app/actions/workspaces/getAll"

const Workspaces = () => ( <Auth Comp={Page} /> )

function Page({ user }: Props) {

    useEffect( () => {
        // getAllWorkspaces().then( (data: any) => {
        //     alert(data.length)
        // })
    }, [])

    return (
        <>
            {/*<InterfaceNav active="home" />*/}
            {/*<SideBar user={user} />*/}
            <div>Hello</div>
        </>    
    )

}

export default Workspaces