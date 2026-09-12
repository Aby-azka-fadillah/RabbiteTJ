import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@tiketjasa.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@tiketjasa.com',
      password: hashedPassword,
      role: 'admin',
    },
  })

  console.log('Admin created:', admin.email)

  // Seed beberapa tiket dummy
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      name: 'Budi Santoso',
      email: 'user@example.com',
      password: await bcrypt.hash('user123', 10),
      role: 'user',
    },
  })

  const user2 = await prisma.user.upsert({
    where: { email: 'siti@example.com' },
    update: {},
    create: {
      name: 'Siti Rahayu',
      email: 'siti@example.com',
      password: await bcrypt.hash('user123', 10),
      role: 'user',
    },
  })

  const now = new Date()
  const expired = new Date(now.getTime() + 12 * 60 * 60 * 1000)

  await prisma.tiket.createMany({
    data: [
      {
        userId: user.id,
        judul: 'Perbaikan AC Rumah',
        deskripsi: 'AC rumah tidak dingin, perlu service dan isi freon.',
        status: 'pending',
        expiredAt: expired,
      },
      {
        userId: user.id,
        judul: 'Install CCTV 4 Kamera',
        deskripsi: 'Mau pasang CCTV di rumah 4 titik, indoor dan outdoor.',
        status: 'approved',
        expiredAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      },
      {
        userId: user2.id,
        judul: 'Servis Laptop Mati Total',
        deskripsi: 'Laptop tiba-tiba mati dan tidak bisa dinyalakan sama sekali.',
        status: 'pending',
        expiredAt: expired,
      },
      {
        userId: user2.id,
        judul: 'Perbaikan Pompa Air',
        deskripsi: 'Pompa air bocor dan tekanan lemah.',
        status: 'rejected',
        alasanReject: 'Diluar jangkauan layanan area.',
        expiredAt: new Date(now.getTime() - 5 * 60 * 60 * 1000),
      },
    ],
  })

  console.log('Seed berhasil!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
