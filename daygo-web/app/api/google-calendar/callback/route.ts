import { NextRequest, NextResponse } from 'next/server'
import { googleCalendarService } from '@/lib/services/googleCalendar'

export async function GET(request: NextRequest) {
  const baseUrl = `${request.nextUrl.protocol}//${request.nextUrl.host}`

  try {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')
    const state = searchParams.get('state') // This is the user ID
    const error = searchParams.get('error')

    if (error) {
      console.error('Google OAuth error:', error)
      return NextResponse.redirect(`${baseUrl}/today?gcal_error=denied`)
    }

    if (!code || !state) {
      return NextResponse.redirect(`${baseUrl}/today?gcal_error=missing_params`)
    }

    // Exchange code for tokens
    const tokens = await googleCalendarService.exchangeCodeForTokens(code)

    // Save tokens to database
    await googleCalendarService.saveTokens(
      state, // user ID from state
      tokens.access_token,
      tokens.refresh_token,
      tokens.expiry_date
    )

    // Redirect back to today page with success message
    return NextResponse.redirect(`${baseUrl}/today?gcal_connected=true`)
  } catch (error) {
    console.error('Error in Google Calendar callback:', error)
    // Return a visible error page so the user can see what went wrong
    return new NextResponse(
      `<html><body style="font-family:sans-serif;padding:40px;max-width:500px;margin:0 auto">
        <h2>Google Calendar connection failed</h2>
        <p style="color:#666">${error instanceof Error ? error.message : 'Unknown error'}</p>
        <a href="${baseUrl}/today" style="color:#64748b">Back to DayGo</a>
      </body></html>`,
      { status: 500, headers: { 'Content-Type': 'text/html' } }
    )
  }
}
