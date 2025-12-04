// app/api/profile/avatar/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(req: Request) {
  try {
    const token = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '')
    if (!token) return NextResponse.json({ error: 'Missing token' }, { status: 401 })

    const body = await req.json()
    const path = body?.path
    if (!path) return NextResponse.json({ error: 'Missing path' }, { status: 400 })

    // Verify token -> get user
    const { data: userData, error: userErr } = await supabaseAdmin.auth.getUser(token as string)
    if (userErr) return NextResponse.json({ error: userErr.message }, { status: 401 })
    const userId = userData?.user?.id
    if (!userId) return NextResponse.json({ error: 'Invalid user' }, { status: 401 })

    // Update the auth user metadata with the avatar path
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      user_metadata: { avatar_url: path }
    })
    if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 })

    // Create a signed URL (1 hour) so the client can preview immediately
    const expiresIn = 60 * 60 // 1 hour
    const { data: signedData, error: signedErr } = await supabaseAdmin.storage.from('avatars').createSignedUrl(path, expiresIn)
    if (signedErr) return NextResponse.json({ error: signedErr.message }, { status: 500 })

    const signedUrl = (signedData as any)?.signedUrl
    return NextResponse.json({ success: true, avatar_url: signedUrl, path })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Unexpected error' }, { status: 500 })
  }
}
