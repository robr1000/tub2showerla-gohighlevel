
import { NextRequest, NextResponse } from 'next/server'
import { odooRestService } from '@/lib/odoo-rest-service'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Starting Odoo REST API connection test...')
    
    // Test connection
    const connectionResult = await odooRestService.testConnection()
    
    if (!connectionResult.success) {
      return NextResponse.json({
        success: false,
        error: 'REST API Connection failed',
        details: connectionResult.error,
        step: 'connection'
      }, { status: 500 })
    }
    
    console.log('✅ REST API Connection successful, testing lead creation...')
    
    // Test lead creation
    const testLeadData = {
      name: 'REST API Test Lead - ' + new Date().toISOString(),
      partner_name: 'Test Customer REST',
      email_from: 'test-rest@example.com',
      phone: '(555) 123-4567',
      mobile: '(555) 123-4567',
      street: '123 Test Street, Los Angeles, CA',
      description: 'Test lead created by REST API test endpoint',
      stage_id: 2 // Qualified stage
    }
    
    const leadId = await odooRestService.createLead(testLeadData)
    
    return NextResponse.json({
      success: true,
      message: 'Odoo REST API connection and lead creation successful',
      connectionResult,
      testLead: {
        id: leadId,
        name: testLeadData.name
      }
    })
    
  } catch (error) {
    console.error('❌ Odoo REST API test failed:', error)
    return NextResponse.json({
      success: false,
      error: 'REST API Test failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      step: 'lead_creation'
    }, { status: 500 })
  }
}
