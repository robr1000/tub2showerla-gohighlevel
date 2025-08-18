
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

// Handle incoming webhooks from CRM systems
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const headers = request.headers
    
    // Get webhook source from header or body
    const webhookSource = headers.get('x-webhook-source') || body.source || 'unknown'
    const webhookType = headers.get('x-webhook-type') || body.type || 'unknown'
    
    console.log(`📥 Incoming CRM webhook from ${webhookSource}:`, webhookType)
    
    // Route to appropriate handler based on CRM system
    switch (webhookSource.toLowerCase()) {
      case 'gohighlevel':
      case 'ghl':
        return await handleGoHighLevelWebhook(body, webhookType)
      
      case 'odoo':
        return await handleOdooWebhook(body, webhookType)
      
      case 'zapier':
        return await handleZapierWebhook(body, webhookType)
      
      default:
        return await handleGenericWebhook(body, webhookType)
    }
  } catch (error) {
    console.error('CRM webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

// Handle outgoing webhook requests (push data to CRM)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, data, crmSystem } = body
    
    console.log(`📤 Outgoing CRM webhook to ${crmSystem}:`, action)
    
    switch (action) {
      case 'push_lead':
        return await pushLeadToCRM(data, crmSystem)
      
      case 'push_booking':
        return await pushBookingToCRM(data, crmSystem)
      
      case 'update_status':
        return await updateCRMStatus(data, crmSystem)
      
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('CRM push error:', error)
    return NextResponse.json({ error: 'CRM push failed' }, { status: 500 })
  }
}

// GoHighLevel webhook handler
async function handleGoHighLevelWebhook(body: any, type: string) {
  try {
    switch (type) {
      case 'contact.created':
      case 'lead.created':
        // Handle new lead from GoHighLevel
        const ghlLead = {
          firstName: body.contact?.firstName || body.first_name || '',
          lastName: body.contact?.lastName || body.last_name || '',
          email: body.contact?.email || body.email || '',
          cellPhone: body.contact?.phone || body.phone || '',
          address: body.contact?.address || body.address || '',
          ownOrRent: 'unknown',
          availableForConsult: true,
          decisionMakersAvail: true,
          renovateElsewhere: false,
          renovateElsewhereDetails: null,
          status: 'new',
          source: 'gohighlevel',
          externalId: body.contact?.id || body.id
        }
        
        const createdLead = await prisma.lead.create({ data: ghlLead })
        console.log('✅ Lead created from GoHighLevel:', createdLead.id)
        
        return NextResponse.json({ success: true, leadId: createdLead.id })
        
      case 'appointment.created':
        // Handle appointment from GoHighLevel
        if (body.contact?.id && body.appointment) {
          const existingLead = await prisma.lead.findFirst({
            where: { externalId: body.contact.id }
          })
          
          if (existingLead) {
            const booking = await prisma.booking.create({
              data: {
                leadId: existingLead.id,
                scheduledAt: new Date(body.appointment.startTime),
                duration: body.appointment.duration || 90,
                notes: body.appointment.title || 'Imported from GoHighLevel',
                externalId: body.appointment.id
              }
            })
            
            console.log('✅ Booking created from GoHighLevel:', booking.id)
            return NextResponse.json({ success: true, bookingId: booking.id })
          }
        }
        break
    }
    
    return NextResponse.json({ success: true, message: 'GoHighLevel webhook processed' })
  } catch (error) {
    console.error('GoHighLevel webhook error:', error)
    return NextResponse.json({ error: 'GoHighLevel webhook failed' }, { status: 500 })
  }
}

// Odoo webhook handler
async function handleOdooWebhook(body: any, type: string) {
  try {
    switch (type) {
      case 'lead.created':
        const odooLead = {
          firstName: body.partner_name?.split(' ')[0] || body.contact_name?.split(' ')[0] || '',
          lastName: body.partner_name?.split(' ').slice(1).join(' ') || body.contact_name?.split(' ').slice(1).join(' ') || '',
          email: body.email_from || body.email || '',
          cellPhone: body.phone || body.mobile || '',
          address: body.street || body.contact_address || '',
          ownOrRent: 'unknown',
          availableForConsult: true,
          decisionMakersAvail: true,
          renovateElsewhere: false,
          renovateElsewhereDetails: body.description || null,
          status: 'new',
          source: 'odoo',
          externalId: body.id?.toString()
        }
        
        const createdLead = await prisma.lead.create({ data: odooLead })
        console.log('✅ Lead created from Odoo:', createdLead.id)
        
        return NextResponse.json({ success: true, leadId: createdLead.id })
    }
    
    return NextResponse.json({ success: true, message: 'Odoo webhook processed' })
  } catch (error) {
    console.error('Odoo webhook error:', error)
    return NextResponse.json({ error: 'Odoo webhook failed' }, { status: 500 })
  }
}

// Zapier webhook handler (generic integration)
async function handleZapierWebhook(body: any, type: string) {
  try {
    // Handle standardized Zapier webhook format
    const zapierLead = {
      firstName: body.firstName || body.first_name || '',
      lastName: body.lastName || body.last_name || '',
      email: body.email || '',
      cellPhone: body.phone || body.cellPhone || '',
      address: body.address || '',
      ownOrRent: body.ownOrRent || 'unknown',
      availableForConsult: body.availableForConsult !== false,
      decisionMakersAvail: body.decisionMakersAvail !== false,
      renovateElsewhere: body.renovateElsewhere || false,
      renovateElsewhereDetails: body.renovateElsewhereDetails || null,
      status: body.status || 'new',
      source: 'zapier',
      externalId: body.id?.toString()
    }
    
    const createdLead = await prisma.lead.create({ data: zapierLead })
    console.log('✅ Lead created from Zapier:', createdLead.id)
    
    return NextResponse.json({ success: true, leadId: createdLead.id })
  } catch (error) {
    console.error('Zapier webhook error:', error)
    return NextResponse.json({ error: 'Zapier webhook failed' }, { status: 500 })
  }
}

// Generic webhook handler
async function handleGenericWebhook(body: any, type: string) {
  // Log the webhook for analysis
  console.log('📋 Generic webhook received:', { type, body })
  
  return NextResponse.json({ 
    success: true, 
    message: 'Generic webhook received and logged',
    type,
    timestamp: new Date().toISOString()
  })
}

// Push lead to external CRM
async function pushLeadToCRM(leadData: any, crmSystem: string) {
  const { leadId } = leadData
  
  try {
    const lead = await prisma.lead.findUnique({
      where: { id: leadId }
    })
    
    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }
    
    // Prepare lead data for external CRM
    const crmLeadData = {
      firstName: lead.firstName,
      lastName: lead.lastName,
      email: lead.email,
      phone: lead.cellPhone,
      address: lead.address,
      status: lead.status,
      source: 'truenorth-landing-page',
      customFields: {
        ownOrRent: lead.ownOrRent,
        availableForConsult: lead.availableForConsult,
        decisionMakersAvail: lead.decisionMakersAvail,
        renovateElsewhere: lead.renovateElsewhere,
        renovateElsewhereDetails: lead.renovateElsewhereDetails
      },
      tags: ['bathroom-remodeling', 'website-lead'],
      createdAt: lead.createdAt
    }
    
    // Here you would implement the actual CRM API calls
    // For now, we'll log the data that would be sent
    console.log(`🚀 Would push lead to ${crmSystem}:`, crmLeadData)
    
    return NextResponse.json({ 
      success: true, 
      message: `Lead data prepared for ${crmSystem}`,
      data: crmLeadData 
    })
  } catch (error) {
    console.error(`Error pushing lead to ${crmSystem}:`, error)
    return NextResponse.json({ error: 'Failed to push lead to CRM' }, { status: 500 })
  }
}

