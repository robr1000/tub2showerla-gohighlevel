
export interface Lead {
  id: string
  firstName: string
  lastName: string
  email: string
  cellPhone: string
  address: string
  ownOrRent: string
  availableForConsult: boolean
  decisionMakersAvail: boolean
  renovateElsewhere: boolean
  renovateElsewhereDetails?: string | null
  status: string
  notes?: string | null
  createdAt: Date
  updatedAt: Date
  bookings?: Booking[]
}

export interface Booking {
  id: string
  leadId: string
  googleEventId?: string | null
  scheduledAt: Date
  duration: number
  status: string
  notes?: string | null
  createdAt: Date
  updatedAt: Date
  lead?: Lead
}

export interface FormData {
  firstName: string
  lastName: string
  email: string
  cellPhone: string
  address: string
  ownOrRent: string
  availableForConsult: boolean
  decisionMakersAvail: boolean
  renovateElsewhere: boolean
  renovateElsewhereDetails?: string
}
