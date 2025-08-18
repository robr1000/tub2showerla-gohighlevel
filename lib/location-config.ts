
// Location-specific configuration for multi-domain SEO optimization

export interface LocationData {
  domain: string
  city: string
  citySlug: string
  state: string
  county: string
  zipCodes: string[]
  metaTitle: string
  metaDescription: string
  h1Title: string
  heroSubtitle: string
  serviceAreaDescription: string
  localKeywords: string[]
  businessName: string
  address: string
  phone: string
  coordinates: {
    lat: number
    lng: number
  }
}

export const locationConfigs: Record<string, LocationData> = {
  'tub2showerla.com': {
    domain: 'tub2showerla.com',
    city: 'Los Angeles',
    citySlug: 'los-angeles',
    state: 'California',
    county: 'Los Angeles County',
    zipCodes: ['90001', '90002', '90003', '90004', '90005', '90006', '90007', '90008', '90010', '90011'],
    metaTitle: 'Tub to Shower Conversion Los Angeles | Rob Radosta | True North Kitchen & Bath',
    metaDescription: 'Professional tub to shower conversions in Los Angeles. Expert bathroom remodeling for aging in place. Lifetime warranty, Good Housekeeping Seal approved. Call for free consultation.',
    h1Title: 'Los Angeles Tub to Shower Conversion Experts',
    heroSubtitle: 'Transform your Los Angeles bathroom into a safe, beautiful space perfect for aging in place. Expert tub-to-shower conversions with lifetime warranty.',
    serviceAreaDescription: 'Proudly serving Los Angeles and surrounding communities with professional bathroom remodeling services.',
    localKeywords: ['Los Angeles tub to shower conversion', 'LA bathroom remodeling', 'Los Angeles walk-in showers', 'LA aging in place bathrooms'],
    businessName: 'True North Kitchen & Bath - Los Angeles',
    address: 'Los Angeles, CA',
    phone: '(323) 555-0100',
    coordinates: { lat: 34.0522, lng: -118.2437 }
  },
  'tub2showerhollywood.com': {
    domain: 'tub2showerhollywood.com',
    city: 'Hollywood',
    citySlug: 'hollywood',
    state: 'California',
    county: 'Los Angeles County',
    zipCodes: ['90028', '90038', '90046', '90068', '90069'],
    metaTitle: 'Hollywood Bathroom Remodeling | Tub to Shower Conversion | Rob Radosta',
    metaDescription: 'Expert bathroom remodeling in Hollywood, CA. Professional tub to shower conversions and walk-in tubs. Lifetime warranty and Good Housekeeping Seal approved.',
    h1Title: 'Hollywood Bathroom Remodeling Specialists',
    heroSubtitle: 'Transform your Hollywood bathroom with expert remodeling services. Specializing in safe, accessible designs for aging in place.',
    serviceAreaDescription: 'Serving Hollywood, West Hollywood, and surrounding Los Angeles communities with expert bathroom remodeling.',
    localKeywords: ['Hollywood bathroom remodeling', 'Hollywood tub to shower', 'West Hollywood bathroom renovation', 'Hollywood aging in place'],
    businessName: 'True North Kitchen & Bath - Hollywood',
    address: 'Hollywood, CA',
    phone: '(323) 555-0101',
    coordinates: { lat: 34.0928, lng: -118.3287 }
  },
  'tub2showersantamonica.com': {
    domain: 'tub2showersantamonica.com',
    city: 'Santa Monica',
    citySlug: 'santa-monica',
    state: 'California',
    county: 'Los Angeles County',
    zipCodes: ['90401', '90402', '90403', '90404', '90405'],
    metaTitle: 'Santa Monica Tub to Shower Conversion | Professional Bathroom Remodeling',
    metaDescription: 'Professional tub to shower conversions in Santa Monica, CA. Expert bathroom remodeling for safety and accessibility. Free consultation, lifetime warranty.',
    h1Title: 'Santa Monica Tub to Shower Conversion Experts',
    heroSubtitle: 'Serving Santa Monica with expert tub-to-shower conversions designed for safety and comfort. Perfect for aging in place.',
    serviceAreaDescription: 'Proudly serving Santa Monica, Venice, and the Westside with professional bathroom remodeling services.',
    localKeywords: ['Santa Monica tub to shower', 'Santa Monica bathroom remodeling', 'Westside bathroom renovation', 'Santa Monica aging in place'],
    businessName: 'True North Kitchen & Bath - Santa Monica',
    address: 'Santa Monica, CA',
    phone: '(310) 555-0102',
    coordinates: { lat: 34.0195, lng: -118.4912 }
  },
  'tub2showersantaclarita.com': {
    domain: 'tub2showersantaclarita.com',
    city: 'Santa Clarita',
    citySlug: 'santa-clarita',
    state: 'California',
    county: 'Los Angeles County',
    zipCodes: ['91321', '91350', '91351', '91354', '91355', '91380', '91381', '91382', '91383', '91384', '91385', '91386', '91387'],
    metaTitle: 'Santa Clarita Bathroom Remodeling | Tub to Shower Conversion Experts',
    metaDescription: 'Expert bathroom remodeling in Santa Clarita, CA. Professional tub to shower conversions, walk-in tubs, and aging-in-place solutions. Free consultation.',
    h1Title: 'Santa Clarita Bathroom Remodeling Specialists',
    heroSubtitle: 'Transform your Santa Clarita bathroom with expert remodeling services. Specializing in safe, accessible tub-to-shower conversions.',
    serviceAreaDescription: 'Serving Santa Clarita Valley including Valencia, Newhall, Saugus, and Canyon Country with expert bathroom remodeling.',
    localKeywords: ['Santa Clarita bathroom remodeling', 'Santa Clarita tub to shower', 'Valencia bathroom renovation', 'Santa Clarita aging in place'],
    businessName: 'True North Kitchen & Bath - Santa Clarita',
    address: 'Santa Clarita, CA',
    phone: '(661) 555-0103',
    coordinates: { lat: 34.3917, lng: -118.5426 }
  },
  'tub2showerlongbeach.com': {
    domain: 'tub2showerlongbeach.com',
    city: 'Long Beach',
    citySlug: 'long-beach',
    state: 'California',
    county: 'Los Angeles County',
    zipCodes: ['90801', '90802', '90803', '90804', '90805', '90806', '90807', '90808', '90810', '90813', '90814', '90815'],
    metaTitle: 'Long Beach Tub to Shower Conversion | Professional Bathroom Remodeling',
    metaDescription: 'Professional tub to shower conversions in Long Beach, CA. Expert bathroom remodeling for safety and accessibility. Lifetime warranty, free consultation.',
    h1Title: 'Long Beach Tub to Shower Conversion Experts',
    heroSubtitle: 'Serving Long Beach with expert tub-to-shower conversions and bathroom remodeling. Safe, accessible designs for aging in place.',
    serviceAreaDescription: 'Proudly serving Long Beach, Lakewood, Signal Hill, and South Bay communities with professional bathroom remodeling.',
    localKeywords: ['Long Beach tub to shower', 'Long Beach bathroom remodeling', 'South Bay bathroom renovation', 'Long Beach aging in place'],
    businessName: 'True North Kitchen & Bath - Long Beach',
    address: 'Long Beach, CA',
    phone: '(562) 555-0104',
    coordinates: { lat: 33.7701, lng: -118.1937 }
  }
}