// Push booking to external CRM
async function pushBookingToCRM(bookingData: any, crmSystem: string) {
  const { bookingId } = bookingData
  
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { lead: true }
    })
    
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }
    
    const crmBookingData = {
      contactId: booking.lead.externalId,
      appointmentDate: booking.scheduledAt,
      duration: booking.duration,
      title: 'Bathroom Consultation',
      description: booking.notes || 'In-home bathroom remodeling consultation',
      status: 'scheduled',
      source: 'truenorth-landing-page'
    }
    
    console.log(`📅 Would push booking to ${crmSystem}:`, crmBookingData)
    
    return NextResponse.json({ 
      success: true, 
      message: `Booking data prepared for ${crmSystem}`,
      data: crmBookingData 
    })
  } catch (error) {
    console.error(`Error pushing booking to ${crmSystem}:`, error)
    return NextResponse.json({ error: 'Failed to push booking to CRM' }, { status: 500 })
  }
}

// Update status in external CRM
async function updateCRMStatus(statusData: any, crmSystem: string) {
  const { leadId, status } = statusData
  
  try {
    const lead = await prisma.lead.findUnique({
      where: { id: leadId }
    })
    
    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }
    
    console.log(`📊 Would update ${crmSystem} contact ${lead.externalId} status to: ${status}`)
    
    return NextResponse.json({ 
      success: true, 
      message: `Status update prepared for ${crmSystem}`,
      contactId: lead.externalId,
      newStatus: status 
    })
  } catch (error) {
    console.error(`Error updating status in ${crmSystem}:`, error)
    return NextResponse.json({ error: 'Failed to update CRM status' }, { status: 500 })
  }
}
