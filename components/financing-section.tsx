
'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CreditCard, DollarSign, Calendar, CheckCircle, Heart, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

interface FinancingSectionProps {
  onGetQuoteClick: () => void
}

export function FinancingSection({ onGetQuoteClick }: FinancingSectionProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const financingOptions = [
    {
      icon: Calendar,
      title: "24 Months No Interest",
      description: "0% interest and no payments for qualified buyers",
      highlight: "Most Popular"
    },
    {
      icon: CreditCard,
      title: "Up to 60 Months",
      description: "Extended payment plans with competitive rates",
      highlight: "Flexible Terms"
    },
    {
      icon: DollarSign,
      title: "No Upfront Costs",
      description: "Start your project with no money down",
      highlight: "Easy Start"
    }
  ]

  const discounts = [
    {
      icon: Heart,
      title: "Senior Discounts",
      description: "Special pricing for customers 65 and older"
    },
    {
      icon: Users,
      title: "Military Discounts",
      description: "Thank you for your service - special rates available"
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
          <Badge className="mb-4 bg-green-100 text-green-800">Flexible Financing</Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            <span className="text-blue-600">Affordable</span> Payment Options
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Don't let budget concerns delay your safety and comfort. We offer flexible financing 
            options to make your bathroom transformation affordable and accessible.
          </p>
        </motion.div>

        {/* Main Financing Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {financingOptions.map((option, index) => (
            <motion.div
              key={option.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="group relative"
            >
              <div className="bg-white rounded-xl shadow-lg p-8 h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-blue-100">
                {index === 0 && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-600 text-white">{option.highlight}</Badge>
                  </div>
                )}
                
                <div className="text-center">
                  <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-6 group-hover:bg-blue-200 transition-colors">
                    <option.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{option.title}</h3>
                  <p className="text-gray-600 text-lg mb-6">{option.description}</p>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm font-semibold text-blue-800">
                      {option.highlight}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Special Discounts */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-2xl p-8 md:p-12 text-white mb-16"
        >
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-4">Additional Discounts Available</h3>
            <p className="text-blue-100 text-lg">
              We honor those who've served our community and country
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {discounts.map((discount, index) => (
              <div key={discount.title} className="flex items-center p-6 bg-white/10 rounded-xl backdrop-blur-sm">
                <div className="bg-white/20 p-3 rounded-lg mr-4">
                  <discount.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2">{discount.title}</h4>
                  <p className="text-blue-100">{discount.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Value Proposition */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center"
        >
          <h3 className="text-3xl font-bold text-gray-900 mb-6">
            Why Wait? Your Safety is Priceless
          </h3>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
            Every day you delay is another day of potential safety risks. Our flexible financing 
            makes it easy to start your bathroom transformation immediately, with payments that 
            fit your budget.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <span className="font-semibold text-gray-700">No Hidden Fees</span>
            </div>
            <div className="flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <span className="font-semibold text-gray-700">Quick Approval Process</span>
            </div>
            <div className="flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <span className="font-semibold text-gray-700">Customized Payment Plans</span>
            </div>
          </div>

          <Button
            onClick={onGetQuoteClick}
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white text-xl px-12 py-6 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            Get Your Custom Financing Quote
          </Button>
          <p className="text-sm text-gray-600 mt-4">
            ✓ No obligation consultation ✓ Multiple financing options ✓ Same-day approval available
          </p>
        </motion.div>
      </div>
    </section>
  )
}
