"use server"

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export default async function requireAuth() {

    const supabase = createServerComponentClient({ cookies })
    const {data: {user}} = await supabase.auth.getUser()

    if (!user) {
        return null
    }

    return user

}