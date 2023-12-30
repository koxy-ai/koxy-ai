"use server"

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export default async function getAllWorkspaces() {

	const supabase = createServerComponentClient({ cookies })
	const { data: workspaces } = await supabase.from("workspaces").select()

	return workspaces

}