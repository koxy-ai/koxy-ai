"use client"

import Auth, { type Props } from "@/app/auth/Auth"
import { useEffect, useState } from "react"
import is from "@/scripts/is"
import getAllWorkspaces from "@/app/actions/workspaces/getAll"
import LoadingPage from "@/components/loading/page"
import { useRouter } from "next/navigation"

const Home = () => ( <Auth Comp={Page} /> )

function Page({ user }: Props) {

	const router = useRouter()

	const [ latestWorkspace, setWorkspace ]: any = useState(localStorage.getItem("latest_workspace"))

	useEffect( () => {

		is([latestWorkspace, null], () => {

			getAllWorkspaces().then( (data: Array<any> | null) => {
				if (!data) {
					router.push("/welcome")
					return undefined
				}
				if (data.length < 1) {
					router.push("/welcome")
					return undefined
				}
				const firstWorkspace = data[0]
				localStorage.setItem("latest_workspace", firstWorkspace.id)
				setWorkspace(firstWorkspace.id)
				router.push(`/${firstWorkspace.id}`)
			})

		})

		is([latestWorkspace, "string"], (id: string) => {
			router.push(`/${id}`)
		})

	}, [])

	if (!latestWorkspace) {
		return <LoadingPage info="Loading latest created workspace" />
	}

	return <LoadingPage info="Redirecting to your workspace" />

}

export default Home