
require('dotenv').config()
const { PrismaClient } = require('@prisma/client')

async function checkBookings() {
  const prisma = new PrismaClient()
  
  try {
    console.log('📅 Current bookings in database:')
    const bookings = await prisma.booking.findMany({
      include: {
        lead: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      orderBy: {
        scheduledAt: 'asc'
      }
    })
    
    if (bookings.length === 0) {
      console.log('No bookings found.')
    } else {
      bookings.forEach(booking => {
        console.log(`- ${booking.id}: ${booking.lead.firstName} ${booking.lead.lastName} on ${booking.scheduledAt} (${booking.status})`)
      })
    }
    
    console.log('\n📊 Leads in database:')
    const leads = await prisma.lead.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        status: true
      }
    })
    
    leads.forEach(lead => {
      console.log(`- ${lead.id}: ${lead.firstName} ${lead.lastName} (${lead.email}) - Status: ${lead.status}`)
    })
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkBookings()
