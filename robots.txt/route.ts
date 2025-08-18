
import { NextRequest, NextResponse } from 'next/server'
import { getLocationFromHeaders, locationConfigs } from '@/lib/location-config'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Try to get location from headers with fallback handling
    let locationData = getLocationFromHeaders(request.headers)
    
    // Additional fallback: check other headers if we got localhost
    if (locationData.domain === 'localhost' || !locationData.domain) {
      const referer = request.headers.get('referer')
      const origin = request.headers.get('origin')
      const xForwardedHost = request.headers.get('x-forwarded-host')
      
      let detectedDomain = null
      
      if (xForwardedHost && Object.keys(locationConfigs).includes(xForwardedHost)) {
        detectedDomain = xForwardedHost
      } else if (referer) {
        try {
          const refererUrl = new URL(referer)
          if (Object.keys(locationConfigs).includes(refererUrl.hostname)) {
            detectedDomain = refererUrl.hostname
          }
        } catch (e) {
          // Invalid referer URL, ignore
        }
      } else if (origin) {
        try {
          const originUrl = new URL(origin)
          if (Object.keys(locationConfigs).includes(originUrl.hostname)) {
            detectedDomain = originUrl.hostname
          }
        } catch (e) {
          // Invalid origin URL, ignore
        }
      }
      
      if (detectedDomain) {
        locationData = locationConfigs[detectedDomain]
      } else {
        // Final fallback: use tub2showerla.com as the default instead of localhost
        locationData = locationConfigs['tub2showerla.com']
      }
    }
    
    const baseUrl = `https://${locationData.domain}`
    
    const robotsTxt = `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml
Sitemap: ${baseUrl}/sitemap-index.xml

# Prevent indexing of admin and API routes
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /server.log

# Allow crawling of all content pages
Allow: /
Allow: /services/
Allow: /about
Allow: /contact
Allow: /gallery
Allow: /testimonials
Allow: /financing
Allow: /service-areas/

# Crawl delay (optional - helps prevent server overload)
Crawl-delay: 1`

    return new NextResponse(robotsTxt, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600'
      }
    })
  } catch (error) {
    console.error('Error generating robots.txt:', error)
    
    // Return basic robots.txt on error
    const fallbackRobots = `User-agent: *
Allow: /

Sitemap: https://tub2showerla.com/sitemap.xml

Disallow: /admin/
Disallow: /api/
Disallow: /_next/`
    
    return new NextResponse(fallbackRobots, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=300, s-maxage=300'
      }
    })
  }
}
