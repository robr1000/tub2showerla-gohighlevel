
'use client'

import { Button } from '@/components/ui/button'
import { CheckCircle, Shield, Award, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useLocationData } from '@/lib/client-domain-detection'

interface HeroSectionProps {
  onGetQuoteClick: () => void
}

export function HeroSection({ onGetQuoteClick }: HeroSectionProps) {
  const locationData = useLocationData()
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 overflow-hidden">
      {/* Background Image with Parallax Effect */}
      <motion.div 
        className="absolute inset-0 z-0"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
      >
        <div className="relative w-full h-full bg-gray-200 aspect-video">
          <Image
            src="https://i.ytimg.com/vi/tzrWCY3-fms/maxresdefault.jpg"
            alt="Beautiful accessible bathroom renovation"
            fill
            className="object-cover opacity-20"
            priority
          />
        </div>
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            {locationData.h1Title.split(' ').slice(0, -3).join(' ')} 
            <span className="text-blue-600 block">{locationData.h1Title.split(' ').slice(-3).join(' ')}</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-4xl mx-auto">
            {locationData.heroSubtitle} 
            <strong> Fully transferable lifetime labor & materials warranty</strong> and the exclusive 
            <strong> Good Housekeeping Seal of Approval</strong>.
          </p>
        </motion.div>

        {/* Key Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10"
        >
          <div className="flex flex-col items-center p-4 bg-white/80 backdrop-blur-sm rounded-lg shadow-md">
            <Shield className="h-8 w-8 text-blue-600 mb-2" />
            <span className="font-semibold text-gray-900">Lifetime Warranty</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-white/80 backdrop-blur-sm rounded-lg shadow-md">
            <Award className="h-8 w-8 text-blue-600 mb-2" />
            <span className="font-semibold text-gray-900">Good Housekeeping Seal</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-white/80 backdrop-blur-sm rounded-lg shadow-md">
            <Clock className="h-8 w-8 text-blue-600 mb-2" />
            <span className="font-semibold text-gray-900">2-3 Day Installation</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-white/80 backdrop-blur-sm rounded-lg shadow-md">
            <CheckCircle className="h-8 w-8 text-blue-600 mb-2" />
            <span className="font-semibold text-gray-900">100% Custom Solutions</span>
          </div>
        </motion.div>

        {/* Rob's Introduction */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-8 mb-10 max-w-3xl mx-auto"
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0">
              <div className="relative w-32 h-32 bg-gray-200 rounded-full">
                <Image
                  src="/rob-radosta-professional.jpg"
                  alt="Rob Radosta, Safety & Design Consultant"
                  fill
                  className="object-cover rounded-full"
                />
              </div>
            </div>
            <div className="text-left">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Rob Radosta</h3>
              <p className="text-lg text-blue-600 font-semibold mb-3">Safety & Design Consultant</p>
              <p className="text-gray-700 leading-relaxed">
                With years of experience helping {locationData.city} families create safer, more accessible bathrooms, 
                I specialize in custom solutions that allow you to age comfortably in your own home. 
                Every project comes with our exclusive lifetime warranty and personalized consultation.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Main CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Button
            onClick={onGetQuoteClick}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white text-xl px-12 py-6 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            Get Your Free In-Home Consultation
          </Button>
          <p className="text-sm text-gray-600 mt-4">
            60-90 minute consultation • No obligation • 100% custom solutions
          </p>
        </motion.div>
      </div>
    </section>
  )
}
