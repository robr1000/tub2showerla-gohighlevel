
import { NextRequest, NextResponse } from 'next/server'
import { odooService } from '@/lib/odoo-service'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    console.log('🧪 Testing Odoo connection via API endpoint...')
    
    const result = await odooService.testConnection()
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Odoo connection successful',
        userId: result.userId,
        timestamp: new Date().toISOString()
      })
    } else {
      return NextResponse.json({
        success: false,
        error: result.error,
        timestamp: new Date().toISOString()
      }, { status: 500 })
    }
  } catch (error) {
    console.error('❌ Odoo test endpoint error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
