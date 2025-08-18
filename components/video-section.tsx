
'use client'

import { Button } from '@/components/ui/button'
import { Play, Shield, Award } from 'lucide-react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

interface VideoSectionProps {
  onGetQuoteClick: () => void
}

export function VideoSection({ onGetQuoteClick }: VideoSectionProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  return (
    <section className="py-20 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <Award className="h-8 w-8 text-yellow-400 mr-3" />
            <h2 className="text-4xl md:text-5xl font-bold">
              See Why We Earned the <span className="text-yellow-400">Good Housekeeping Seal</span>
            </h2>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Watch this exclusive feature about our Good Housekeeping Seal of Approval - 
            the only recognition of its kind in the bath remodeling industry.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative max-w-4xl mx-auto mb-12"
        >
          <div className="relative aspect-video bg-gray-800 rounded-2xl shadow-2xl overflow-hidden group">
            <iframe
              src="https://www.youtube.com/embed/J6W6SHSTHZw?si=J6_vev0JNvBFugIB"
              title="Good Housekeeping Seal of Approval Feature"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
        >
          <div className="text-center">
            <div className="bg-blue-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Rigorous Testing</h3>
            <p className="text-gray-300">
              Our products passed extensive laboratory evaluations by the Good Housekeeping Research Institute.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-blue-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Award className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Exclusive Recognition</h3>
            <p className="text-gray-300">
              We're the only bath remodeling company in the United States to hold this prestigious seal.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-blue-600 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Play className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Consumer Protection</h3>
            <p className="text-gray-300">
              2-year limited warranty up to $2,000 plus our lifetime product warranty for complete peace of mind.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <Button
            onClick={onGetQuoteClick}
            size="lg"
            className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 text-xl px-12 py-6 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 font-bold"
          >
            Experience the Good Housekeeping Difference
          </Button>
          <p className="text-sm text-gray-400 mt-4">
            Join thousands of satisfied customers with our exclusive seal of quality
          </p>
        </motion.div>
      </div>
    </section>
  )
}
