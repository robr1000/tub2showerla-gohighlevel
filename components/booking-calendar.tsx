
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Clock, CheckCircle, ArrowLeft, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'

interface BookingCalendarProps {
  leadId: string
  onBack: () => void
}

interface AvailableSlots {
  availableSlots: string[]
  allSlots: string[]
  validSlots: string[]
  bookedSlots: string[]
  withinFortyEightHours: string[]
  fortyEightHourCutoff: string
  existingBookings: { time: string; customerName: string }[]
}

export function BookingCalendar({ leadId, onBack }: BookingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [isBooked, setIsBooked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [availableSlots, setAvailableSlots] = useState<AvailableSlots | null>(null)
  const [isLoadingSlots, setIsLoadingSlots] = useState(false)
  const [slotsError, setSlotsError] = useState<string | null>(null)

  // Fetch available slots when date is selected
  useEffect(() => {
    if (!selectedDate) {
      setAvailableSlots(null)
      setSelectedTime('')
      return
    }

    const fetchAvailableSlots = async () => {
      setIsLoadingSlots(true)
      setSlotsError(null)
      setSelectedTime('') // Reset selected time when date changes

      try {
        const response = await fetch(`/api/bookings/available-slots?date=${encodeURIComponent(selectedDate)}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch available slots')
        }

        const data = await response.json()
        setAvailableSlots(data)
      } catch (error) {
        console.error('Error fetching available slots:', error)
        setSlotsError('Failed to load available time slots. Please try again.')
      } finally {
        setIsLoadingSlots(false)
      }
    }

    fetchAvailableSlots()
  }, [selectedDate])

  // Generate available dates (respecting 48-hour minimum booking window)
  const getAvailableDates = () => {
    const dates = []
    const now = new Date()
    const fortyEightHoursFromNow = new Date(now.getTime() + (48 * 60 * 60 * 1000))
    
    // Start from the day that's at least 48 hours away
    let currentDate = new Date(fortyEightHoursFromNow)
    currentDate.setHours(0, 0, 0, 0) // Reset to start of day
    
    // If the 48-hour point is still on the same day, move to next day
    const fortyEightHourDay = new Date(fortyEightHoursFromNow)
    fortyEightHourDay.setHours(0, 0, 0, 0)
    if (fortyEightHourDay.getTime() === currentDate.getTime()) {
      currentDate.setDate(currentDate.getDate() + 1)
    }

    while (dates.length < 15) {
      const dayOfWeek = currentDate.getDay()
      // Only include days where Rob has availability (Monday-Saturday, excluding Sunday)
      if (dayOfWeek !== 0) { // Skip Sunday (0)
        dates.push(new Date(currentDate))
      }
      currentDate.setDate(currentDate.getDate() + 1)
    }

    return dates
  }



  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) return

    setIsLoading(true)

    try {
      const scheduledDateTime = new Date(`${selectedDate} ${selectedTime}`)
      
      // First create the Google Calendar event
      const calendarResponse = await fetch('/api/calendar/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          leadId,
          scheduledAt: scheduledDateTime.toISOString(),
          duration: 90
        }),
      })

      let googleEventId = null
      if (calendarResponse.ok) {
        const calendarResult = await calendarResponse.json()
        googleEventId = calendarResult.eventId
        console.log('✅ Google Calendar event created:', googleEventId)
      } else {
        console.warn('⚠️ Google Calendar event creation failed, proceeding with database booking only')
      }
      
      // Create the booking in database
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          leadId,
          scheduledAt: scheduledDateTime.toISOString(),
          googleEventId,
          notes: `Scheduled via online booking system for ${selectedDate} at ${selectedTime}`
        }),
      })

      if (response.ok) {
        setIsBooked(true)
      } else {
        const errorData = await response.json()
        console.error('Booking failed:', errorData.error)
        
        if (response.status === 409) {
          // Conflict error - time slot already booked
          alert(`${errorData.message}\n\nPlease select a different time slot.`)
          // Refresh available slots to show updated availability
          const slotsResponse = await fetch(`/api/bookings/available-slots?date=${encodeURIComponent(selectedDate)}`)
          if (slotsResponse.ok) {
            const updatedSlots = await slotsResponse.json()
            setAvailableSlots(updatedSlots)
            setSelectedTime('') // Reset selected time
          }
        } else {
          alert('Booking failed. Please try again or contact us directly.')
        }
      }
    } catch (error) {
      console.error('Booking error:', error)
      alert('An error occurred while booking. Please try again or contact us directly.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isBooked) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 bg-green-100 rounded-full p-3 w-16 h-16 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-800">
              Consultation Scheduled!
            </CardTitle>
            <CardDescription className="text-green-700 text-lg">
              Your appointment has been confirmed for {selectedDate} at {selectedTime}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Appointment Details:</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">{selectedDate}</p>
                    <p className="text-gray-600 text-sm">Date confirmed</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">{selectedTime}</p>
                    <p className="text-gray-600 text-sm">90-minute consultation</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">What to Expect:</h4>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• Rob will arrive promptly at your scheduled time</li>
                <li>• Comprehensive assessment of your current bathroom</li>
                <li>• Discussion of your needs and safety concerns</li>
                <li>• Custom design recommendations</li>
                <li>• Detailed quote with financing options</li>
              </ul>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-yellow-800 text-sm">
                <strong>Confirmation:</strong> You'll receive a confirmation email and Rob will call you 
                24 hours before your appointment to confirm details.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="max-w-4xl mx-auto"
    >
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <CardTitle className="text-2xl text-gray-900">
                Schedule Your Consultation
              </CardTitle>
              <CardDescription className="text-lg">
                Choose your preferred date and time for Rob's visit
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Date Selection */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-600" />
              Select a Date
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {getAvailableDates().map((date) => {
                const dateString = date.toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric'
                })
                const fullDateString = date.toDateString()
                
                return (
                  <Button
                    key={fullDateString}
                    variant={selectedDate === fullDateString ? 'default' : 'outline'}
                    className={`p-4 h-auto flex flex-col ${
                      selectedDate === fullDateString 
                        ? 'bg-blue-600 text-white' 
                        : 'hover:bg-blue-50'
                    }`}
                    onClick={() => setSelectedDate(fullDateString)}
                  >
                    <span className="font-semibold">{dateString.split(' ')[0]}</span>
                    <span className="text-sm">{dateString.split(' ')[1]} {dateString.split(' ')[2]}</span>
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Time Selection */}
          {selectedDate && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-blue-600" />
                Select a Time
              </h3>
              
              {isLoadingSlots ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600">Loading available times...</span>
                </div>
              ) : slotsError ? (
                <div className="flex items-center p-4 bg-red-50 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                  <span className="text-red-700">{slotsError}</span>
                </div>
              ) : availableSlots && availableSlots.allSlots.length > 0 ? (
                <>
                  {/* 48-Hour Minimum Notice */}
                  <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <p className="text-sm text-blue-800 flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      <strong>48-Hour Minimum Notice:</strong> Appointments must be scheduled at least 48 hours in advance.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                    {/* Available Slots */}
                    {availableSlots.availableSlots.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? 'default' : 'outline'}
                        className={`p-4 ${
                          selectedTime === time 
                            ? 'bg-blue-600 text-white' 
                            : 'hover:bg-blue-50'
                        }`}
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </Button>
                    ))}
                    
                    {/* Slots within 48 hours - disabled */}
                    {availableSlots.withinFortyEightHours?.map((time) => (
                      <Button
                        key={time}
                        variant="outline"
                        disabled
                        className="p-4 bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                        title="Cannot book within 48 hours"
                      >
                        {time}
                        <span className="text-xs block">Too soon</span>
                      </Button>
                    ))}
                    
                    {/* Booked slots - disabled */}
                    {availableSlots.bookedSlots.map((time) => (
                      <Button
                        key={`booked-${time}`}
                        variant="outline"
                        disabled
                        className="p-4 bg-red-50 text-red-400 cursor-not-allowed border-red-200"
                        title="Already booked"
                      >
                        {time}
                        <span className="text-xs block">Booked</span>
                      </Button>
                    ))}
                  </div>
                  
                  {/* Status Legend */}
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-blue-600 rounded mr-2"></div>
                        <span className="text-gray-700">Available</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-gray-300 rounded mr-2"></div>
                        <span className="text-gray-700">Within 48 hours</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-red-300 rounded mr-2"></div>
                        <span className="text-gray-700">Already booked</span>
                      </div>
                    </div>
                  </div>

                  {/* Summary Information */}
                  {(availableSlots.withinFortyEightHours?.length > 0 || availableSlots.bookedSlots.length > 0) && (
                    <div className="mt-4 space-y-2">
                      {availableSlots.withinFortyEightHours?.length > 0 && (
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-800 mb-1">
                            <strong>Times requiring 48+ hours notice:</strong>
                          </p>
                          <p className="text-sm text-gray-600">
                            {availableSlots.withinFortyEightHours.join(', ')}
                          </p>
                        </div>
                      )}
                      
                      {availableSlots.bookedSlots.length > 0 && (
                        <div className="bg-yellow-50 p-3 rounded-lg">
                          <p className="text-sm text-yellow-800 mb-1">
                            <strong>Already booked for this date:</strong>
                          </p>
                          <p className="text-sm text-yellow-700">
                            {availableSlots.bookedSlots.join(', ')}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : availableSlots && availableSlots.availableSlots.length === 0 ? (
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-gray-600 mr-2" />
                  <div>
                    <p className="text-gray-700 font-medium">No available time slots</p>
                    <p className="text-sm text-gray-600">
                      {availableSlots.allSlots.length === 0 
                        ? "Rob doesn't have availability on this day."
                        : "All time slots are already booked for this date."
                      }
                    </p>
                  </div>
                </div>
              ) : null}
            </motion.div>
          )}

          {/* Confirmation */}
          {selectedDate && selectedTime && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-blue-50 p-6 rounded-lg"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Your Appointment</h3>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="font-medium text-gray-900">
                    {selectedDate} at {selectedTime}
                  </p>
                  <p className="text-gray-600 text-sm">90-minute consultation with Rob Radosta</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-600 text-xl">FREE</p>
                  <p className="text-gray-600 text-sm">No obligation</p>
                </div>
              </div>
              
              <Button
                onClick={handleBooking}
                disabled={isLoading}
                size="lg" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isLoading ? 'Scheduling...' : 'Confirm Appointment'}
              </Button>
              
              <p className="text-center text-sm text-gray-600 mt-4">
                You'll receive a confirmation email and reminder call
              </p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
