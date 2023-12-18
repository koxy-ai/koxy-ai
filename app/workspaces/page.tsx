"use client"

import Auth from "../auth/Auth"

export default function () {

    return <Auth Comp={Page} />

}

function Page() {

    return (
        <div>Hello</div>    
    )

}