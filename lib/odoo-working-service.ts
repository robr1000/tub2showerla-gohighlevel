
/**
 * Working Odoo CRM Integration Service - JSON-RPC Approach
 * Successfully creates leads in Rob's Odoo CRM using JSON-RPC
 */

export interface OdooLeadData {
  name: string
  email_from: string
  phone: string
  street: string
  partner_name: string
  description: string
  stage_id?: number
  source_id?: number
}

interface BookingDataForOdoo {
  lead: {
    id: string
    firstName: string
    lastName: string
    email: string
    cellPhone: string
    address: string
    ownOrRent: string
    availableForConsult: boolean
    decisionMakersAvail: boolean
    renovateElsewhere: boolean
    renovateElsewhereDetails?: string | null
    createdAt: Date
  }
  booking: {
    id: string
    scheduledAt: Date
    duration: number
    notes?: string | null
  }
}

class OdooWorkingService {
  private credentials = {
    url: process.env.ODOO_URL || 'https://true-north-kitchen-bath-robr100.odoo.com',
    database: process.env.ODOO_DATABASE || 'true-north-kitchen-bath-robr100',
    username: process.env.ODOO_USERNAME || 'rradosta1@gmail.com',
    apiKey: process.env.ODOO_API_KEY || 'c1dbb5fb00bfe7cab61547fb5794d6135f792aa6',
    userId: 2, // Rob's user ID
    qualifiedStageId: 2 // Qualified stage ID
  }

