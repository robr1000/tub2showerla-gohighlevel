
'use client'

import { Button } from '@/components/ui/button'
import { Star, Quote } from 'lucide-react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'

interface TestimonialsSectionProps {
  onGetQuoteClick: () => void
}

export function TestimonialsSection({ onGetQuoteClick }: TestimonialsSectionProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const testimonials = [
    {
      name: "Beth W.",
      location: "Santa Clara, CA",
      rating: 5,
      text: "They show up when they say they will, do exceptional work, and leave your job site spotless every day. My bathroom has been transformed… and I have a LIFETIME warranty.",
      highlight: "Lifetime warranty"
    },
    {
      name: "Yuri K.",
      location: "San Jose, CA", 
      rating: 5,
      text: "Did a fantastic job with our tub to shower conversion. Clean, on-time… Couldn't be happier. Would not hesitate to hire them again.",
      highlight: "Tub-to-shower conversion"
    },
    {
      name: "Ken D.",
      location: "Los Gatos, CA",
      rating: 5,
      text: "Project updated our bathroom to a beautiful and contemporary design with high-end materials and fixtures… super friendly and flexible crew.",
      highlight: "High-end materials"
    },
    {
      name: "Celeste A.",
      location: "Los Angeles, CA",
      rating: 5,
      text: "Darwin and team were very professional, very detailed, and were willing to answer your questions whenever we had one. We highly recommend them to do your bathroom remodelling.",
      highlight: "Professional service"
    },
    {
      name: "Kathy L.",
      location: "Bay Area, CA",
      rating: 5,
      text: "NorCal Remodeling did what they said they would, showed up when they said they would, handled all building permits seamlessly, and did quality work. I highly recommend this company.",
      highlight: "Reliable and professional"
    },
    {
      name: "Katie S.",
      location: "San Jose, CA",
      rating: 5,
      text: "I had a tight timeline and this team made it happen… Their reliability removes all the stress out of remodeling. Thank you for my beautiful showers.",
      highlight: "Stress-free experience"
    }
  ]

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
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            What Our <span className="text-blue-600">Customers</span> Say
          </h2>
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center mr-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
              ))}
            </div>
            <span className="text-xl font-semibold text-gray-700">4.6/5 Stars on Google</span>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join hundreds of satisfied homeowners who've transformed their bathrooms with 
            our lifetime warranty and Good Housekeeping approved solutions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={`${testimonial.name}-${index}`}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-white rounded-xl shadow-lg p-6 h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative">
                <div className="absolute top-4 right-4">
                  <Quote className="h-8 w-8 text-blue-200" />
                </div>
                
                <div className="flex items-center mb-4">
                  <div className="relative w-12 h-12 bg-blue-100 rounded-full mr-4 flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-lg">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.location}</p>
                  </div>
                </div>

                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>

                <p className="text-gray-700 mb-4 leading-relaxed italic">
                  "{testimonial.text}"
                </p>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm font-semibold text-blue-800">
                    ✓ {testimonial.highlight}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Google Rating Highlight */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-white rounded-2xl shadow-xl p-8 text-center mb-12"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Trusted by Los Angeles Families
              </h3>
              <div className="flex items-center justify-center md:justify-start mb-4">
                <div className="flex items-center mr-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-8 w-8 text-yellow-400 fill-current" />
                  ))}
                  <span className="text-2xl font-bold text-gray-900 ml-2">4.6/5</span>
                </div>
                <div className="text-gray-600">
                  <p className="font-semibold">45+ Google Reviews</p>
                  <p className="text-sm">BBB A+ Rating</p>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="relative w-32 h-20 bg-gray-100 rounded-lg">
                <Image
                  src="https://www.pngkit.com/png/detail/185-1853051_google-5-star-png-5-star-google-rating.png"
                  alt="Google Reviews 5 Stars"
                  fill
                  className="object-contain p-2"
                />
              </div>
            </div>
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
            className="bg-blue-600 hover:bg-blue-700 text-white text-xl px-12 py-6 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            Join Our Satisfied Customers
          </Button>
          <p className="text-sm text-gray-600 mt-4">
            ✓ Free consultation ✓ No obligation ✓ Same-day quotes available
          </p>
        </motion.div>
      </div>
    </section>
  )
}
