
'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Shield, Award, Clock, Heart, Home, Wrench, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'

interface FeaturesSectionProps {
  onGetQuoteClick: () => void
}

export function FeaturesSection({ onGetQuoteClick }: FeaturesSectionProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const features = [
    {
      icon: Shield,
      title: "Lifetime Warranty",
      description: "For as long as you own your home, our acrylic products won't fade, yellow, crack, bubble or peel. Backed by True North's commitment to quality.",
      highlight: "Fully transferable lifetime labor & materials warranty"
    },
    {
      icon: Award,
      title: "The Good Housekeeping Seal of Approval",
      description: "We're the ONLY bath remodeling company in the United States with The Good Housekeeping Seal of Approval. This adds additional protection on top of our product warranty.",
      highlight: "Exclusive recognition for quality"
    },
    {
      icon: Clock,
      title: "Installed in as little as 2-3 days",
      description: "Professional installation completed in as little as 2-3 days with minimal disruption to your daily routine. Engineered to fit your existing bathroom space.",
      highlight: "Quick turnaround, lasting results"
    },
    {
      icon: Heart,
      title: "Aging-in-Place Design",
      description: "Safety features including low-threshold entry, slip-resistant surfaces, grab bars, and built-in seating designed for comfort and accessibility.",
      highlight: "ADA compliant solutions"
    },
    {
      icon: Home,
      title: "Custom Solutions",
      description: "Every project is 100% customized to your needs and space. No cookie-cutter approaches - just beautiful, functional designs tailored for you.",
      highlight: "Free in-home consultation"
    },
    {
      icon: Wrench,
      title: "Expert Installation",
      description: "Licensed California contractors with Home Depot partnership. Clean job sites, quality workmanship, and professional service from start to finish.",
      highlight: "Licensed & insured (CA #1046117)"
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-blue-100 text-blue-800">Why Choose True North</Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            The Only <span className="text-blue-600">Good Housekeeping Approved</span> Bath Remodeler
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            When it comes to your family's safety and your home's value, choose the company 
            with exclusive certifications and unmatched warranties.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-white rounded-xl shadow-lg p-8 h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 p-3 rounded-lg mr-4 group-hover:bg-blue-200 transition-colors">
                    <feature.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
                </div>
                <p className="text-gray-600 mb-4 leading-relaxed">{feature.description}</p>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm font-semibold text-blue-800">{feature.highlight}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Good Housekeeping Seal Feature */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-2xl p-8 md:p-12 text-white text-center mb-12"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1 text-left">
              <div className="flex items-center mb-4">
                <Star className="h-8 w-8 text-yellow-400 mr-3" />
                <h3 className="text-3xl font-bold">Good Housekeeping Seal of Approval</h3>
              </div>
              <p className="text-xl mb-6 text-blue-100">
                The only bath remodeling company in America with this prestigious recognition. 
                Our products passed rigorous laboratory evaluations by the Good Housekeeping Research Institute.
              </p>
              <ul className="space-y-2 text-blue-100">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-yellow-400" />
                  Additional protection on top of product warranty
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-yellow-400" />
                  Third-party testing and warranty guarantees
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-yellow-400" />
                  100-year legacy of consumer protection
                </li>
              </ul>
            </div>
            <div className="flex-shrink-0">
              <div className="relative w-48 h-32 bg-white/10 rounded-lg">
                <Image
                  src="https://www.windowworld.com/uploads/images/news/HEADER_Good-Housekeeping-Institute-Facilities.jpg"
                  alt="Good Housekeeping Seal of Approval"
                  fill
                  className="object-contain p-4"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <Button
            onClick={onGetQuoteClick}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white text-xl px-12 py-6 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            Schedule Your Free Consultation
          </Button>
          <p className="text-sm text-gray-600 mt-4">
            ✓ 100% Custom Solutions ✓ Lifetime Warranty ✓ Good Housekeeping Approved
          </p>
        </motion.div>
      </div>
    </section>
  )
}
