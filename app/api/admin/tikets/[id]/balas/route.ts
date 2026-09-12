import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

// GET — ambil semua balasan tiket
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const balasan = await prisma.balasanTiket.findMany({
    where: { tiketId: id },
    orderBy: { createdAt: 'asc' },
  })

  return NextResponse.json(balasan)
}

// POST — kirim balasan baru
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const { pesan } = await req.json()

  if (!pesan?.trim()) {
    return NextResponse.json({ error: 'Pesan tidak boleh kosong' }, { status: 400 })
  }

  // Pastikan tiket ada
  const tiket = await prisma.tiket.findUnique({ where: { id } })
  if (!tiket) {
    return NextResponse.json({ error: 'Tiket tidak ditemukan' }, { status: 404 })
  }

  const balasan = await prisma.balasanTiket.create({
    data: { tiketId: id, pesan: pesan.trim() },
  })

  return NextResponse.json(balasan, { status: 201 })
}
