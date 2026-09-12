import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { ArrowRight, Clock, CheckCircle, XCircle, AlertCircle, Ticket, PlusSquare } from 'lucide-react'

const statusMap: Record<string, { label: string; dot: string; text: string }> = {
  pending:  { label: 'PENDING',    dot: 'bg-white/40',  text: 'text-white/50' },
  approved: { label: 'DISETUJUI', dot: 'bg-white/80',  text: 'text-white/80' },
  rejected: { label: 'DITOLAK',   dot: 'bg-white/20',  text: 'text-white/30' },
  expired:  { label: 'KADALUARSA',dot: 'bg-white/10',  text: 'text-white/20' },
  done:     { label: 'SELESAI',   dot: 'bg-white',     text: 'text-white' },
}

function formatRelative(date: Date) {
  const diff = Date.now() - new Date(date).getTime()
  const h = Math.floor(diff / 3600000)
  const m = Math.floor(diff / 60000)
  if (h >= 24) return `${Math.floor(h / 24)} hari lalu`
  if (h >= 1) return `${h} jam lalu`
  if (m >= 1) return `${m} menit lalu`
  return 'baru saja'
}

function timeLeft(expiredAt: Date) {
  const diff = new Date(expiredAt).getTime() - Date.now()
  if (diff <= 0) return null
  const h = Math.floor(diff / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  return `${h}j ${m}m`
}

export default async function DashboardPage() {
  const session = await auth()
  const userId = session!.user!.id!

  const now = new Date()

  const [tikets, usage] = await Promise.all([
    prisma.tiket.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        balasan: {
          orderBy: { createdAt: 'asc' },
        },
      },
    }),
    prisma.ticketUsage.findUnique({ where: { userId } }),
  ])

  // Hitung kuota
  const kuotaUsed = usage && now < new Date(usage.resetAt) ? usage.count : 0
  const kuotaSisa = Math.max(0, 3 - kuotaUsed)
  const resetAt = usage && now < new Date(usage.resetAt) ? usage.resetAt : null

  function sisaWaktuReset(date: Date) {
    const diff = new Date(date).getTime() - now.getTime()
    const h = Math.floor(diff / 3600000)
    return `${h} jam`
  }

  const stats = {
    total: tikets.length,
    pending: tikets.filter(t => t.status === 'pending').length,
    approved: tikets.filter(t => t.status === 'approved').length,
    done: tikets.filter(t => t.status === 'done').length,
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-4">
        <div>
          <span className="text-[10px] tracking-[0.3em] text-white/20 uppercase">Dashboard</span>
          <h1 className="text-3xl font-black uppercase tracking-tight mt-1">
            Halo, {session!.user!.name?.split(' ')[0]}.
          </h1>
        </div>
        <Link
          href="/dashboard/buat"
          className="group inline-flex items-center gap-2 bg-white text-black text-xs font-bold uppercase tracking-wider px-5 py-3 hover:bg-white/80 transition-colors"
        >
          <PlusSquare className="w-3.5 h-3.5" />
          Buat Tiket
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Kuota */}
      <div className="border border-white/[0.07] bg-[#0a0a0a] p-6">
        <div className="flex items-center justify-between mb-5">
          <span className="text-[10px] tracking-[0.3em] text-white/25 uppercase">Kuota Tiket</span>
          {resetAt && (
            <span className="text-[10px] text-white/20">Reset dalam {sisaWaktuReset(new Date(resetAt))}</span>
          )}
        </div>
        <div className="flex gap-2 mb-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 transition-all ${i < kuotaUsed ? 'bg-white/70' : 'bg-white/10'}`}
            />
          ))}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-black text-white">{kuotaSisa}</span>
          <span className="text-xs text-white/25">tiket tersisa dari 3</span>
        </div>
        {kuotaSisa === 0 && resetAt && (
          <p className="text-xs text-white/30 mt-3 border-t border-white/[0.05] pt-3">
            Kuota habis. Akan reset dalam {sisaWaktuReset(new Date(resetAt))}.
          </p>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.05]">
        {[
          { label: 'Total Tiket', val: stats.total, icon: <Ticket className="w-4 h-4" /> },
          { label: 'Pending', val: stats.pending, icon: <Clock className="w-4 h-4" /> },
          { label: 'Disetujui', val: stats.approved, icon: <CheckCircle className="w-4 h-4" /> },
          { label: 'Selesai', val: stats.done, icon: <AlertCircle className="w-4 h-4" /> },
        ].map((s) => (
          <div key={s.label} className="bg-[#0c0c0c] px-6 py-5">
            <div className="text-white/20 mb-3">{s.icon}</div>
            <div className="text-3xl font-black text-white">{s.val}</div>
            <div className="text-[10px] tracking-[0.2em] text-white/20 uppercase mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tiket list */}
      <div>
        <div className="flex items-center gap-4 mb-6">
          <span className="text-[10px] tracking-[0.3em] text-white/20 uppercase">Riwayat Tiket</span>
          <div className="h-px flex-1 bg-white/[0.05]" />
        </div>

        {tikets.length === 0 ? (
          <div className="border border-white/[0.06] bg-[#0a0a0a] py-16 text-center">
            <XCircle className="w-8 h-8 text-white/10 mx-auto mb-3" />
            <p className="text-sm text-white/20">Belum ada tiket.</p>
            <Link href="/dashboard/buat" className="inline-block mt-4 text-xs text-white underline underline-offset-4 opacity-40 hover:opacity-70 transition-opacity">
              Buat tiket pertama kamu
            </Link>
          </div>
        ) : (
          <div className="border border-white/[0.06] bg-[#0a0a0a] divide-y divide-white/[0.04]">
            {tikets.map((tiket) => {
              const st = statusMap[tiket.status] || statusMap.pending
              const sisa = tiket.status === 'pending' ? timeLeft(tiket.expiredAt) : null
              const hasBalasan = (tiket.status === 'approved' && tiket.pesanApprove) ||
                                 (tiket.status === 'rejected' && tiket.alasanReject)
              return (
                <div key={tiket.id} className="px-6 py-5 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white/80 truncate">{tiket.judul}</div>
                      <div className="text-xs text-white/25 mt-1 line-clamp-1">{tiket.deskripsi}</div>
                      <div className="text-[10px] text-white/15 mt-2">{formatRelative(tiket.createdAt)}</div>
                    </div>
                    <div className="shrink-0 flex flex-col items-end gap-1.5">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                        <span className={`text-[10px] tracking-[0.15em] ${st.text}`}>{st.label}</span>
                      </div>
                      {sisa && (
                        <span className="text-[10px] text-white/15">⏱ {sisa}</span>
                      )}
                    </div>
                  </div>

                  {/* Balasan admin */}
                  {hasBalasan && (
                    <div className={`mt-3 border-l-2 pl-4 py-2 ${
                      tiket.status === 'approved'
                        ? 'border-white/30 bg-white/[0.03]'
                        : 'border-white/10 bg-white/[0.02]'
                    }`}>
                      <div className="text-[10px] tracking-[0.2em] uppercase mb-1 ${
                        tiket.status === 'approved' ? 'text-white/30' : 'text-white/20'
                      }">
                        {tiket.status === 'approved' ? (
                          <span className="text-white/40">✓ Balasan Admin</span>
                        ) : (
                          <span className="text-white/25">✕ Alasan Penolakan</span>
                        )}
                      </div>
                      <p className={`text-xs leading-relaxed ${
                        tiket.status === 'approved' ? 'text-white/60' : 'text-white/35'
                      }`}>
                        {tiket.status === 'approved' ? tiket.pesanApprove : tiket.alasanReject}
                      </p>
                    </div>
                  )}

                  {/* Thread balasan admin */}
                  {tiket.balasan.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <div className="text-[10px] tracking-[0.2em] text-white/25 uppercase">
                        Pesan dari Admin ({tiket.balasan.length})
                      </div>
                      {tiket.balasan.map((b) => (
                        <div key={b.id} className="border-l-2 border-indigo-500/40 pl-3 py-1.5 bg-indigo-500/5">
                          <p className="text-xs text-white/60 leading-relaxed">{b.pesan}</p>
                          <p className="text-[10px] text-white/20 mt-1">
                            {new Date(b.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
