
'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Shield, Clock, CheckCircle, Accessibility, Bath, Droplets } from 'lucide-react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'
import { useLocationData } from '@/lib/client-domain-detection'

interface ServicesSectionProps {
  onGetQuoteClick: () => void
}

export function ServicesSection({ onGetQuoteClick }: ServicesSectionProps) {
  const locationData = useLocationData()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const services = [
    {
      icon: Droplets,
      title: "Tub-to-Shower Conversions",
      description: "Transform your old bathtub into a beautiful, accessible walk-in shower perfect for daily use and aging in place.",
      features: [
        "Low-threshold entry (under 6 inches)",
        "Slip-resistant flooring with texture",
        "Integrated grab bars and seating",
        "Hand-held shower wand with slide bar",
        "Custom tile patterns and colors"
      ],
      image: "http://florianglass.com/wp-content/uploads/2015/12/Glass-Shower-Door-Advantages.jpg",
      highlight: "Most Popular Choice"
    },
    {
      icon: Bath,
      title: "Walk-in Tubs",
      description: "Enjoy safe, therapeutic bathing with our ADA-compliant walk-in tubs featuring advanced safety and comfort features.",
      features: [
        "Door threshold under 6 inches",
        "Built-in contoured seating",
        "Hydrotherapy jets available",
        "Rapid fill and drain (under 5 minutes)",
        "Dual-drain safety system"
      ],
      image: "https://milestonebathproducts.com/assets/img/products/walk-in-tubs/800/AS-PremiumSeries-Gelcoat.jpg",
      highlight: "Therapeutic Benefits"
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-blue-100 text-blue-800">Specialized Solutions</Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            <span className="text-blue-600">Aging-in-Place</span> Bathroom Solutions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Custom designed for {locationData.city} families focusing on safety, accessibility, and comfort. Every solution comes with our 
            exclusive lifetime warranty and Good Housekeeping Seal of Approval.
          </p>
        </motion.div>

        <div className="space-y-20">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12`}
            >
              {/* Image */}
              <div className="flex-1 relative">
                <div className="relative aspect-[4/3] bg-gray-200 rounded-2xl shadow-2xl overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-blue-600 text-white">{service.highlight}</Badge>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 space-y-6">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 p-3 rounded-lg mr-4">
                    <service.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900">{service.title}</h3>
                </div>

                <p className="text-lg text-gray-600 leading-relaxed">
                  {service.description}
                </p>

                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    Key Features:
                  </h4>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-gray-700">
                        <div className="bg-blue-100 rounded-full p-1 mr-3 flex-shrink-0">
                          <CheckCircle className="h-4 w-4 text-blue-600" />
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Shield className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="font-semibold text-gray-900">Lifetime Warranty</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="font-semibold text-gray-900">2-3 Day Installation</span>
                    </div>
                  </div>
                  <Button
                    onClick={onGetQuoteClick}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Get Free Consultation for {service.title}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Safety Features Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-8 md:p-12 text-center"
        >
          <div className="flex items-center justify-center mb-6">
            <Accessibility className="h-8 w-8 text-blue-600 mr-3" />
            <h3 className="text-3xl font-bold text-gray-900">ADA Compliant & Safety Focused</h3>
          </div>
          <p className="text-lg text-gray-700 mb-8 max-w-3xl mx-auto">
            All our solutions meet Americans with Disabilities Act guidelines and are specifically designed 
            for aging-in-place. Safety features include slip-resistant surfaces, grab bars, low thresholds, 
            and emergency access considerations.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h4 className="font-bold text-gray-900 mb-2">Slip Prevention</h4>
              <p className="text-gray-600">Textured surfaces and slip-resistant materials throughout</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h4 className="font-bold text-gray-900 mb-2">Easy Access</h4>
              <p className="text-gray-600">Low thresholds and wide openings for mobility aids</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h4 className="font-bold text-gray-900 mb-2">Emergency Features</h4>
              <p className="text-gray-600">Quick-drain systems and emergency access considerations</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-12"
        >
          <Button
            onClick={onGetQuoteClick}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white text-xl px-12 py-6 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            Explore Your Custom Solution
          </Button>
          <p className="text-sm text-gray-600 mt-4">
            ✓ Free in-home consultation ✓ Custom design ✓ Professional installation
          </p>
        </motion.div>
      </div>
    </section>
  )
}
