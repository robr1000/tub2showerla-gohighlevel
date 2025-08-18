
'use client'

import { getLocationData, type LocationData, defaultLocationConfig } from './location-config'

// Client-side domain detection hook
export function useLocationData(): LocationData {
  if (typeof window !== 'undefined') {
    return getLocationData(window.location.hostname)
  }
  // Fallback for SSR - return default config
  return defaultLocationConfig
}
