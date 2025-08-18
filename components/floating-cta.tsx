
'use client'

import { Button } from '@/components/ui/button'
import { Phone, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

interface FloatingCTAProps {
  onGetQuoteClick: () => void
}

export function FloatingCTA({ onGetQuoteClick }: FloatingCTAProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      // Show after scrolling 500px
      setIsVisible(scrollY > 500 && !isDismissed)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isDismissed])

  const handleDismiss = () => {
    setIsDismissed(true)
    setIsVisible(false)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <div className="bg-blue-600 text-white rounded-xl shadow-2xl p-4 max-w-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-lg">Ready to Get Started?</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className="text-white hover:bg-blue-700 p-1 h-auto"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-blue-100 text-sm mb-4">
              Schedule your free 60-90 minute consultation with Rob today!
            </p>
            <Button
              onClick={() => {
                onGetQuoteClick()
                handleDismiss()
              }}
              className="w-full bg-white text-blue-600 hover:bg-gray-100 font-semibold"
            >
              <Phone className="h-4 w-4 mr-2" />
              Get Free Consultation
            </Button>
            <div className="text-center mt-2">
              <span className="text-xs text-blue-200">No obligation • Lifetime warranty</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
