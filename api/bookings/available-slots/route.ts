
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    
    if (!date) {
      return NextResponse.json({ error: 'Date parameter is required' }, { status: 400 })
    }

    // Get the day of week for the requested date
    const requestedDate = new Date(date)
    const dayOfWeek = requestedDate.getDay()
    
    // Get time slots based on day of week (Rob's schedule)
    const getTimeSlotsForDay = (day: number): string[] => {
      switch (day) {
        case 1: // Monday
          return ['10:00 AM', '2:00 PM', '6:00 PM']
        case 2: // Tuesday
          return ['10:00 AM']
        case 3: // Wednesday
          return ['6:00 PM']
        case 4: // Thursday
          return ['10:00 AM']
        case 5: // Friday
          return ['6:00 PM']
        case 6: // Saturday
          return ['6:00 PM']
        case 0: // Sunday
        default:
          return [] // No availability on Sunday
      }
    }

    const allTimeSlots = getTimeSlotsForDay(dayOfWeek)
    
    // If no slots available for this day, return empty array
    if (allTimeSlots.length === 0) {
      return NextResponse.json({ 
        date,
        availableSlots: [],
        allSlots: [],
        bookedSlots: [],
        withinFortyEightHours: []
      })
    }

    // Check 48-hour minimum booking window
    const now = new Date()
    const fortyEightHoursFromNow = new Date(now.getTime() + (48 * 60 * 60 * 1000)) // 48 hours in milliseconds
    
    // Filter out slots that are within the 48-hour window
    const slotsWithinFortyEightHours: string[] = []
    const validTimeSlots = allTimeSlots.filter(timeSlot => {
      // Parse the time slot and create a full datetime for comparison
      const [time, period] = timeSlot.split(' ')
      const [hours, minutes] = time.split(':')
      let hour24 = parseInt(hours)
      
      // Convert to 24-hour format
      if (period === 'PM' && hour24 !== 12) {
        hour24 += 12
      } else if (period === 'AM' && hour24 === 12) {
        hour24 = 0
      }
      
      const slotDateTime = new Date(requestedDate)
      slotDateTime.setHours(hour24, parseInt(minutes || '0'), 0, 0)
      
      // Check if this slot is within 48 hours
      if (slotDateTime <= fortyEightHoursFromNow) {
        slotsWithinFortyEightHours.push(timeSlot)
        return false // Filter out this slot
      }
      
      return true // Keep this slot
    })

    // Get existing bookings for this date
    const startOfDay = new Date(requestedDate)
    startOfDay.setHours(0, 0, 0, 0)
    
    const endOfDay = new Date(requestedDate)
    endOfDay.setHours(23, 59, 59, 999)

    const existingBookings = await prisma.booking.findMany({
      where: {
        scheduledAt: {
          gte: startOfDay,
          lte: endOfDay
        },
        status: {
          notIn: ['cancelled'] // Don't count cancelled bookings
        }
      },
      select: {
        scheduledAt: true,
        lead: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    })

    // Convert existing bookings to time slot format
    const bookedSlots = existingBookings.map((booking: any) => {
      return booking.scheduledAt.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: 'America/Los_Angeles' // PST/PDT for Los Angeles
      })
    })

    // Filter out booked slots from the valid time slots (after 48-hour filtering)
    const availableSlots = validTimeSlots.filter(slot => !bookedSlots.includes(slot))

    return NextResponse.json({
      date,
      availableSlots,
      allSlots: allTimeSlots,
      validSlots: validTimeSlots, // Slots after 48-hour filtering but before booking filtering
      bookedSlots,
      withinFortyEightHours: slotsWithinFortyEightHours,
      fortyEightHourCutoff: fortyEightHoursFromNow.toISOString(),
      existingBookings: existingBookings.map((booking: any) => ({
        time: booking.scheduledAt.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
          timeZone: 'America/Los_Angeles'
        }),
        customerName: `${booking.lead.firstName} ${booking.lead.lastName}`
      }))
    })

  } catch (error) {
    console.error('Error fetching available slots:', error)
    return NextResponse.json(
      { error: 'Failed to fetch available slots' },
      { status: 500 }
    )
  }
}
