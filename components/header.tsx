
'use client'

import { Button } from '@/components/ui/button'
import { Phone, Award, Shield } from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface HeaderProps {
  onGetQuoteClick: () => void
}

export function Header({ onGetQuoteClick }: HeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-4">
            <div className="relative w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">TN</span>
            </div>
            <div className="hidden md:block">
              <h1 className="text-lg font-bold text-gray-900">True North Kitchen & Bath</h1>
              <p className="text-sm text-gray-600">Rob Radosta, Safety & Design Consultant</p>
            </div>
          </div>

          {/* Key Features */}
          <div className="hidden lg:flex items-center space-x-6">
            <div className="flex items-center text-sm text-gray-700">
              <Award className="h-4 w-4 text-blue-600 mr-2" />
              <span className="font-medium">Good Housekeeping Seal</span>
            </div>
            <div className="flex items-center text-sm text-gray-700">
              <Shield className="h-4 w-4 text-blue-600 mr-2" />
              <span className="font-medium">Lifetime Warranty</span>
            </div>
            <div className="flex items-center text-sm text-gray-700">
              <Phone className="h-4 w-4 text-blue-600 mr-2" />
              <span className="font-medium">Los Angeles County</span>
            </div>
          </div>

          {/* CTA Button */}
          <Button
            onClick={onGetQuoteClick}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Free Consultation
          </Button>
        </div>
      </div>
    </motion.header>
  )
}
