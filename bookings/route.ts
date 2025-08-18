
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { odooWorkingService } from '@/lib/odoo-working-service'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { leadId, scheduledAt, googleEventId, notes } = body

    // Check for existing bookings at the same time slot (prevent double booking)
    const requestedDateTime = new Date(scheduledAt)
    
    // Check for any existing booking within 90 minutes of the requested time
    const conflictStart = new Date(requestedDateTime.getTime() - (90 * 60 * 1000)) // 90 minutes before
    const conflictEnd = new Date(requestedDateTime.getTime() + (90 * 60 * 1000))   // 90 minutes after
    
    const existingBooking = await prisma.booking.findFirst({
      where: {
        scheduledAt: {
          gte: conflictStart,
          lte: conflictEnd
        },
        status: {
          notIn: ['cancelled'] // Don't count cancelled bookings as conflicts
        }
      },
      include: {
        lead: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    })

    if (existingBooking) {
      return NextResponse.json(
        { 
          error: 'Time slot conflict',
          message: `This time slot conflicts with an existing appointment for ${existingBooking.lead.firstName} ${existingBooking.lead.lastName} at ${existingBooking.scheduledAt.toLocaleString()}.`,
          conflictingBooking: {
            id: existingBooking.id,
            scheduledAt: existingBooking.scheduledAt,
            customerName: `${existingBooking.lead.firstName} ${existingBooking.lead.lastName}`
          }
        },
        { status: 409 } // Conflict status code
      )
    }

    const booking = await prisma.booking.create({
      data: {
        leadId,
        scheduledAt: new Date(scheduledAt),
        googleEventId: googleEventId || null,
        notes: notes || null,
        duration: 90 // default 90 minutes
      }
    })

    // Update lead status to indicate they've scheduled
    const updatedLead = await prisma.lead.update({
      where: { id: leadId },
      data: { status: 'contacted' }
    })

    // Create lead in Odoo CRM (non-blocking)
    let odooLeadId: number | null = null
    try {
      console.log('🔄 Creating lead in Odoo CRM...')
      
      const bookingDataForOdoo = {
        lead: {
          id: updatedLead.id,
          firstName: updatedLead.firstName,
          lastName: updatedLead.lastName,
          email: updatedLead.email,
          cellPhone: updatedLead.cellPhone,
          address: updatedLead.address,
          ownOrRent: updatedLead.ownOrRent,
          availableForConsult: updatedLead.availableForConsult,
          decisionMakersAvail: updatedLead.decisionMakersAvail,
          renovateElsewhere: updatedLead.renovateElsewhere,
          renovateElsewhereDetails: updatedLead.renovateElsewhereDetails,
          createdAt: updatedLead.createdAt
        },
        booking: {
          id: booking.id,
          scheduledAt: booking.scheduledAt,
          duration: booking.duration,
          notes: booking.notes
        }
      }

      const odooResult = await odooWorkingService.createLeadFromBooking(bookingDataForOdoo)
      
      if (odooResult.success && odooResult.leadId) {
        odooLeadId = odooResult.leadId
        
        // Update booking with Odoo lead ID
        await prisma.booking.update({
          where: { id: booking.id },
          data: { externalId: odooResult.leadId.toString() }
        })
        
        // Update lead with Odoo ID
        await prisma.lead.update({
          where: { id: leadId },
          data: { externalId: odooResult.leadId.toString() }
        })
        
        console.log('✅ Lead created in Odoo successfully:', {
          bookingId: booking.id,
          odooLeadId: odooResult.leadId,
          customerName: `${updatedLead.firstName} ${updatedLead.lastName}`
        })
      } else {
        console.error('❌ Failed to create lead in Odoo:', odooResult.error)
      }
    } catch (odooError) {
      console.error('❌ Odoo integration error (booking will still proceed):', odooError)
      // Don't fail the booking creation if Odoo fails
    }

    // Send email notification
    try {
      // Prepare booking data for email notification
      const bookingForEmail = {
        id: booking.id,
        appointmentDate: booking.scheduledAt,
        appointmentTime: new Date(booking.scheduledAt).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
          timeZone: 'America/Los_Angeles' // PST/PDT for Los Angeles
        }),
        notes: booking.notes,
        duration: booking.duration
      }

      // Call email notification API
      const emailResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/notifications/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'booking',
          data: {
            booking: bookingForEmail,
            lead: updatedLead
          }
        })
      })

      const emailResult = await emailResponse.json()
      
      if (emailResponse.ok) {
        console.log('✅ Booking notification emails sent:', emailResult.message)
      } else {
        console.error('❌ Failed to send booking notification emails:', emailResult.error)
      }
    } catch (emailError) {
      console.error('❌ Error sending booking notification emails:', emailError)
      // Don't fail the booking creation if email fails
    }

    return NextResponse.json({ 
      success: true, 
      bookingId: booking.id,
      message: 'Booking created and notifications sent'
    })
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}
