
import { NextRequest, NextResponse } from 'next/server'
import { gohighlevelService } from '@/lib/gohighlevel-service'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const result = await gohighlevelService.testConnection()
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
        data: result.data,
        timestamp: new Date().toISOString()
      })
    } else {
      return NextResponse.json({
        success: false,
        message: result.message,
        timestamp: new Date().toISOString()
      }, { status: 400 })
    }
  } catch (error) {
    console.error('GoHighLevel test error:', error)
    return NextResponse.json({
      success: false,
      message: 'Test failed with exception',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Test creating a sample lead
    const result = await gohighlevelService.createLead({
      firstName: 'Test',
      lastName: 'Lead',
      email: 'test@example.com',
      phone: '555-123-4567',
      projectType: 'Bathroom Remodeling',
      timeframe: '1-3 months',
      budget: '$10,000 - $20,000',
      additionalNotes: 'This is a test lead from the API test endpoint',
      source: 'API Test'
    })
    
    return NextResponse.json({
      success: result.success,
      message: result.message,
      data: result.success ? {
        contactId: result.contactId,
        opportunityId: result.opportunityId
      } : { error: result.error },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('GoHighLevel test lead creation error:', error)
    return NextResponse.json({
      success: false,
      message: 'Test lead creation failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
