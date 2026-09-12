import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const body = await req.json()
  const { status, alasanReject, pesanApprove } = body

  if (!['approved', 'rejected', 'done'].includes(status)) {
    return NextResponse.json({ error: 'Status tidak valid' }, { status: 400 })
  }

  const tiket = await prisma.tiket.update({
    where: { id },
    data: {
      status,
      alasanReject: status === 'rejected' ? alasanReject : null,
      pesanApprove: status === 'approved' ? pesanApprove : null,
    },
    include: { user: { select: { id: true, name: true, email: true } } },
  })

  return NextResponse.json(tiket)
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  await prisma.tiket.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
