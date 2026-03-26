import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { googleCalendarService } from '@/lib/services/googleCalendar'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isConnected = await googleCalendarService.isConnected(user.id)
    if (!isConnected) {
      return NextResponse.json({ error: 'Google Calendar not connected' }, { status: 400 })
    }

    const calendars = await googleCalendarService.listCalendars(user.id)
    const tokens = await googleCalendarService.getTokens(user.id)
    const activeCalendarId = tokens?.calendar_id || 'primary'

    return NextResponse.json({ calendars, activeCalendarId })
  } catch (error) {
    console.error('Error listing calendars:', error)
    return NextResponse.json({ error: 'Failed to list calendars' }, { status: 500 })
  }
}

// Switch active calendar
export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { calendarId } = await request.json()
    if (!calendarId) {
      return NextResponse.json({ error: 'calendarId is required' }, { status: 400 })
    }

    await googleCalendarService.setActiveCalendar(user.id, calendarId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error switching calendar:', error)
    return NextResponse.json({ error: 'Failed to switch calendar' }, { status: 500 })
  }
}
