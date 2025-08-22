import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getUserIdFromAuthHeader } from '@/lib/messaging'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const channel = searchParams.get('channel')
  const direction = searchParams.get('direction')
  const user_id = await getUserIdFromAuthHeader(request)
  if (!user_id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  let query: any = supabase.from('messages').select('*').eq('user_id', user_id).order('created_at', { ascending: false }).limit(200)
  if (channel) query = query.eq('channel', channel)
  if (direction) query = query.eq('direction', direction)
  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ messages: data })
}
