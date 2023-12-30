"use server"

import supabaseServer from "@/app/actions/supabaseServer"

export default async function requireAuth() {

    const supabase = supabaseServer()
    const {data: {user}}: any = await supabase.auth.getUser()

    return user || null

}