import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const pw = await bcrypt.hash('password123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@arip.local' },
    update: {},
    create: { email: 'admin@arip.local', password: pw, role: Role.ADMIN },
  })

  const fsp = await prisma.user.upsert({
    where: { email: 'fsp@arip.local' },
    update: {},
    create: { email: 'fsp@arip.local', password: pw, role: Role.FSP_STAFF },
  })

  const farmerUser = await prisma.user.upsert({
    where: { email: 'farmer@arip.local' },
    update: {},
    create: { email: 'farmer@arip.local', password: pw, role: Role.FARMER },
  })

  const farmer = await prisma.farmer.upsert({
    where: { userId: farmerUser.id },
    update: {},
    create: { userId: farmerUser.id, name: 'Test Farmer', language: 'en' },
  })

  const farm = await prisma.farm.create({
    data: {
      farmerId: farmer.id,
      name: 'Demo Farm',
      location: JSON.stringify({ type: 'Point', coordinates: [32.5825, 0.3476] }), // Kampala approx
    },
  })

  await prisma.creditScore.create({
    data: { farmerId: farmer.id, ari: 60, frl: 55, bonus: 10, total: 125 },
  })

  await prisma.loanApplication.create({ data: { farmerId: farmer.id, amountUGX: 800000 } })

  console.log({ admin: admin.email, fsp: fsp.email, farmer: farmerUser.email, farm: farm.id })
}

main().finally(async () => prisma.$disconnect())