// Default fallback configuration for development/unknown domains
export const defaultLocationConfig: LocationData = {
  domain: 'localhost',
  city: 'Los Angeles',
  citySlug: 'los-angeles',
  state: 'California',
  county: 'Los Angeles County',
  zipCodes: ['90001'],
  metaTitle: 'Rob Radosta - Bath Safety & Design Consultant | True North Kitchen & Bath',
  metaDescription: 'Transform your bathroom into a safe, beautiful space perfect for aging in place. Expert tub-to-shower conversions and walk-in tubs in Los Angeles County. Lifetime warranty and Good Housekeeping Seal approved.',
  h1Title: 'Transform Your Bathroom Into a Safe, Beautiful Space',
  heroSubtitle: 'Expert tub-to-shower conversions designed for aging in place. Serving Los Angeles County with a fully transferable lifetime labor & materials warranty.',
  serviceAreaDescription: 'Proudly serving Los Angeles County with professional bathroom remodeling services.',
  localKeywords: ['bathroom remodeling', 'tub to shower conversion', 'walk-in tubs', 'aging in place', 'Los Angeles', 'bathroom safety'],
  businessName: 'True North Kitchen & Bath',
  address: 'Los Angeles County, CA',
  phone: '(323) 555-0100',
  coordinates: { lat: 34.0522, lng: -118.2437 }
}

// Function to get location data based on domain
export function getLocationData(domain?: string): LocationData {
  if (!domain) {
    return defaultLocationConfig
  }
  
  // Handle localhost and development domains
  if (domain.includes('localhost') || domain.includes('127.0.0.1') || domain.includes('vercel.app')) {
    return defaultLocationConfig
  }
  
  // Return location-specific config or default
  return locationConfigs[domain] || defaultLocationConfig
}

// Function to get all domains for sitemap generation
export function getAllDomains(): string[] {
  return Object.keys(locationConfigs)
}

// Function to get location data from headers (for API routes)
export function getLocationFromHeaders(headers: Headers): LocationData {
  const host = headers.get('host')
  return getLocationData(host || undefined)
}
