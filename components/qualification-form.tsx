
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, AlertCircle, Phone, Mail, MapPin, User, Clock, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import { FormData } from '@/lib/types'

interface QualificationFormProps {
  onSubmit: (data: FormData) => void
  onBooking: (leadId: string) => void
  isLoading?: boolean
}

export function QualificationForm({ onSubmit, onBooking, isLoading = false }: QualificationFormProps) {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    cellPhone: '',
    address: '',
    ownOrRent: '',
    availableForConsult: false,
    decisionMakersAvail: false,
    renovateElsewhere: false,
    renovateElsewhereDetails: ''
  })

  const [showRenterMessage, setShowRenterMessage] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [leadId, setLeadId] = useState<string>('')

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Show renter message if "rent" is selected
    if (field === 'ownOrRent') {
      setShowRenterMessage(value === 'rent')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.ownOrRent === 'rent') {
      return // Don't submit if renter
    }

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok) {
        setLeadId(result.leadId)
        setIsSubmitted(true)
        onSubmit(formData)
      } else {
        console.error('Form submission error:', result.error)
      }
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  const isFormValid = () => {
    return (
      formData.firstName &&
      formData.lastName &&
      formData.email &&
      formData.cellPhone &&
      formData.address &&
      formData.ownOrRent &&
      formData.ownOrRent !== 'rent'
    )
  }

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 bg-blue-100 rounded-full p-3 w-16 h-16 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl text-blue-800">
              Great News, {formData.firstName}!
            </CardTitle>
            <CardDescription className="text-blue-700 text-lg">
              You qualify for our free in-home consultation! Now let's schedule your appointment with Rob.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your 90-Minute Consultation Includes:</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="bg-blue-100 rounded-full p-2 mr-4">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Comprehensive Assessment</p>
                    <p className="text-gray-600 text-sm">Detailed evaluation of your current bathroom</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-blue-100 rounded-full p-2 mr-4">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Safety & Accessibility Review</p>
                    <p className="text-gray-600 text-sm">Focus on aging-in-place solutions</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-blue-100 rounded-full p-2 mr-4">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Custom Design & Quote</p>
                    <p className="text-gray-600 text-sm">Detailed proposal with financing options</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start">
                <Clock className="h-5 w-5 text-amber-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-800 mb-1">
                    Next Step Required
                  </h4>
                  <p className="text-amber-700 text-sm">
                    Please schedule your consultation appointment below to complete your request. 
                    Choose from Rob's available time slots.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Button
                onClick={() => onBooking(leadId)}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg"
              >
                <Clock className="h-5 w-5 mr-2" />
                Schedule Your Consultation Now
              </Button>
              <p className="text-sm text-blue-600 mt-3 font-medium">
                ✓ Required to complete your request
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
      className="max-w-2xl mx-auto"
    >
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-gray-900">
            Get Your Free In-Home Consultation
          </CardTitle>
          <CardDescription className="text-lg">
            Tell us about your project and we'll schedule your 60-90 minute consultation with Rob
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-blue-600" />
                  First Name *
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  required
                  className="pl-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-blue-600" />
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  className="pl-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cellPhone" className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-blue-600" />
                  Cell Phone *
                </Label>
                <Input
                  id="cellPhone"
                  type="tel"
                  value={formData.cellPhone}
                  onChange={(e) => handleInputChange('cellPhone', e.target.value)}
                  required
                  className="pl-10"
                  placeholder="(XXX) XXX-XXXX"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                Home Address *
              </Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                required
                className="pl-10"
                placeholder="Street address, city, state, zip"
              />
            </div>

            {/* Qualification Questions */}
            <div className="space-y-6 border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900">Qualification Questions</h3>

              {/* Own or Rent */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Do you own or rent your home? *</Label>
                <RadioGroup 
                  value={formData.ownOrRent} 
                  onValueChange={(value) => handleInputChange('ownOrRent', value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="own" id="own" />
                    <label htmlFor="own" className="cursor-pointer">I own my home</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="rent" id="rent" />
                    <label htmlFor="rent" className="cursor-pointer">I rent my home</label>
                  </div>
                </RadioGroup>
              </div>

              {/* Renter Message */}
              {showRenterMessage && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                  className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
                >
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-yellow-800 mb-2">
                        We're sorry, but we cannot work with renters.
                      </h4>
                      <p className="text-yellow-700 text-sm leading-relaxed">
                        If you would like to have the bath re-done in your rental, please have your landlord 
                        reach out to us directly at <strong>rradosta@truenorthkb.com</strong>. Make sure your 
                        landlord mentions that you sent them to us, so that you can earn our <strong>$100 referral fee</strong> if 
                        they end up signing up for the project.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Only show remaining questions if not a renter */}
              {!showRenterMessage && (
                <>
                  {/* Available for Consultation */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-blue-600" />
                      Are you available to commit to a 60-90 minute in-home consultation with Rob? *
                    </Label>
                    <RadioGroup 
                      value={formData.availableForConsult ? 'yes' : 'no'} 
                      onValueChange={(value) => handleInputChange('availableForConsult', value === 'yes')}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="consult-yes" />
                        <label htmlFor="consult-yes" className="cursor-pointer">Yes, I can commit to the consultation</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="consult-no" />
                        <label htmlFor="consult-no" className="cursor-pointer">No, I'm not available for a consultation</label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Decision Makers Available */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium flex items-center">
                      <Users className="h-4 w-4 mr-2 text-blue-600" />
                      Will all decision-makers be available for our meeting? *
                    </Label>
                    <RadioGroup 
                      value={formData.decisionMakersAvail ? 'yes' : 'no'} 
                      onValueChange={(value) => handleInputChange('decisionMakersAvail', value === 'yes')}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="decision-yes" />
                        <label htmlFor="decision-yes" className="cursor-pointer">Yes, all decision-makers will be present</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="decision-no" />
                        <label htmlFor="decision-no" className="cursor-pointer">No, not all decision-makers will be available</label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Additional Renovations */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium">
                      Do you want to renovate anything else in the bathroom outside of the bath/shower area?
                    </Label>
                    <RadioGroup 
                      value={formData.renovateElsewhere ? 'yes' : 'no'} 
                      onValueChange={(value) => handleInputChange('renovateElsewhere', value === 'yes')}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="renovate-yes" />
                        <label htmlFor="renovate-yes" className="cursor-pointer">Yes, I want additional renovations</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="renovate-no" />
                        <label htmlFor="renovate-no" className="cursor-pointer">No, just the bath/shower area</label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Additional Details */}
                  {formData.renovateElsewhere && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.3 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="renovateElsewhereDetails">
                        Please describe what else you'd like to renovate:
                      </Label>
                      <Textarea
                        id="renovateElsewhereDetails"
                        value={formData.renovateElsewhereDetails}
                        onChange={(e) => handleInputChange('renovateElsewhereDetails', e.target.value)}
                        placeholder="e.g., vanity, flooring, lighting, mirrors..."
                        rows={3}
                      />
                    </motion.div>
                  )}
                </>
              )}
            </div>

            {/* Submit Button */}
            {!showRenterMessage && (
              <Button
                type="submit"
                size="lg"
                disabled={!isFormValid() || isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-6"
              >
                {isLoading ? 'Submitting...' : 'Schedule My Free Consultation'}
              </Button>
            )}

            {isFormValid() && !showRenterMessage && (
              <div className="text-center text-sm text-gray-600">
                <p>✓ No obligation ✓ 100% custom solutions ✓ Lifetime warranty</p>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
