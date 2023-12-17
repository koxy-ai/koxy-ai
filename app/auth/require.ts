"use client"

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default async function requireAuth(Component: any) {

    const supabase = createClientComponentClient()
    const {data: {user}} = await supabase.auth.getUser()

    if (!user) {
        window.location.href = '/auth'
        return null
    }

    return Component

}