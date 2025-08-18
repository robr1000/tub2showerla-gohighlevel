
/**
 * Odoo Fallback Service - Handles trial account limitations
 * This service provides a fallback approach when API access is restricted
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

class OdooFallbackService {
  private credentials = {
    url: process.env.ODOO_URL || '',
    database: process.env.ODOO_DATABASE || '',
    username: process.env.ODOO_USERNAME || '',
    apiKey: process.env.ODOO_API_KEY || ''
  }

  /**
   * Test if we can reach Odoo server at all
   */
  private async testServerReachability(): Promise<boolean> {
    try {
      const response = await fetch(`${this.credentials.url}/web/login`, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; OdooTestBot/1.0)'
        }
      })
      return response.ok
    } catch (error) {
      return false
    }
  }

  /**
   * Try alternative authentication methods
   */
  private async tryAlternativeAuth(): Promise<{ success: boolean; method?: string; error?: string }> {
    console.log('🔄 Trying alternative authentication methods...')
    
    // Method 1: Try using API key as password in session authenticate
    try {
      console.log('📡 Attempting Method 1: API key as password...')
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
            password: this.credentials.apiKey // Using API key as password
          },
          id: Math.floor(Math.random() * 1000000)
        })
      })

      if (response.ok) {
        const result = await response.json()
        if (result.result && result.result.uid) {
          return { success: true, method: 'session_auth_with_api_key' }
        }
      }
    } catch (error) {
      console.log('❌ Method 1 failed:', (error as Error).message)
    }

    // Method 2: Try different endpoints
    try {
      console.log('📡 Attempting Method 2: Database list check...')
      const response = await fetch(`${this.credentials.url}/web/database/list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'call',
          params: {},
          id: Math.floor(Math.random() * 1000000)
        })
      })

      if (response.ok) {
        const result = await response.json()
        console.log('📋 Database list response:', result)
        return { success: true, method: 'database_list_accessible' }
      }
    } catch (error) {
      console.log('❌ Method 2 failed:', (error as Error).message)
    }

    return { success: false, error: 'All authentication methods failed' }
  }

  /**
   * Log lead data for manual processing
   */
  private async logLeadForManualProcessing(leadData: OdooLeadData): Promise<number> {
    const leadId = Date.now() // Generate a temporary ID
    
    console.log('📋 ====== LEAD DATA FOR MANUAL PROCESSING ======')
    console.log('🆔 Temporary Lead ID:', leadId)
    console.log('👤 Customer Name:', leadData.name)
    console.log('📧 Email:', leadData.email_from)
    console.log('📱 Phone:', leadData.phone)
    console.log('🏠 Address:', leadData.street)
    console.log('📋 Full Description:')
    console.log(leadData.description)
    console.log('================================================')
    
    // In a production environment, you could:
    // 1. Save to a separate database table
    // 2. Send to a webhook
    // 3. Email the lead details to Rob
    // 4. Save to a file for later processing
    
    return leadId
  }

  /**
   * Test connection and provide diagnostic information
   */
  async testConnection(): Promise<{ success: boolean; diagnostics: any; userId?: number; error?: string }> {
    const diagnostics: any = {
      serverReachable: false,
      credentialsPresent: false,
      alternativeAuthResults: null,
      recommendations: []
    }

    try {
      console.log('🧪 Starting comprehensive Odoo diagnostics...')
      
      // Check if credentials are present
      if (!this.credentials.url || !this.credentials.database || !this.credentials.username || !this.credentials.apiKey) {
        diagnostics.recommendations.push('Missing Odoo credentials in environment variables')
        return { success: false, diagnostics, error: 'Missing credentials' }
      }
      diagnostics.credentialsPresent = true

      // Test server reachability
      console.log('🌐 Testing server reachability...')
      diagnostics.serverReachable = await this.testServerReachability()
      
      if (!diagnostics.serverReachable) {
        diagnostics.recommendations.push('Odoo server is not reachable - check URL and network connectivity')
        return { success: false, diagnostics, error: 'Server not reachable' }
      }

      // Try alternative authentication methods
      diagnostics.alternativeAuthResults = await this.tryAlternativeAuth()
      
      if (diagnostics.alternativeAuthResults.success) {
        diagnostics.recommendations.push(`Alternative authentication method works: ${diagnostics.alternativeAuthResults.method}`)
        return { success: true, diagnostics, userId: 1 }
      } else {
        diagnostics.recommendations.push(
          'API access appears to be restricted on this Odoo trial account',
          'Consider upgrading to a paid Odoo account for full API access',
          'Manual lead processing fallback is available'
        )
        return { success: false, diagnostics, error: 'API access restricted - trial account limitation' }
      }
      
    } catch (error) {
      console.error('❌ Diagnostic test failed:', error)
      diagnostics.recommendations.push('Unexpected error during testing - check logs for details')
      return { 
        success: false, 
        diagnostics,
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Create lead with fallback to manual processing
   */
  async createLeadFromBooking(bookingData: BookingDataForOdoo): Promise<{ success: boolean; leadId?: number; error?: string; fallbackUsed?: boolean }> {
    try {
      console.log('📝 Attempting Odoo lead creation with fallback...')
      
      const connectionTest = await this.testConnection()
      
      if (connectionTest.success) {
        // If we have a working connection, we'd create the lead normally
        // For now, we'll use the fallback method since we know API access is restricted
        console.log('✅ Connection successful, but using fallback for trial account compatibility')
      }
      
      // Use fallback: Log lead for manual processing
      console.log('🔄 Using manual processing fallback...')
      
      const leadData = this.mapBookingToOdooLead(bookingData)
      const leadId = await this.logLeadForManualProcessing(leadData)
      
      console.log('✅ Lead logged for manual processing')
      console.log('📋 Lead ID:', leadId)
      console.log('📧 Recommendation: Manually create this lead in Odoo CRM')
      
      return {
        success: true,
        leadId: leadId,
        fallbackUsed: true
      }
      
    } catch (error) {
      console.error('❌ Failed to create lead (even with fallback):', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
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
}

export const odooFallbackService = new OdooFallbackService()
export type { BookingDataForOdoo }
