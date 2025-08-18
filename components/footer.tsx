
'use client'

import { Button } from '@/components/ui/button'
import { Phone, Mail, MapPin, Award } from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface FooterProps {
  onGetQuoteClick: () => void
}

export function Footer({ onGetQuoteClick }: FooterProps) {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">True North Kitchen & Bath</h3>
              <p className="text-gray-300 mb-4">
                Rob Radosta, Safety & Design Consultant
              </p>
              <p className="text-gray-400 leading-relaxed">
                Specializing in aging-in-place bathroom solutions with lifetime warranties 
                and the exclusive Good Housekeeping Seal of Approval.
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative w-16 h-10 bg-gray-800 rounded">
                <Image
                  src="https://c8.alamy.com/comp/FFRJF1/seals-good-housekeeping-nthe-good-housekeeping-seal-of-approval-introduced-FFRJF1.jpg"
                  alt="Good Housekeeping Seal"
                  fill
                  className="object-contain p-1"
                />
              </div>
              <div className="text-sm text-gray-400">
                <div className="font-medium text-white">Good Housekeeping</div>
                <div>Seal of Approval</div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold">Contact Information</h4>
            <div className="space-y-4">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-blue-400 mr-3" />
                <div>
                  <div className="font-medium">rradosta@truenorthkb.com</div>
                  <div className="text-gray-400 text-sm">Direct email to Rob</div>
                </div>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-blue-400 mr-3" />
                <div>
                  <div className="font-medium">Los Angeles County</div>
                  <div className="text-gray-400 text-sm">Long Beach to Calabasas</div>
                </div>
              </div>
              <div className="flex items-center">
                <Award className="h-5 w-5 text-blue-400 mr-3" />
                <div>
                  <div className="font-medium">CA License #1046117</div>
                  <div className="text-gray-400 text-sm">Licensed & Insured</div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="space-y-6">
            <h4 className="text-xl font-bold">Get Started Today</h4>
            <p className="text-gray-300">
              Transform your bathroom into a safe, beautiful space perfect for aging in place.
            </p>
            <div className="space-y-4">
              <Button
                onClick={onGetQuoteClick}
                size="lg"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Schedule Free Consultation
              </Button>
              <div className="text-sm text-gray-400 text-center">
                ✓ 60-90 minute consultation<br />
                ✓ Custom design & quote<br />
                ✓ No obligation
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-400 text-sm">
              © 2025 True North Kitchen & Bath. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <span className="text-gray-400 text-sm">Licensed CA Contractor #1046117</span>
              <span className="text-gray-400 text-sm">BBB A+ Rating</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
