
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testing direct Odoo connection with JSON-RPC...')
    
    // Rob's verified working credentials
    const credentials = {
      url: 'https://true-north-kitchen-bath-robr100.odoo.com',
      database: 'true-north-kitchen-bath-robr100',
      username: 'rradosta1@gmail.com',
      apiKey: 'c1dbb5fb00bfe7cab61547fb5794d6135f792aa6',
      userId: 2,
      qualifiedStageId: 2
    }
    
    // Try JSON-RPC approach (different from XML-RPC)
    const response = await fetch(`${credentials.url}/jsonrpc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'call',
        params: {
          service: 'object',
          method: 'execute_kw',
          args: [
            credentials.database,
            credentials.userId,
            credentials.apiKey,
            'crm.lead',
            'create',
            [{
              name: 'Direct Test Lead - ' + new Date().toISOString(),
              partner_name: 'Test Customer Direct',
              email_from: 'test-direct@example.com',
              phone: '(555) 123-4567',
              street: '123 Direct Test Street, Los Angeles, CA',
              description: 'Test lead created by direct JSON-RPC test',
              stage_id: credentials.qualifiedStageId
            }]
          ]
        },
        id: Math.floor(Math.random() * 1000000)
      })
    })

    if (!response.ok) {
      return NextResponse.json({
        success: false,
        error: `HTTP ${response.status}: ${response.statusText}`,
        step: 'http_request'
      }, { status: 500 })
    }

    const result = await response.json()
    console.log('📨 Response received:', JSON.stringify(result, null, 2))
    
    if (result.error) {
      console.error('❌ Odoo returned error:', result.error)
      return NextResponse.json({
        success: false,
        error: 'Odoo API error',
        details: result.error,
        step: 'odoo_api'
      }, { status: 500 })
    }

    if (result.result) {
      console.log('✅ SUCCESS! Lead created with ID:', result.result)
      return NextResponse.json({
        success: true,
        message: 'Direct Odoo connection successful',
        leadId: result.result,
        leadName: 'Direct Test Lead - ' + new Date().toISOString()
      })
    }

    return NextResponse.json({
      success: false,
      error: 'No result returned from Odoo',
      details: result,
      step: 'result_parsing'
    }, { status: 500 })
    
  } catch (error) {
    console.error('❌ Direct test failed:', error)
    return NextResponse.json({
      success: false,
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      step: 'exception'
    }, { status: 500 })
  }
}
