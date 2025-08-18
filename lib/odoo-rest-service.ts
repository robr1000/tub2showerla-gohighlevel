
/**
 * Odoo REST API Integration Service
 * Uses REST API instead of XML-RPC for trial account compatibility
 */

export interface OdooLeadData {
  name: string
  email_from: string
  phone: string
  mobile: string
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

class OdooRestService {
  private credentials = {
    url: process.env.ODOO_URL || '',
    database: process.env.ODOO_DATABASE || '',
    username: process.env.ODOO_USERNAME || '',
    apiKey: process.env.ODOO_API_KEY || ''
  }
  private sessionId: string | null = null
  private userId: number | null = null

  /**
   * Authenticate with Odoo using REST API
   */
  private async authenticate(): Promise<{ success: boolean; userId?: number; sessionId?: string; error?: string }> {
    try {
      console.log('🔐 Attempting Odoo REST API authentication...')
      console.log('Server URL:', this.credentials.url)
      console.log('Database:', this.credentials.database)
      console.log('Username:', this.credentials.username)
      
      const response = await fetch(`${this.credentials.url}/web/session/authenticate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'call',
          params: {
            db: this.credentials.database,
            login: this.credentials.username,
            password: this.credentials.apiKey
          },
          id: Math.floor(Math.random() * 1000000)
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      console.log('📨 Authentication response received')
      console.log('📋 Full response:', JSON.stringify(result, null, 2))
      
      if (result.error) {
        console.error('❌ Odoo returned error:', result.error)
        throw new Error(`Authentication failed: ${result.error.message || result.error.data?.message || 'Odoo Server Error'}`)
      }

      if (!result.result) {
        console.error('❌ No result in response:', result)
        throw new Error('Authentication failed: No result returned from Odoo')
      }
      
      if (!result.result.uid) {
        console.error('❌ No UID in result:', result.result)
        throw new Error('Authentication failed: No user ID returned')
      }

      this.userId = result.result.uid
      this.sessionId = result.result.session_id || 'authenticated'
      
      console.log('✅ REST API Authentication successful, User ID:', this.userId)
      
      return {
        success: true,
        userId: this.userId ?? undefined,
        sessionId: this.sessionId ?? undefined
      }
      
    } catch (error) {
      console.error('❌ Odoo REST authentication error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Get the "Qualified" stage ID from CRM pipeline
   */
  private async getQualifiedStageId(): Promise<number | null> {
    try {
      console.log('🎯 Looking for "Qualified" stage using REST API...')
      
      if (!this.userId) {
        throw new Error('Not authenticated')
      }

      const response = await fetch(`${this.credentials.url}/web/dataset/call_kw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'call',
          params: {
            model: 'crm.stage',
            method: 'search_read',
            args: [[['name', '=', 'Qualified']]],
            kwargs: {
              fields: ['id', 'name'],
              limit: 1
            }
          },
          id: Math.floor(Math.random() * 1000000)
        })
      })

      const result = await response.json()
      
      if (result.error) {
        console.error('❌ Error searching for Qualified stage:', result.error)
        console.log('⚠️  Using fallback Qualified stage ID: 2')
        return 2
      }

      if (result.result && result.result.length > 0) {
        const stageId = result.result[0].id
        console.log('✅ Found Qualified stage ID:', stageId, 'Name:', result.result[0].name)
        return stageId
      } else {
        console.log('⚠️  Qualified stage not found, using fallback ID: 2')
        return 2
      }
      
    } catch (error) {
      console.error('❌ Error getting qualified stage ID:', error)
      console.log('⚠️  Using fallback Qualified stage ID: 2')
      return 2
    }
  }

  /**
   * Create lead in Odoo CRM using REST API
   */
  private async createOdooLead(leadData: OdooLeadData): Promise<number> {
    try {
      console.log('💾 Creating lead in Odoo using REST API...')
      console.log('Lead data preview:', {
        name: leadData.name,
        email: leadData.email_from,
        phone: leadData.phone,
        stage_id: leadData.stage_id
      })
      
      if (!this.userId) {
        throw new Error('Not authenticated')
      }

      const response = await fetch(`${this.credentials.url}/web/dataset/call_kw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'call',
          params: {
            model: 'crm.lead',
            method: 'create',
            args: [leadData],
            kwargs: {}
          },
          id: Math.floor(Math.random() * 1000000)
        })
      })

      const result = await response.json()
      
      if (result.error) {
        throw new Error(`Lead creation failed: ${result.error.message}`)
      }

      if (!result.result) {
        throw new Error('Lead creation failed: No ID returned')
      }

      console.log('✅ Lead created successfully in Odoo, ID:', result.result)
      return result.result
      
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

    const leadData: OdooLeadData = {
      name: `${lead.firstName} ${lead.lastName} - Bath Remodeling`,
      partner_name: `${lead.firstName} ${lead.lastName}`,
      email_from: lead.email,
      phone: lead.cellPhone,
      mobile: lead.cellPhone,
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

      console.log('🧪 Testing Odoo REST API connection...')
      
      const authResult = await this.authenticate()
      
      if (!authResult.success) {
        return authResult
      }
      
      console.log('✅ Odoo REST API connection successful')
      return { success: true, userId: authResult.userId }
      
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
      console.log('📝 Creating Odoo lead from booking data using REST API...')
      
      if (!this.credentials.url || !this.credentials.database || !this.credentials.username || !this.credentials.apiKey) {
        throw new Error('Missing Odoo credentials')
      }

      const authResult = await this.authenticate()
      if (!authResult.success) {
        throw new Error(`Authentication failed: ${authResult.error}`)
      }

      const qualifiedStageId = await this.getQualifiedStageId()
      const leadData = this.mapBookingToOdooLead(bookingData, qualifiedStageId || undefined)
      
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
      console.log('📝 Creating direct lead using REST API:', leadData.name)
      
      const authResult = await this.authenticate()
      if (!authResult.success) {
        throw new Error(`Authentication failed: ${authResult.error}`)
      }
      
      const leadId = await this.createOdooLead(leadData)
      
      return leadId
    } catch (error) {
      console.error('❌ Failed to create direct lead:', error)
      throw error
    }
  }
}

export const odooRestService = new OdooRestService()
export type { BookingDataForOdoo }
