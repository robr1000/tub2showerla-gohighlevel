
'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Phone, Clock, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'
import { useLocationData } from '@/lib/client-domain-detection'

interface ServiceAreaSectionProps {
  onGetQuoteClick: () => void
}

export function ServiceAreaSection({ onGetQuoteClick }: ServiceAreaSectionProps) {
  const locationData = useLocationData()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  // Dynamic service areas based on location
  const getServiceAreas = () => {
    switch (locationData.city) {
      case 'Los Angeles':
        return [
          { name: "Los Angeles", description: "Central LA coverage" },
          { name: "Hollywood", description: "Entertainment district" },
          { name: "Downtown LA", description: "City center" },
          { name: "West LA", description: "Westside communities" },
          { name: "South LA", description: "Southern areas" },
          { name: "East LA", description: "Eastern communities" },
          { name: "Mid-City", description: "Central neighborhoods" },
          { name: "Silver Lake", description: "Trendy neighborhoods" }
        ]
      case 'Hollywood':
        return [
          { name: "Hollywood", description: "Entertainment capital" },
          { name: "West Hollywood", description: "WeHo district" },
          { name: "Los Feliz", description: "Hillside community" },
          { name: "Silver Lake", description: "Trendy neighborhood" },
          { name: "Echo Park", description: "Historic area" },
          { name: "Griffith Park", description: "Observatory area" },
          { name: "Sunset Strip", description: "Famous corridor" },
          { name: "Melrose", description: "Shopping district" }
        ]
      case 'Santa Monica':
        return [
          { name: "Santa Monica", description: "Beach city" },
          { name: "Venice", description: "Boardwalk community" },
          { name: "Mar Vista", description: "Residential area" },
          { name: "Palms", description: "Mid-city west" },
          { name: "Del Rey", description: "Coastal community" },
          { name: "Playa Vista", description: "Modern development" },
          { name: "Pacific Palisades", description: "Upscale coastal" },
          { name: "Brentwood", description: "Westside luxury" }
        ]
      case 'Santa Clarita':
        return [
          { name: "Santa Clarita", description: "Valley city" },
          { name: "Valencia", description: "Planned community" },
          { name: "Newhall", description: "Historic district" },
          { name: "Saugus", description: "Family neighborhoods" },
          { name: "Canyon Country", description: "Foothill area" },
          { name: "Castaic", description: "Lake community" },
          { name: "Stevenson Ranch", description: "Master-planned" },
          { name: "Agua Dulce", description: "Rural community" }
        ]
      case 'Long Beach':
        return [
          { name: "Long Beach", description: "Port city" },
          { name: "Belmont Shore", description: "Beach community" },
          { name: "Naples", description: "Island living" },
          { name: "Signal Hill", description: "Hilltop city" },
          { name: "Lakewood", description: "Planned community" },
          { name: "Seal Beach", description: "Coastal charm" },
          { name: "Los Alamitos", description: "Small city" },
          { name: "Cypress", description: "Residential area" }
        ]
      default:
        return [
          { name: locationData.city, description: "Primary service area" },
          { name: "Surrounding Areas", description: "Extended coverage" }
        ]
    }
  }

  const serviceAreas = getServiceAreas()

  return (
    <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-blue-100 text-blue-800">Local Service</Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Proudly Serving <span className="text-blue-600">{locationData.city}</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {locationData.serviceAreaDescription}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-square bg-gray-200 rounded-2xl shadow-2xl overflow-hidden">
              <Image
                src="https://mil.library.ucsb.edu/apcatalog/ready_ref/los_angeles.jpg"
                alt="Los Angeles County Service Area Map"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent"></div>
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="font-semibold text-gray-900">{locationData.city} Coverage</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Local Expertise, Regional Coverage
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                As a California licensed contractor (License #1046117), Rob Radosta brings 
                local knowledge and expertise to every project in {locationData.city} and surrounding areas. 
                We understand local building codes, permitting requirements, and the unique 
                needs of aging homeowners in our community.
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-xl">
              <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="h-5 w-5 text-blue-600 mr-2" />
                Service Area Benefits:
              </h4>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-700">
                  <div className="bg-blue-100 rounded-full p-1 mr-3 flex-shrink-0">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                  </div>
                  Licensed California contractor with local permit knowledge
                </li>
                <li className="flex items-center text-gray-700">
                  <div className="bg-blue-100 rounded-full p-1 mr-3 flex-shrink-0">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                  </div>
                  Familiar with local building codes and requirements
                </li>
                <li className="flex items-center text-gray-700">
                  <div className="bg-blue-100 rounded-full p-1 mr-3 flex-shrink-0">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                  </div>
                  Quick response times throughout {locationData.city} area
                </li>
                <li className="flex items-center text-gray-700">
                  <div className="bg-blue-100 rounded-full p-1 mr-3 flex-shrink-0">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                  </div>
                  Established relationships with local suppliers
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <Phone className="h-5 w-5 text-blue-600 mr-2" />
                <span className="font-semibold text-gray-900">Quick Response Times</span>
              </div>
              <p className="text-gray-600 mb-4">
                Most consultations scheduled within 48 hours. Emergency assessments available 
                for urgent safety concerns.
              </p>
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-blue-600 mr-2" />
                <span className="text-sm text-gray-600">Typical response: 24-48 hours</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Service Areas Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Communities We Serve
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {serviceAreas.map((area, index) => (
              <motion.div
                key={area.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
              >
                <h4 className="font-bold text-gray-900 mb-1">{area.name}</h4>
                <p className="text-sm text-gray-600">{area.description}</p>
              </motion.div>
            ))}
          </div>
          <p className="text-center text-gray-600 mt-6">
            And many more communities throughout {locationData.county}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center"
        >
          <Button
            onClick={onGetQuoteClick}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white text-xl px-12 py-6 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            Schedule Your Local Consultation
          </Button>
          <p className="text-sm text-gray-600 mt-4">
            ✓ Licensed CA contractor ✓ Local expertise ✓ Quick response times
          </p>
        </motion.div>
      </div>
    </section>
  )
}
