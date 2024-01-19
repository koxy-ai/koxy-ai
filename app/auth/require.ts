"use server"

import { type User } from "@supabase/auth-helpers-nextjs"
import supabaseServer from "@/app/actions/supabaseServer"

export default async function requireAuth(): Promise<User | null> {

    const supabase = supabaseServer()
    const {data: {user}}: any = await supabase.auth.getUser()

    return user || null

}