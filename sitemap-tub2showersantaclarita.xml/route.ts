
import { NextResponse } from 'next/server'
import { locationConfigs } from '@/lib/location-config'

export const dynamic = 'force-dynamic'

export async function GET() {
  const locationData = locationConfigs['tub2showersantaclarita.com']
  const baseUrl = `https://${locationData.domain}`
  const currentDate = new Date().toISOString().split('T')[0]
  
  const pages = [
    { url: '', priority: '1.0', changefreq: 'weekly' },
    { url: '/services', priority: '0.8', changefreq: 'monthly' },
    { url: '/services/tub-to-shower-conversion', priority: '0.9', changefreq: 'monthly' },
    { url: '/services/walk-in-tubs', priority: '0.9', changefreq: 'monthly' },
    { url: '/about', priority: '0.7', changefreq: 'monthly' },
    { url: '/contact', priority: '0.8', changefreq: 'monthly' },
    { url: '/gallery', priority: '0.6', changefreq: 'weekly' },
    { url: '/testimonials', priority: '0.6', changefreq: 'weekly' },
    { url: '/financing', priority: '0.7', changefreq: 'monthly' },
    { url: '/service-areas', priority: '0.8', changefreq: 'monthly' },
    { url: `/service-areas/${locationData.citySlug}`, priority: '0.9', changefreq: 'monthly' },
    { url: `/service-areas/${locationData.citySlug}/tub-to-shower-conversion`, priority: '0.8', changefreq: 'monthly' },
    { url: `/service-areas/${locationData.citySlug}/walk-in-tubs`, priority: '0.8', changefreq: 'monthly' }
  ]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600'
    }
  })
}
