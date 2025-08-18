
import { NextRequest, NextResponse } from 'next/server'
import { getAllDomains, getLocationFromHeaders } from '@/lib/location-config'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const locationData = getLocationFromHeaders(request.headers)
    const baseUrl = `https://${locationData.domain}`
    
    // Get current date for lastmod
    const currentDate = new Date().toISOString().split('T')[0]
    
    // Get all domains for sitemap index
    const allDomains = getAllDomains()
    
    // Generate sitemap index XML
    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allDomains.map(domain => `  <sitemap>
    <loc>https://${domain}/sitemap.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`

    return new NextResponse(sitemapIndex, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600'
      }
    })
  } catch (error) {
    console.error('Error generating sitemap index:', error)
    
    // Return minimal sitemap index on error
    const fallbackIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://tub2showerla.com/sitemap.xml</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>
</sitemapindex>`
    
    return new NextResponse(fallbackIndex, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=300, s-maxage=300'
      }
    })
  }
}
