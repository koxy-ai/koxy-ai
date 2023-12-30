"use client"

import getWorkspace from "./workspace"
import is from "@/scripts/is"
import { useEffect, useState } from "react"
import { type User } from "@supabase/auth-helpers-nextjs"
import { useRouter, usePathname } from "next/navigation"

type Props = {
	user: User | null
	Comp: any
}

export type PageProps = {
	user: User | null,
	workspace: any
}

const memWorkspace: {value: any} = {
	value: null
}

export default function WorkspacePage({ user, Comp }: Props) {

	const [ workspace, setWorkspace ]: any = useState(memWorkspace.value)
	
	const router = useRouter()
	const path = usePathname().split("/")
	const id = path[1]

	useEffect( () => {
		if (memWorkspace.value) {
			if (memWorkspace.value?.id === id) {
				setWorkspace(memWorkspace.value)
				return undefined
			}
		}

		getWorkspace(id, router).then( (data: any) => {
			is([data, "object"], () => {
				memWorkspace.value = data
				setWorkspace(data)
			})
		})

	}, [])

	if (!workspace) {
		return <></>
	}

	return <Comp workspace={workspace} user={user} />

}