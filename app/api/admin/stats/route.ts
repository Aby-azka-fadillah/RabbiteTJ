import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET() {
  const session = await auth()
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const [totalUsers, totalTikets, pendingTikets, approvedTikets, rejectedTikets, expiredTikets] = await Promise.all([
    prisma.user.count({ where: { role: 'user' } }),
    prisma.tiket.count(),
    prisma.tiket.count({ where: { status: 'pending' } }),
    prisma.tiket.count({ where: { status: 'approved' } }),
    prisma.tiket.count({ where: { status: 'rejected' } }),
    prisma.tiket.count({ where: { status: 'expired' } }),
  ])

  // Tiket hari ini
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tiketsToday = await prisma.tiket.count({
    where: { createdAt: { gte: today } },
  })

  return NextResponse.json({
    totalUsers,
    totalTikets,
    pendingTikets,
    approvedTikets,
    rejectedTikets,
    expiredTikets,
    tiketsToday,
  })
}
