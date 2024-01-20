"use server"

import supabaseServer from "@/app/actions/supabaseServer"
import { type User } from "@supabase/supabase-js"

export default async function getUser() {

	const supabase = supabaseServer()
	const { data: {user} }: any = await supabase.auth.getUser()

    return user as User

}