
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { gohighlevelService } from '@/lib/gohighlevel-service'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { 
      firstName, 
      lastName, 
      email, 
      cellPhone, 
      address, 
      ownOrRent, 
      availableForConsult, 
      decisionMakersAvail, 
      renovateElsewhere,
      renovateElsewhereDetails
    } = body

    // Check if renter (handled on frontend, but double-check here)
    if (ownOrRent === 'rent') {
      return NextResponse.json(
        { error: 'We cannot work with renters. Please have your landlord contact us directly.' },
        { status: 400 }
      )
    }

    // Create lead in local database
    const lead = await prisma.lead.create({
      data: {
        firstName,
        lastName,
        email,
        cellPhone,
        address,
        ownOrRent,
        availableForConsult: availableForConsult === true,
        decisionMakersAvail: decisionMakersAvail === true,
        renovateElsewhere: renovateElsewhere === true,
        renovateElsewhereDetails: renovateElsewhereDetails || null,
        status: 'qualified'
      }
    })

    // Also send lead to GoHighLevel CRM
    try {
      const ghlResult = await gohighlevelService.createLead({
        firstName,
        lastName: lastName || '',
        email,
        phone: cellPhone,
        projectType: 'Bathroom Remodeling',
        timeframe: 'To be determined',
        budget: 'To be determined',
        additionalNotes: `
Address: ${address}
Own/Rent: ${ownOrRent}
Available for Consult: ${availableForConsult ? 'Yes' : 'No'}
Decision Makers Available: ${decisionMakersAvail ? 'Yes' : 'No'}
Renovated Elsewhere: ${renovateElsewhere ? 'Yes' : 'No'}
${renovateElsewhereDetails ? `Renovation Details: ${renovateElsewhereDetails}` : ''}
        `,
        source: 'tub2showerla.com - Qualification Form'
      })

      console.log('GoHighLevel integration result:', ghlResult)
    } catch (ghlError) {
      console.error('GoHighLevel integration failed:', ghlError)
      // Don't fail the entire request if GoHighLevel fails
    }

    return NextResponse.json({ success: true, leadId: lead.id })
  } catch (error) {
    console.error('Error creating lead:', error)
    return NextResponse.json(
      { error: 'Failed to submit form' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        bookings: true
      }
    })

    return NextResponse.json(leads)
  } catch (error) {
    console.error('Error fetching leads:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    )
  }
}
