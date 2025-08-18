
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { googleCalendarService } from '@/lib/google-calendar'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { leadId, scheduledAt, duration = 90 } = body

    // Get lead information
    const lead = await prisma.lead.findUnique({
      where: { id: leadId }
    })

    if (!lead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      )
    }

    // Calculate end time
    const startDateTime = new Date(scheduledAt)
    const endDateTime = new Date(startDateTime.getTime() + (duration * 60 * 1000))

    // Create calendar event
    try {
      const eventId = await googleCalendarService.createEvent(session.user.id, {
        title: `Bath Consultation - ${lead.firstName} ${lead.lastName}`,
        description: `Free in-home bath consultation with ${lead.firstName} ${lead.lastName}
        
Customer Details:
- Name: ${lead.firstName} ${lead.lastName}
- Email: ${lead.email}
- Phone: ${lead.cellPhone}
- Address: ${lead.address}
- Additional Renovations: ${lead.renovateElsewhere ? lead.renovateElsewhereDetails || 'Yes' : 'No'}

This is a 90-minute consultation to assess the current bathroom, discuss needs and safety concerns, provide custom design recommendations, and present a detailed quote with financing options.`,
        startDateTime: startDateTime.toISOString(),
        endDateTime: endDateTime.toISOString(),
        attendeeEmail: lead.email,
        attendeeName: `${lead.firstName} ${lead.lastName}`
      })

      return NextResponse.json({ 
        success: true, 
        eventId,
        message: 'Calendar event created successfully'
      })
    } catch (calendarError) {
      console.error('Calendar creation error:', calendarError)
      return NextResponse.json(
        { error: 'Failed to create calendar event. Please ensure Google Calendar is connected.' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error creating calendar event:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')

    if (!date) {
      return NextResponse.json(
        { error: 'Date parameter is required' },
        { status: 400 }
      )
    }

    const availableSlots = await googleCalendarService.getAvailableSlots(
      session.user.id,
      new Date(date)
    )

    return NextResponse.json({ availableSlots })
  } catch (error) {
    console.error('Error getting available slots:', error)
    return NextResponse.json(
      { error: 'Failed to get available slots' },
      { status: 500 }
    )
  }
}
