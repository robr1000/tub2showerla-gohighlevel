
'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Sparkles, Home, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'

interface BeforeAfterGalleryProps {
  onGetQuoteClick: () => void
}

export function BeforeAfterGallery({ onGetQuoteClick }: BeforeAfterGalleryProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const transformations = [
    {
      id: 1,
      title: "Tub-to-Shower Conversion",
      category: "Complete Transformation",
      beforeImage: "https://i.pinimg.com/originals/45/43/5d/45435da740e13416de45daa704e1e477.png",
      afterImage: "https://i.pinimg.com/originals/45/43/5d/45435da740e13416de45daa704e1e477.png",
      description: "Transformed an outdated bathtub into a modern, accessible walk-in shower with safety features.",
      features: ["Low-threshold entry", "Slip-resistant flooring", "Built-in grab bars"]
    },
    {
      id: 2,
      title: "Accessible Bathroom Renovation",
      category: "Barrier-Free Design",
      beforeImage: "https://i.pinimg.com/originals/df/20/ee/df20ee5529625e7186682cab400095ae.jpg",
      afterImage: "https://i.pinimg.com/originals/df/20/ee/df20ee5529625e7186682cab400095ae.jpg",
      description: "Created an ADA-compliant shower space with modern fixtures and enhanced accessibility.",
      features: ["ADA compliant", "Modern fixtures", "Safety-focused design"]
    },
    {
      id: 3,
      title: "Walk-in Tub Installation",
      category: "Therapeutic Bathing",
      beforeImage: "https://i.ytimg.com/vi/ii3Ma_aznEc/maxresdefault.jpg",
      afterImage: "https://i.ytimg.com/vi/ii3Ma_aznEc/maxresdefault.jpg",
      description: "Installed a therapeutic walk-in tub with safety features for comfortable bathing.",
      features: ["Therapeutic jets", "Built-in seating", "Easy-access door"]
    },
    {
      id: 4,
      title: "Small Space Optimization",
      category: "Space-Saving Solution",
      beforeImage: "https://i.ytimg.com/vi/kGm9BTbCZGc/maxresdefault.jpg",
      afterImage: "https://i.ytimg.com/vi/kGm9BTbCZGc/maxresdefault.jpg",
      description: "Maximized a compact bathroom space with a modern shower and smart storage solutions.",
      features: ["Space optimization", "Modern design", "Smart storage"]
    },
    {
      id: 5,
      title: "Traditional to Modern",
      category: "Style Upgrade",
      beforeImage: "https://i.pinimg.com/originals/f0/3c/8e/f03c8e541922e22d75ba68624efef5d0.png",
      afterImage: "https://i.pinimg.com/originals/f0/3c/8e/f03c8e541922e22d75ba68624efef5d0.png",
      description: "Updated a traditional bathroom with contemporary fixtures and sleek design elements.",
      features: ["Contemporary style", "Modern fixtures", "Premium finishes"]
    },
    {
      id: 6,
      title: "Luxury Walk-in Tub",
      category: "Premium Installation",
      beforeImage: "https://i.pinimg.com/736x/5e/97/61/5e976119defef9198ed221aed6d06b8b.jpg",
      afterImage: "https://i.pinimg.com/736x/5e/97/61/5e976119defef9198ed221aed6d06b8b.jpg",   
      description: "Installed a luxury walk-in tub with premium features and therapeutic benefits.",
      features: ["Luxury features", "Therapeutic benefits", "Premium materials"]
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-blue-100 text-blue-800">Proven Results</Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Before & After <span className="text-blue-600">Pictures</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See the dramatic transformations we've created for families across Los Angeles County. 
            Every project comes with our fully transferable lifetime labor & materials warranty.
          </p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
        >
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="bg-blue-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
              <Sparkles className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">500+</h3>
            <p className="text-gray-600">Bathrooms Transformed</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="bg-blue-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
              <Home className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">98%</h3>
            <p className="text-gray-600">Customer Satisfaction</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="bg-blue-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">2-3</h3>
            <p className="text-gray-600">Days Installation</p>
          </div>
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {transformations.map((transformation, index) => (
            <motion.div
              key={transformation.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                {/* Before/After Image */}
                <div className="relative aspect-[4/3] bg-gray-200">
                  <Image
                    src={transformation.afterImage}
                    alt={`${transformation.title} - After`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-green-600 text-white shadow-lg">After</Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-blue-600 text-white shadow-lg">{transformation.category}</Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {transformation.title}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    {transformation.description}
                  </p>
                  
                  {/* Features */}
                  <div className="space-y-2 mb-4">
                    {transformation.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center text-sm text-gray-700">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mr-2 flex-shrink-0"></div>
                        {feature}
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Button
                    onClick={onGetQuoteClick}
                    variant="outline"
                    className="w-full border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                  >
                    Get Similar Results
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-2xl p-8 md:p-12 text-white text-center"
        >
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            Ready for Your Transformation?
          </h3>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Join hundreds of satisfied homeowners who've transformed their bathrooms with our 
            fully transferable lifetime labor & materials warranty and The Good Housekeeping Seal of Approval.
          </p>
          <Button
            onClick={onGetQuoteClick}
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-100 text-xl px-12 py-6 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            Schedule Your Free Consultation Today
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
          <p className="text-sm text-blue-200 mt-4">
            ✓ Free in-home consultation ✓ No obligation ✓ Same-day quotes available
          </p>
        </motion.div>
      </div>
    </section>
  )
}
