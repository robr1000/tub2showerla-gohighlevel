
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { getServerLocationData } from '@/lib/server-domain-detection'

const inter = Inter({ subsets: ['latin'] })

// Generate dynamic metadata based on domain
export async function generateMetadata(): Promise<Metadata> {
  const locationData = await getServerLocationData()
  
  return {
    title: locationData.metaTitle,
    description: locationData.metaDescription,
    keywords: locationData.localKeywords.join(', '),
    robots: 'index, follow',
    openGraph: {
      title: locationData.metaTitle,
      description: locationData.metaDescription,
      type: 'website',
      locale: 'en_US',
      siteName: locationData.businessName,
    },
    twitter: {
      card: 'summary_large_image',
      title: locationData.metaTitle,
      description: locationData.metaDescription,
    },
    alternates: {
      canonical: `https://${locationData.domain}`,
    },
    other: {
      'google-site-verification': 'kvDZziDFrHnVFomeQ3NhHpi95dhfhnBgtUgY3_kDWNk',
    },
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      ],
      apple: [
        { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      ],
      other: [
        {
          rel: 'icon',
          url: '/android-chrome-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
      ],
    },
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
