
import { google } from 'googleapis'
import { prisma } from '@/lib/db'

interface CalendarEvent {
  title: string
  description: string
  startDateTime: string
  endDateTime: string
  attendeeEmail: string
  attendeeName: string
}

export class GoogleCalendarService {
  private oauth2Client: any

  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    )
  }

  getAuthUrl() {
    const scopes = [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events'
    ]

    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent'
    })
  }

  async exchangeCodeForTokens(code: string) {
    try {
      const { tokens } = await this.oauth2Client.getAccessToken(code)
      return tokens
    } catch (error) {
      console.error('Error exchanging code for tokens:', error)
      throw error
    }
  }

  async refreshTokens(refreshToken: string) {
    try {
      this.oauth2Client.setCredentials({
        refresh_token: refreshToken
      })
      
      const { credentials } = await this.oauth2Client.refreshAccessToken()
      return credentials
    } catch (error) {
      console.error('Error refreshing tokens:', error)
      throw error
    }
  }

  async setCredentials(userId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      })

      if (!user?.googleAccessToken) {
        throw new Error('User does not have Google Calendar access')
      }

      // Check if token is expired
      if (user.googleTokenExpiry && user.googleTokenExpiry < new Date()) {
        if (!user.googleRefreshToken) {
          throw new Error('Google token expired and no refresh token available')
        }

        // Refresh the token
        const newTokens = await this.refreshTokens(user.googleRefreshToken)
        
        // Update user with new tokens
        await prisma.user.update({
          where: { id: userId },
          data: {
            googleAccessToken: newTokens.access_token,
            googleTokenExpiry: new Date(newTokens.expiry_date || Date.now() + 3600000)
          }
        })

        this.oauth2Client.setCredentials({
          access_token: newTokens.access_token,
          refresh_token: user.googleRefreshToken
        })
      } else {
        this.oauth2Client.setCredentials({
          access_token: user.googleAccessToken,
          refresh_token: user.googleRefreshToken
        })
      }

      return true
    } catch (error) {
      console.error('Error setting credentials:', error)
      throw error
    }
  }

  async createEvent(userId: string, eventData: CalendarEvent): Promise<string> {
    try {
      await this.setCredentials(userId)

      const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client })
      
      const user = await prisma.user.findUnique({
        where: { id: userId }
      })

      const calendarId = user?.calendarId || 'primary'

      const event = {
        summary: eventData.title,
        description: eventData.description,
        start: {
          dateTime: eventData.startDateTime,
          timeZone: 'America/Los_Angeles',
        },
        end: {
          dateTime: eventData.endDateTime,
          timeZone: 'America/Los_Angeles',
        },
        attendees: [
          {
            email: eventData.attendeeEmail,
            displayName: eventData.attendeeName,
            responseStatus: 'needsAction'
          }
        ],
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 }, // 24 hours before
            { method: 'popup', minutes: 60 }, // 1 hour before
          ],
        },
        conferenceData: {
          createRequest: {
            requestId: `consultation-${Date.now()}`,
            conferenceSolutionKey: {
              type: 'hangoutsMeet'
            }
          }
        }
      }

      const response = await calendar.events.insert({
        calendarId,
        requestBody: event,
        conferenceDataVersion: 1,
        sendUpdates: 'all'
      })

      return response.data.id || ''
    } catch (error) {
      console.error('Error creating calendar event:', error)
      throw error
    }
  }

  async updateEvent(userId: string, eventId: string, eventData: Partial<CalendarEvent>): Promise<void> {
    try {
      await this.setCredentials(userId)

      const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client })
      
      const user = await prisma.user.findUnique({
        where: { id: userId }
      })

      const calendarId = user?.calendarId || 'primary'

      const updateData: any = {}
      
      if (eventData.title) updateData.summary = eventData.title
      if (eventData.description) updateData.description = eventData.description
      if (eventData.startDateTime) {
        updateData.start = {
          dateTime: eventData.startDateTime,
          timeZone: 'America/Los_Angeles',
        }
      }
      if (eventData.endDateTime) {
        updateData.end = {
          dateTime: eventData.endDateTime,
          timeZone: 'America/Los_Angeles',
        }
      }

      await calendar.events.update({
        calendarId,
        eventId,
        requestBody: updateData,
        sendUpdates: 'all'
      })
    } catch (error) {
      console.error('Error updating calendar event:', error)
      throw error
    }
  }

  async deleteEvent(userId: string, eventId: string): Promise<void> {
    try {
      await this.setCredentials(userId)

      const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client })
      
      const user = await prisma.user.findUnique({
        where: { id: userId }
      })

      const calendarId = user?.calendarId || 'primary'

      await calendar.events.delete({
        calendarId,
        eventId,
        sendUpdates: 'all'
      })
    } catch (error) {
      console.error('Error deleting calendar event:', error)
      throw error
    }
  }

  async getAvailableSlots(userId: string, date: Date): Promise<string[]> {
    try {
      await this.setCredentials(userId)

      const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client })
      
      const user = await prisma.user.findUnique({
        where: { id: userId }
      })

      const calendarId = user?.calendarId || 'primary'

      // Get Rob's specific schedule based on day of week
      const dayOfWeek = date.getDay() // 0 = Sunday, 1 = Monday, etc.
      
      let availableSlots: string[] = []
      
      switch (dayOfWeek) {
        case 1: // Monday
          availableSlots = ['10:00', '14:00', '18:00'] // 10 AM, 2 PM, 6 PM
          break
        case 2: // Tuesday
          availableSlots = ['10:00'] // 10 AM only
          break
        case 3: // Wednesday
          availableSlots = ['18:00'] // 6 PM only
          break
        case 4: // Thursday
          availableSlots = ['10:00'] // 10 AM only
          break
        case 5: // Friday
          availableSlots = ['18:00'] // 6 PM only
          break
        case 6: // Saturday
          availableSlots = ['18:00'] // 6 PM only
          break
        case 0: // Sunday
        default:
          availableSlots = [] // No availability
          break
      }

      // Check for existing events on this date
      const startOfDay = new Date(date)
      startOfDay.setHours(0, 0, 0, 0)
      
      const endOfDay = new Date(date)
      endOfDay.setHours(23, 59, 59, 999)

      const response = await calendar.events.list({
        calendarId,
        timeMin: startOfDay.toISOString(),
        timeMax: endOfDay.toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
      })

      const existingEvents = response.data.items || []
      
      // Filter out booked slots
      const bookedTimes = existingEvents.map((event: any) => {
        if (event.start?.dateTime) {
          const eventStart = new Date(event.start.dateTime)
          return `${eventStart.getHours().toString().padStart(2, '0')}:${eventStart.getMinutes().toString().padStart(2, '0')}`
        }
        return null
      }).filter(Boolean)

      const availableSlotTimes = availableSlots.filter(slot => !bookedTimes.includes(slot))
      
      return availableSlotTimes
    } catch (error) {
      console.error('Error getting available slots:', error)
      return []
    }
  }
}

export const googleCalendarService = new GoogleCalendarService()
