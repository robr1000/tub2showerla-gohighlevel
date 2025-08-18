
'use client'

import { useState } from 'react'
import { Header } from '@/components/header'
import { HeroSection } from '@/components/hero-section'
import { FeaturesSection } from '@/components/features-section'
import { VideoSection } from '@/components/video-section'
import { BeforeAfterGallery } from '@/components/before-after-gallery'
import { TestimonialsSection } from '@/components/testimonials-section'
import { ServicesSection } from '@/components/services-section'
import { FinancingSection } from '@/components/financing-section'
import { ServiceAreaSection } from '@/components/service-area-section'
import { QualificationForm } from '@/components/qualification-form'
import { BookingCalendar } from '@/components/booking-calendar'
import { Footer } from '@/components/footer'
import { FloatingCTA } from '@/components/floating-cta'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { FormData } from '@/lib/types'

export default function Home() {
  const [showForm, setShowForm] = useState(false)
  const [showBooking, setShowBooking] = useState(false)
  const [currentLeadId, setCurrentLeadId] = useState('')

  const handleGetQuoteClick = () => {
    setShowForm(true)
    setShowBooking(false)
  }

  const handleFormSubmit = (data: FormData) => {
    // Form is already submitted in the component
    // Just close the form modal for now
    console.log('Form submitted:', data)
  }

  const handleBookingClick = (leadId: string) => {
    setCurrentLeadId(leadId)
    setShowBooking(true)
    setShowForm(false)
  }

  const handleBookingBack = () => {
    setShowBooking(false)
    setShowForm(true)
  }

  const closeModal = () => {
    setShowForm(false)
    setShowBooking(false)
    setCurrentLeadId('')
  }

  return (
    <main className="relative">
      {/* Header */}
      <Header onGetQuoteClick={handleGetQuoteClick} />

      {/* Main Content */}
      <div className="pt-16"> {/* Account for fixed header */}
        <HeroSection onGetQuoteClick={handleGetQuoteClick} />
        <FeaturesSection onGetQuoteClick={handleGetQuoteClick} />
        <VideoSection onGetQuoteClick={handleGetQuoteClick} />
        <BeforeAfterGallery onGetQuoteClick={handleGetQuoteClick} />
        <TestimonialsSection onGetQuoteClick={handleGetQuoteClick} />
        <ServicesSection onGetQuoteClick={handleGetQuoteClick} />
        <FinancingSection onGetQuoteClick={handleGetQuoteClick} />
        <ServiceAreaSection onGetQuoteClick={handleGetQuoteClick} />
      </div>

      {/* Footer */}
      <Footer onGetQuoteClick={handleGetQuoteClick} />

      {/* Floating CTA */}
      <FloatingCTA onGetQuoteClick={handleGetQuoteClick} />

      {/* Form Modal */}
      <Dialog open={showForm || showBooking} onOpenChange={closeModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sr-only">
            <DialogTitle>
              {showBooking ? 'Schedule Consultation' : 'Get Free Consultation'}
            </DialogTitle>
            <DialogDescription>
              {showBooking ? 'Choose your preferred date and time' : 'Fill out the form to get started'}
            </DialogDescription>
          </DialogHeader>
          
          {showBooking ? (
            <BookingCalendar 
              leadId={currentLeadId} 
              onBack={handleBookingBack}
            />
          ) : (
            <QualificationForm 
              onSubmit={handleFormSubmit}
              onBooking={handleBookingClick}
            />
          )}
        </DialogContent>
      </Dialog>
    </main>
  )
}
