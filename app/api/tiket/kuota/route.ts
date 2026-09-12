import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const now = new Date()
  const usage = await prisma.ticketUsage.findUnique({
    where: { userId: session.user.id },
  })

  if (!usage || now >= new Date(usage.resetAt)) {
    return NextResponse.json({ used: 0, limit: 3, resetAt: null })
  }

  return NextResponse.json({
    used: usage.count,
    limit: 3,
    resetAt: usage.resetAt,
  })
}
