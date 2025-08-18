
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create Rob's admin account
  const hashedPassword = await bcrypt.hash('robadmin123', 12)
  
  const robUser = await prisma.user.upsert({
    where: { email: 'rradosta@truenorthkb.com' },
    update: {},
    create: {
      name: 'Rob Radosta',
      email: 'rradosta@truenorthkb.com',
      password: hashedPassword,
      role: 'admin',
    },
  })

  console.log('✅ Created admin user:', robUser.email)

  // Create a few sample leads for testing
  const sampleLead1 = await prisma.lead.create({
    data: {
      firstName: 'Mary',
      lastName: 'Johnson',
      email: 'mary.johnson@email.com',
      cellPhone: '(310) 555-0123',
      address: '123 Main St, Santa Monica, CA 90401',
      ownOrRent: 'own',
      availableForConsult: true,
      decisionMakersAvail: true,
      renovateElsewhere: false,
      status: 'new'
    }
  })

  const sampleLead2 = await prisma.lead.create({
    data: {
      firstName: 'Robert',
      lastName: 'Wilson',
      email: 'bob.wilson@email.com',
      cellPhone: '(818) 555-0456',
      address: '456 Oak Ave, Burbank, CA 91501',
      ownOrRent: 'own',
      availableForConsult: true,
      decisionMakersAvail: false,
      renovateElsewhere: true,
      renovateElsewhereDetails: 'Want to update vanity and flooring too',
      status: 'qualified'
    }
  })

  console.log('✅ Created sample leads for testing')
  console.log('🎉 Seed completed successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
