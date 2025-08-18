
import { NextRequest, NextResponse } from 'next/server'
import { getLocationFromHeaders, locationConfigs, defaultLocationConfig } from '@/lib/location-config'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Try to get location from headers
    let locationData = getLocationFromHeaders(request.headers)
    
    // Additional fallback: check if we got a valid domain
    if (locationData.domain === 'localhost' || !locationData.domain) {
      // Try to extract domain from referrer or other headers
      const referer = request.headers.get('referer')
      const origin = request.headers.get('origin')
      const xForwardedHost = request.headers.get('x-forwarded-host')
      
      let detectedDomain = null
      
      if (xForwardedHost && Object.keys(locationConfigs).includes(xForwardedHost)) {
        detectedDomain = xForwardedHost
      } else if (referer) {
        const refererUrl = new URL(referer)
        if (Object.keys(locationConfigs).includes(refererUrl.hostname)) {
          detectedDomain = refererUrl.hostname
        }
      } else if (origin) {
        const originUrl = new URL(origin)
        if (Object.keys(locationConfigs).includes(originUrl.hostname)) {
          detectedDomain = originUrl.hostname
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
    
    // Get current date for lastmod
    const currentDate = new Date().toISOString().split('T')[0]
    
    // Define all pages with their priorities and change frequencies
    const pages = [
      {
        url: '',
        lastmod: currentDate,
        changefreq: 'weekly',
        priority: '1.0'
      },
      {
        url: '/services',
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: '0.8'
      },
      {
        url: '/services/tub-to-shower-conversion',
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: '0.9'
      },
      {
        url: '/services/walk-in-tubs',
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: '0.9'
      },
      {
        url: '/about',
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: '0.7'
      },
      {
        url: '/contact',
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: '0.8'
      },
      {
        url: '/gallery',
        lastmod: currentDate,
        changefreq: 'weekly',
        priority: '0.6'
      },
      {
        url: '/testimonials',
        lastmod: currentDate,
        changefreq: 'weekly',
        priority: '0.6'
      },
      {
        url: '/financing',
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: '0.7'
      },
      {
        url: '/service-areas',
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: '0.8'
      }
    ]

    // Generate location-specific service area pages
    const locationPages = [
      {
        url: `/service-areas/${locationData.citySlug}`,
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: '0.9'
      },
      {
        url: `/service-areas/${locationData.citySlug}/tub-to-shower-conversion`,
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: '0.8'
      },
      {
        url: `/service-areas/${locationData.citySlug}/walk-in-tubs`,
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: '0.8'
      }
    ]

    const allPages = [...pages, ...locationPages]

    // Generate XML sitemap with proper escaping
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        'X-Robots-Tag': 'noindex' // Prevent indexing of sitemap itself
      }
    })
  } catch (error) {
    console.error('Error generating sitemap:', error)
    
    // Return a basic sitemap with default configuration if there's an error
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://tub2showerla.com</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`
    
    return new NextResponse(fallbackSitemap, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=300, s-maxage=300' // Shorter cache for fallback
      }
    })
  }
}
