import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const tikets = await prisma.tiket.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(tikets)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = session.user.id
  const now = new Date()

  // Cek kuota: max 3 tiket per 2 hari
  const usage = await prisma.ticketUsage.findUnique({ where: { userId } })

  if (usage) {
    const resetAt = new Date(usage.resetAt)
    if (now < resetAt) {
      // Masih dalam periode 2 hari
      if (usage.count >= 3) {
        const sisaMs = resetAt.getTime() - now.getTime()
        const sisaJam = Math.ceil(sisaMs / (1000 * 60 * 60))
        return NextResponse.json(
          { error: `Kuota habis. Reset dalam ${sisaJam} jam.`, resetAt: usage.resetAt },
          { status: 429 }
        )
      }
      // Increment count
      await prisma.ticketUsage.update({
        where: { userId },
        data: { count: usage.count + 1 },
      })
    } else {
      // Periode sudah lewat, reset
      await prisma.ticketUsage.update({
        where: { userId },
        data: {
          count: 1,
          resetAt: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
        },
      })
    }
  } else {
    // Buat usage baru
    await prisma.ticketUsage.create({
      data: {
        userId,
        count: 1,
        resetAt: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
      },
    })
  }

  const { judul, deskripsi } = await req.json()
  if (!judul || !deskripsi) {
    return NextResponse.json({ error: 'Judul dan deskripsi wajib diisi.' }, { status: 400 })
  }

  const tiket = await prisma.tiket.create({
    data: {
      userId,
      judul,
      deskripsi,
      status: 'pending',
      expiredAt: new Date(now.getTime() + 12 * 60 * 60 * 1000),
    },
  })

  return NextResponse.json(tiket)
}
