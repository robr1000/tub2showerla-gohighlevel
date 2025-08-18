
'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin, 
  Download, 
  LogOut,
  Filter,
  Search,
  Clock,
  CheckCircle,
  AlertCircle,
  QrCode,
  Link,
  Copy,
  Settings,
  Unlink
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Lead } from '@/lib/types'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import QRCode from 'qrcode'

export const dynamic = 'force-dynamic'

export default function AdminDashboard() {
  const sessionHook = useSession()
  const router = useRouter()
  
  const session = sessionHook?.data || null
  const status = sessionHook?.status || 'loading'
  const [leads, setLeads] = useState<Lead[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('')
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('')
  const [isCalendarConnected, setIsCalendarConnected] = useState<boolean>(false)
  const [calendarConnecting, setCalendarConnecting] = useState<boolean>(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user) {
      fetchLeads()
      checkCalendarConnection()
    }
  }, [session])

  useEffect(() => {
    generateQRCode()
  }, [])

  const generateQRCode = async () => {
    try {
      // Get the current domain/origin
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
      const landingPageUrl = baseUrl
      
      setQrCodeUrl(landingPageUrl)
      
      // Generate QR code
      const qrCodeData = await QRCode.toDataURL(landingPageUrl, {
        width: 256,
        margin: 2,
        color: {
          dark: '#1e40af', // Blue color
          light: '#ffffff'
        },
        errorCorrectionLevel: 'M'
      })
      
      setQrCodeDataUrl(qrCodeData)
    } catch (error) {
      console.error('Error generating QR code:', error)
    }
  }

  const fetchLeads = async () => {
    try {
      const response = await fetch('/api/leads')
      if (response.ok) {
        const data = await response.json()
        setLeads(data)
      }
    } catch (error) {
      console.error('Error fetching leads:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const checkCalendarConnection = async () => {
    try {
      const response = await fetch('/api/user/profile')
      if (response.ok) {
        const userData = await response.json()
        setIsCalendarConnected(!!userData.googleAccessToken)
      }
    } catch (error) {
      console.error('Error checking calendar connection:', error)
    }
  }

  const connectGoogleCalendar = async () => {
    try {
      setCalendarConnecting(true)
      const response = await fetch('/api/auth/google')
      if (response.ok) {
        const data = await response.json()
        window.location.href = data.authUrl
      }
    } catch (error) {
      console.error('Error connecting Google Calendar:', error)
      alert('Failed to connect Google Calendar')
    } finally {
      setCalendarConnecting(false)
    }
  }

  const disconnectGoogleCalendar = async () => {
    try {
      const response = await fetch('/api/user/disconnect-calendar', {
        method: 'POST'
      })
      if (response.ok) {
        setIsCalendarConnected(false)
        alert('Google Calendar disconnected successfully')
      }
    } catch (error) {
      console.error('Error disconnecting Google Calendar:', error)
      alert('Failed to disconnect Google Calendar')
    }
  }

  const copyUrlToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(qrCodeUrl)
      // You could add a toast notification here
      alert('URL copied to clipboard!')
    } catch (error) {
      console.error('Failed to copy URL:', error)
    }
  }

  const exportLeads = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Address', 'Own/Rent', 'Status', 'Created Date'].join(','),
      ...leads.map(lead => [
        `"${lead.firstName} ${lead.lastName}"`,
        `"${lead.email}"`,
        `"${lead.cellPhone}"`,
        `"${lead.address}"`,
        lead.ownOrRent,
        lead.status,
        new Date(lead.createdAt).toLocaleDateString()
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-yellow-100 text-yellow-800'
      case 'qualified': return 'bg-blue-100 text-blue-800'
      case 'contacted': return 'bg-purple-100 text-purple-800'
      case 'converted': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <AlertCircle className="h-4 w-4" />
      case 'qualified': return <Clock className="h-4 w-4" />
      case 'contacted': return <Phone className="h-4 w-4" />
      case 'converted': return <CheckCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.cellPhone.includes(searchTerm)
    
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    qualified: leads.filter(l => l.status === 'qualified').length,
    contacted: leads.filter(l => l.status === 'contacted').length,
    converted: leads.filter(l => l.status === 'converted').length
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session?.user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome back, {session.user.name}</p>
            </div>
            <Button
              onClick={() => signOut()}
              variant="outline"
              className="flex items-center"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Leads</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <AlertCircle className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">New</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.new}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Qualified</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.qualified}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Phone className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Contacted</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.contacted}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Converted</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.converted}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* QR Code Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <QrCode className="h-5 w-5 mr-2" />
              Landing Page QR Code
            </CardTitle>
            <CardDescription>
              Share this QR code with potential customers to direct them to your landing page
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* QR Code Display */}
              <div className="flex-shrink-0">
                {qrCodeDataUrl ? (
                  <div className="bg-white p-4 rounded-lg shadow-sm border">
                    <img 
                      src={qrCodeDataUrl} 
                      alt="Landing Page QR Code" 
                      className="w-48 h-48"
                    />
                  </div>
                ) : (
                  <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                )}
              </div>

              {/* QR Code Details */}
              <div className="flex-1 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Landing Page URL
                  </label>
                  <div className="flex gap-2">
                    <Input 
                      value={qrCodeUrl} 
                      readOnly 
                      className="flex-1 bg-gray-50"
                    />
                    <Button 
                      onClick={copyUrlToClipboard}
                      variant="outline"
                      className="flex items-center"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">How to use this QR Code:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Print it on business cards, flyers, or marketing materials</li>
                    <li>• Display it at trade shows or in your showroom</li>
                    <li>• Share it digitally via email or social media</li>
                    <li>• Add it to vehicle wraps or yard signs</li>
                  </ul>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={() => {
                      const link = document.createElement('a')
                      link.href = qrCodeDataUrl
                      link.download = 'bathroom-remodeling-qr-code.png'
                      link.click()
                    }}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download QR Code
                  </Button>
                  <Button 
                    onClick={() => window.open(qrCodeUrl, '_blank')}
                    variant="outline"
                  >
                    <Link className="h-4 w-4 mr-2" />
                    Preview Landing Page
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Google Calendar Integration */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Google Calendar Integration
            </CardTitle>
            <CardDescription>
              Connect your Google Calendar to automatically create appointments when customers book consultations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Connection Status */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-3 h-3 rounded-full ${isCalendarConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="font-medium">
                    {isCalendarConnected ? 'Google Calendar Connected' : 'Google Calendar Not Connected'}
                  </span>
                  {isCalendarConnected && (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  )}
                </div>

                {isCalendarConnected ? (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">Calendar Integration Active</h4>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>• Appointments are automatically created in your Google Calendar</li>
                      <li>• Customers receive calendar invites with meeting details</li>
                      <li>• Email reminders are sent 24 hours before appointments</li>
                      <li>• Your availability schedule is enforced (Mon-Sat with specific times)</li>
                    </ul>
                  </div>
                ) : (
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <h4 className="font-medium text-amber-900 mb-2">Setup Required</h4>
                    <ul className="text-sm text-amber-800 space-y-1">
                      <li>• Connect your Google Calendar to enable automatic appointment creation</li>
                      <li>• Customers will be able to book directly into your calendar</li>
                      <li>• Your specific availability schedule will be enforced</li>
                      <li>• Both you and customers will receive email confirmations</li>
                    </ul>
                  </div>
                )}

                <div className="mt-4 flex gap-3">
                  {isCalendarConnected ? (
                    <>
                      <Button 
                        onClick={disconnectGoogleCalendar}
                        variant="outline"
                        className="border-red-200 text-red-700 hover:bg-red-50"
                      >
                        <Unlink className="h-4 w-4 mr-2" />
                        Disconnect Calendar
                      </Button>
                      <Button 
                        onClick={connectGoogleCalendar}
                        variant="outline"
                        disabled={calendarConnecting}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        {calendarConnecting ? 'Reconnecting...' : 'Reconnect Calendar'}
                      </Button>
                    </>
                  ) : (
                    <Button 
                      onClick={connectGoogleCalendar}
                      disabled={calendarConnecting}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      {calendarConnecting ? 'Connecting...' : 'Connect Google Calendar'}
                    </Button>
                  )}
                </div>
              </div>

              {/* Schedule Display */}
              <div className="flex-shrink-0 bg-gray-50 p-4 rounded-lg min-w-64">
                <h4 className="font-medium text-gray-900 mb-3">Your Availability Schedule</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monday:</span>
                    <span className="font-medium">10 AM, 2 PM, 6 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tuesday:</span>
                    <span className="font-medium">10 AM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Wednesday:</span>
                    <span className="font-medium">6 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Thursday:</span>
                    <span className="font-medium">10 AM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Friday:</span>
                    <span className="font-medium">6 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Saturday:</span>
                    <span className="font-medium">6 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sunday:</span>
                    <span className="font-medium text-red-600">Closed</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search leads..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="qualified">Qualified</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="converted">Converted</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={exportLeads} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leads Table */}
        <Card>
          <CardHeader>
            <CardTitle>Leads ({filteredLeads.length})</CardTitle>
            <CardDescription>
              Manage and track all your leads
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredLeads.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No leads found</p>
                </div>
              ) : (
                filteredLeads.map((lead, index) => (
                  <motion.div
                    key={lead.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {lead.firstName} {lead.lastName}
                          </h3>
                          <Badge className={getStatusColor(lead.status)}>
                            {getStatusIcon(lead.status)}
                            <span className="ml-1 capitalize">{lead.status}</span>
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-2" />
                            {lead.email}
                          </div>
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-2" />
                            {lead.cellPhone}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2" />
                            {lead.address}
                          </div>
                        </div>

                        {lead.renovateElsewhere && lead.renovateElsewhereDetails && (
                          <div className="mt-2 text-sm text-gray-600">
                            <strong>Additional work:</strong> {lead.renovateElsewhereDetails}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col md:items-end gap-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(lead.createdAt).toLocaleDateString()}
                        </div>
                        
                        <div className="flex gap-2">
                          {lead.availableForConsult && (
                            <Badge variant="outline" className="text-green-700 border-green-200">
                              Available for consult
                            </Badge>
                          )}
                          {lead.decisionMakersAvail && (
                            <Badge variant="outline" className="text-blue-700 border-blue-200">
                              Decision makers ready
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
