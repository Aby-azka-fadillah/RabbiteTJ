'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, Check, X, Loader2, ChevronLeft, ChevronRight, Trash2, MessageSquare, Send, ArrowLeft } from 'lucide-react'
import { formatDistanceToNow, format } from 'date-fns'
import { id } from 'date-fns/locale'

type Tiket = {
  id: string
  judul: string
  deskripsi: string
  status: string
  alasanReject: string | null
  pesanApprove: string | null
  expiredAt: string
  createdAt: string
  user: { id: string; name: string; email: string }
}

type Balasan = {
  id: string
  tiketId: string
  pesan: string
  createdAt: string
}

const statusConfig: Record<string, { label: string; className: string }> = {
  pending:  { label: 'Pending',     className: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
  approved: { label: 'Disetujui',   className: 'bg-green-500/10 text-green-400 border-green-500/20' },
  rejected: { label: 'Ditolak',     className: 'bg-red-500/10 text-red-400 border-red-500/20' },
  expired:  { label: 'Kadaluarsa',  className: 'bg-gray-500/10 text-gray-400 border-gray-500/20' },
  done:     { label: 'Selesai',     className: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
}

// ─── Panel Detail + Balas ───────────────────────────────────────────────────
function TiketDetailPanel({
  tiket,
  onClose,
  onActionDone,
}: {
  tiket: Tiket
  onClose: () => void
  onActionDone: () => void
}) {
  const [balasan, setBalasan] = useState<Balasan[]>([])
  const [pesan, setPesan] = useState('')
  const [sending, setSending] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  // Modal approve/reject
  const [showApprove, setShowApprove] = useState(false)
  const [showReject, setShowReject] = useState(false)
  const [pesanApprove, setPesanApprove] = useState('')
  const [alasanReject, setAlasanReject] = useState('')

  const fetchBalasan = useCallback(async () => {
    const res = await fetch(`/api/admin/tikets/${tiket.id}/balas`)
    const data = await res.json()
    setBalasan(data)
  }, [tiket.id])

  useEffect(() => { fetchBalasan() }, [fetchBalasan])

  const handleKirimBalasan = async () => {
    if (!pesan.trim()) return
    setSending(true)
    await fetch(`/api/admin/tikets/${tiket.id}/balas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pesan }),
    })
    setPesan('')
    await fetchBalasan()
    setSending(false)
  }

  const handleAction = async (status: string, alasan?: string, approve?: string) => {
    setActionLoading(true)
    await fetch(`/api/admin/tikets/${tiket.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, alasanReject: alasan, pesanApprove: approve }),
    })
    setActionLoading(false)
    setShowApprove(false)
    setShowReject(false)
    onActionDone()
    onClose()
  }

  const isExpired = tiket.status === 'pending' && new Date(tiket.expiredAt) < new Date()
  const status = statusConfig[tiket.status] || statusConfig.pending

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="text-gray-400 hover:text-white transition">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="font-semibold text-white text-sm line-clamp-1">{tiket.judul}</h2>
              <p className="text-xs text-gray-500">{tiket.user.name} · {tiket.user.email}</p>
            </div>
          </div>
          <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${isExpired ? statusConfig.expired.className : status.className}`}>
            {isExpired ? 'Kadaluarsa' : status.label}
          </span>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">

          {/* Info tiket */}
          <div className="px-6 py-4 border-b border-gray-800/50 bg-gray-800/20">
            <p className="text-sm text-gray-300 leading-relaxed">{tiket.deskripsi}</p>
            <p className="text-xs text-gray-500 mt-2">
              Dibuat {formatDistanceToNow(new Date(tiket.createdAt), { addSuffix: true, locale: id })}
            </p>
            {tiket.pesanApprove && (
              <div className="mt-3 text-xs text-green-400 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">
                ✓ Disetujui dengan pesan: {tiket.pesanApprove}
              </div>
            )}
            {tiket.alasanReject && (
              <div className="mt-3 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                ✕ Ditolak: {tiket.alasanReject}
              </div>
            )}
          </div>

          {/* Aksi approve/reject jika masih pending */}
          {tiket.status === 'pending' && !isExpired && (
            <div className="px-6 py-3 border-b border-gray-800/50 flex gap-2">
              <button
                onClick={() => setShowApprove(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 text-xs font-medium rounded-lg transition"
              >
                <Check className="w-3.5 h-3.5" /> Setujui
              </button>
              <button
                onClick={() => setShowReject(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium rounded-lg transition"
              >
                <X className="w-3.5 h-3.5" /> Tolak
              </button>
            </div>
          )}

          {tiket.status === 'approved' && (
            <div className="px-6 py-3 border-b border-gray-800/50">
              <button
                onClick={() => handleAction('done')}
                disabled={actionLoading}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-xs font-medium rounded-lg transition"
              >
                {actionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                Tandai Selesai
              </button>
            </div>
          )}

          {/* Thread balasan */}
          <div className="px-6 py-4 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <MessageSquare className="w-3.5 h-3.5 text-gray-500" />
              <span className="text-xs text-gray-500 uppercase tracking-wider">Balasan Admin</span>
              <span className="text-xs text-gray-600">({balasan.length})</span>
            </div>

            {balasan.length === 0 ? (
              <p className="text-xs text-gray-600 italic py-4 text-center">Belum ada balasan. Kirim pesan pertama.</p>
            ) : (
              balasan.map((b) => (
                <div key={b.id} className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl px-4 py-3">
                  <p className="text-sm text-white/80 leading-relaxed">{b.pesan}</p>
                  <p className="text-[10px] text-gray-500 mt-1.5">
                    {format(new Date(b.createdAt), 'dd MMM yyyy, HH:mm', { locale: id })}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Form kirim balasan */}
        <div className="px-6 py-4 border-t border-gray-800 shrink-0">
          <div className="flex gap-2">
            <textarea
              value={pesan}
              onChange={(e) => setPesan(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleKirimBalasan()
                }
              }}
              placeholder="Tulis balasan ke user... (Enter untuk kirim)"
              rows={2}
              className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
            <button
              onClick={handleKirimBalasan}
              disabled={sending || !pesan.trim()}
              className="px-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl transition flex items-center justify-center"
            >
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Modal Approve */}
      {showApprove && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4 z-10">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-white mb-1">Setujui Tiket</h3>
            <p className="text-sm text-gray-400 mb-4">{tiket.judul}</p>
            <textarea
              value={pesanApprove}
              onChange={(e) => setPesanApprove(e.target.value)}
              placeholder="Tulis pesan untuk user (opsional)..."
              rows={3}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none mb-4"
            />
            <div className="flex gap-3">
              <button onClick={() => setShowApprove(false)} className="flex-1 py-2.5 bg-gray-800 hover:bg-gray-700 text-white text-sm rounded-lg transition">Batal</button>
              <button
                onClick={() => handleAction('approved', undefined, pesanApprove || undefined)}
                disabled={actionLoading}
                className="flex-1 py-2.5 bg-green-600 hover:bg-green-500 text-white text-sm font-medium rounded-lg transition flex items-center justify-center gap-2"
              >
                {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                Setujui
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Reject */}
      {showReject && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4 z-10">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-white mb-1">Tolak Tiket</h3>
            <p className="text-sm text-gray-400 mb-4">{tiket.judul}</p>
            <textarea
              value={alasanReject}
              onChange={(e) => setAlasanReject(e.target.value)}
              placeholder="Alasan penolakan (opsional)..."
              rows={3}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none mb-4"
            />
            <div className="flex gap-3">
              <button onClick={() => setShowReject(false)} className="flex-1 py-2.5 bg-gray-800 hover:bg-gray-700 text-white text-sm rounded-lg transition">Batal</button>
              <button
                onClick={() => handleAction('rejected', alasanReject || undefined)}
                disabled={actionLoading}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white text-sm font-medium rounded-lg transition"
              >
                Tolak
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main TiketTable ────────────────────────────────────────────────────────
export default function TiketTable() {
  const [tikets, setTikets] = useState<Tiket[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [selectedTiket, setSelectedTiket] = useState<Tiket | null>(null)
  const limit = 10

  const fetchTikets = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      status: statusFilter,
      search,
    })
    const res = await fetch(`/api/admin/tikets?${params}`)
    const data = await res.json()
    setTikets(data.tikets)
    setTotal(data.total)
    setLoading(false)
  }, [page, search, statusFilter])

  useEffect(() => { fetchTikets() }, [fetchTikets])

  const handleDelete = async (tiketId: string) => {
    if (!confirm('Yakin hapus tiket ini?')) return
    setActionLoading(tiketId)
    await fetch(`/api/admin/tikets/${tiketId}`, { method: 'DELETE' })
    setActionLoading(null)
    fetchTikets()
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <>
      {/* Filters */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            placeholder="Cari tiket, user..."
            className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
          className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">Semua Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Disetujui</option>
          <option value="rejected">Ditolak</option>
          <option value="expired">Kadaluarsa</option>
          <option value="done">Selesai</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
          </div>
        ) : tikets.length === 0 ? (
          <div className="p-12 text-center text-gray-500">Tidak ada tiket ditemukan</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-5 py-3">Tiket</th>
                  <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-5 py-3">User</th>
                  <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-5 py-3">Status</th>
                  <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-5 py-3">Waktu</th>
                  <th className="text-right text-xs font-medium text-gray-400 uppercase tracking-wider px-5 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {tikets.map((tiket) => {
                  const status = statusConfig[tiket.status] || statusConfig.pending
                  const isExpired = tiket.status === 'pending' && new Date(tiket.expiredAt) < new Date()
                  return (
                    <tr
                      key={tiket.id}
                      className="hover:bg-gray-800/50 transition cursor-pointer"
                      onClick={() => setSelectedTiket(tiket)}
                    >
                      <td className="px-5 py-4">
                        <div className="font-medium text-white text-sm">{tiket.judul}</div>
                        <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">{tiket.deskripsi}</div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="text-sm text-white">{tiket.user.name}</div>
                        <div className="text-xs text-gray-500">{tiket.user.email}</div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${isExpired ? statusConfig.expired.className : status.className}`}>
                          {isExpired ? 'Kadaluarsa' : status.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-gray-400">
                        {formatDistanceToNow(new Date(tiket.createdAt), { addSuffix: true, locale: id })}
                      </td>
                      <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedTiket(tiket)}
                            className="p-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-lg transition"
                            title="Balas / Detail"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(tiket.id)}
                            disabled={actionLoading === tiket.id}
                            className="p-1.5 bg-gray-500/10 hover:bg-red-500/10 text-gray-400 hover:text-red-400 rounded-lg transition"
                            title="Hapus"
                          >
                            {actionLoading === tiket.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-gray-800">
            <span className="text-sm text-gray-400">{total} tiket total</span>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 text-gray-400 hover:text-white disabled:opacity-30 transition">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-gray-400">{page} / {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-1.5 text-gray-400 hover:text-white disabled:opacity-30 transition">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Panel detail + balas */}
      {selectedTiket && (
        <TiketDetailPanel
          tiket={selectedTiket}
          onClose={() => setSelectedTiket(null)}
          onActionDone={fetchTikets}
        />
      )}
    </>
  )
}
