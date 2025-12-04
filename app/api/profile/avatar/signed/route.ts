// app/api/profile/avatar/signed/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(req: Request) {
  try {
    const token = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '')
    if (!token) return NextResponse.json({ error: 'Missing token' }, { status: 401 })

    // Verify token -> get user
    const { data: userData, error: userErr } = await supabaseAdmin.auth.getUser(token as string)
    if (userErr) return NextResponse.json({ error: userErr.message }, { status: 401 })
    const userId = userData?.user?.id
    if (!userId) return NextResponse.json({ error: 'Invalid user' }, { status: 401 })

    // Read stored path from auth user metadata
    const user = userData.user
    const path = user?.user_metadata?.avatar_url
    if (!path) return NextResponse.json({ error: 'No avatar set' }, { status: 404 })

    // Create signed URL
    const expiresIn = 60 * 60 // 1 hour
    const { data: signedData, error: signedErr } = await supabaseAdmin.storage.from('avatars').createSignedUrl(path, expiresIn)
    if (signedErr) return NextResponse.json({ error: signedErr.message }, { status: 500 })

    const signedUrl = (signedData as any)?.signedUrl
    return NextResponse.json({ signed_url: signedUrl })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Unexpected error' }, { status: 500 })
  }
}
