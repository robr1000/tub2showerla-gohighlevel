
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { googleCalendarService } from '@/lib/google-calendar'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const error = searchParams.get('error')

    if (error) {
      console.error('Google OAuth error:', error)
      return NextResponse.redirect(new URL('/admin/dashboard?error=oauth_error', request.url))
    }

    if (!code) {
      return NextResponse.redirect(new URL('/admin/dashboard?error=no_code', request.url))
    }

    // Exchange code for tokens
    const tokens = await googleCalendarService.exchangeCodeForTokens(code)

    // Save tokens to user
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        googleAccessToken: tokens.access_token,
        googleRefreshToken: tokens.refresh_token,
        googleTokenExpiry: new Date(tokens.expiry_date || Date.now() + 3600000),
        calendarId: 'primary' // Default to primary calendar
      }
    })

    return NextResponse.redirect(new URL('/admin/dashboard?success=calendar_connected', request.url))
  } catch (error) {
    console.error('Error in Google Calendar callback:', error)
    return NextResponse.redirect(new URL('/admin/dashboard?error=callback_error', request.url))
  }
}
