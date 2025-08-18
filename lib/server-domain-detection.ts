
import { headers } from 'next/headers'
import { getLocationData, type LocationData } from './location-config'

// Server-side domain detection for App Router
export async function getServerLocationData(): Promise<LocationData> {
  const headersList = headers()
  const host = headersList.get('host')
  return getLocationData(host || undefined)
}