  /**
   * Make JSON-RPC call to Odoo (Working approach!)
   */
  private async makeJsonRpcCall(service: string, method: string, args: any[]): Promise<any> {
    const url = `${this.credentials.url}/jsonrpc`
    
    console.log(`📡 Making JSON-RPC call to ${url}`)
    console.log(`📋 Service: ${service}, Method: ${method}`)
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'call',
        params: {
          service: service,
          method: method,
          args: args
        },
        id: Math.floor(Math.random() * 1000000)
      })
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const result = await response.json()
    console.log(`📨 Response received`)
    
    if (result.error) {
      console.error('❌ Odoo returned error:', result.error)
      throw new Error(`Odoo API Error: ${result.error.message || result.error.data?.message || 'Unknown error'}`)
    }
    
    return result.result
  }

  /**
   * Create lead in Odoo CRM using working JSON-RPC approach
   */
  private async createOdooLead(leadData: OdooLeadData): Promise<number> {
    try {
      console.log('💾 Creating lead in Odoo using JSON-RPC...')
      console.log('Lead data preview:', {
        name: leadData.name,
        email: leadData.email_from,
        phone: leadData.phone,
        stage_id: leadData.stage_id
      })
      
      const result = await this.makeJsonRpcCall('object', 'execute_kw', [
        this.credentials.database,
        this.credentials.userId,
        this.credentials.apiKey,
        'crm.lead',
        'create',
        [leadData]
      ])
      
      if (!result) {
        throw new Error('Lead creation failed: No ID returned')
      }
      
      console.log('✅ Lead created successfully in Odoo, ID:', result)
      return result
      
    } catch (error) {
      console.error('❌ Error creating Odoo lead:', error)
      throw error
    }
  }

  private mapBookingToOdooLead(bookingData: BookingDataForOdoo, stageId?: number): OdooLeadData {
    const { lead, booking } = bookingData
    
    const appointmentDate = booking.scheduledAt.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    
    const appointmentTime = booking.scheduledAt.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'America/Los_Angeles'
    })

    let description = `WEBSITE BOOKING - Bath Remodeling Lead\n\n`
    description += `SCHEDULED CONSULTATION:\n`
    description += `Date: ${appointmentDate}\n`
    description += `Time: ${appointmentTime} (PST)\n`
    description += `Duration: ${booking.duration} minutes\n\n`
    
    description += `CUSTOMER DETAILS:\n`
    description += `Name: ${lead.firstName} ${lead.lastName}\n`
    description += `Email: ${lead.email}\n`
    description += `Phone: ${lead.cellPhone}\n`
    description += `Address: ${lead.address}\n`
    description += `Homeowner: ${lead.ownOrRent === 'own' ? 'Yes' : 'No'}\n\n`
    
    description += `QUALIFICATION:\n`
    description += `Available for consultation: ${lead.availableForConsult ? 'Yes' : 'No'}\n`
    description += `Decision makers available: ${lead.decisionMakersAvail ? 'Yes' : 'No'}\n`
    description += `Additional renovations: ${lead.renovateElsewhere ? 'Yes' : 'No'}\n`
    
    if (lead.renovateElsewhere && lead.renovateElsewhereDetails) {
      description += `Additional details: ${lead.renovateElsewhereDetails}\n`
    }
    
    if (booking.notes) {
      description += `\nBOOKING NOTES: ${booking.notes}\n`
    }
    
    description += `\nLEAD SOURCE: Website Booking\n`
    description += `LEAD ID: ${lead.id}\n`
    description += `Generated: ${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}`

    // Fixed field mapping - removed 'mobile' field that doesn't exist in Rob's Odoo
    const leadData: OdooLeadData = {
      name: `${lead.firstName} ${lead.lastName} - Bath Remodeling`,
      partner_name: `${lead.firstName} ${lead.lastName}`,
      email_from: lead.email,
      phone: lead.cellPhone,
      street: lead.address,
      description: description
    }

    if (stageId) {
      leadData.stage_id = stageId
    }

    return leadData
  }

  /**
   * Test connection to Odoo
   */
  async testConnection(): Promise<{ success: boolean; userId?: number; error?: string }> {
    try {
      if (!this.credentials.url || !this.credentials.database || !this.credentials.username || !this.credentials.apiKey) {
        throw new Error('Missing Odoo credentials')
      }

      console.log('🧪 Testing Odoo connection with working JSON-RPC approach...')
      console.log('URL:', this.credentials.url)
      console.log('Database:', this.credentials.database)
      console.log('Username:', this.credentials.username)
      
      // Test with a simple lead creation
      const testLeadData: OdooLeadData = {
        name: 'Connection Test Lead - ' + new Date().toISOString(),
        partner_name: 'Test Customer',
        email_from: 'test@example.com',
        phone: '(555) 123-4567',
        street: '123 Test Street, Los Angeles, CA',
        description: 'Test lead created by connection test',
        stage_id: this.credentials.qualifiedStageId
      }
      
      const leadId = await this.createOdooLead(testLeadData)
      
      console.log('✅ Odoo connection successful')
      return { success: true, userId: this.credentials.userId }
      
    } catch (error) {
      console.error('❌ Odoo connection failed:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Create lead from booking data
   */
  async createLeadFromBooking(bookingData: BookingDataForOdoo): Promise<{ success: boolean; leadId?: number; error?: string }> {
    try {
      console.log('📝 Creating Odoo lead from booking data using working JSON-RPC...')
      
      if (!this.credentials.url || !this.credentials.database || !this.credentials.username || !this.credentials.apiKey) {
        throw new Error('Missing Odoo credentials')
      }

      const leadData = this.mapBookingToOdooLead(bookingData, this.credentials.qualifiedStageId)
      
      console.log('📋 Mapped lead data:', {
        name: leadData.name,
        email: leadData.email_from,
        phone: leadData.phone,
        stage_id: leadData.stage_id || 'default'
      })

      const leadId = await this.createOdooLead(leadData)
      
      console.log('✅ Lead created successfully in Odoo')
      console.log('Lead ID:', leadId)
      console.log('Lead Name:', leadData.name)
      
      return {
        success: true,
        leadId: leadId
      }
      
    } catch (error) {
      console.error('❌ Failed to create Odoo lead:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Direct lead creation (for testing)
   */
  async createLead(leadData: OdooLeadData): Promise<number> {
    try {
      console.log('📝 Creating direct lead:', leadData.name)
      
      const leadId = await this.createOdooLead(leadData)
      
      return leadId
    } catch (error) {
      console.error('❌ Failed to create direct lead:', error)
      throw error
    }
  }
}

export const odooWorkingService = new OdooWorkingService()
export type { BookingDataForOdoo }
