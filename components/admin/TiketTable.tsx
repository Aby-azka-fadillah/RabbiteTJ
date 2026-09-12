'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, Check, X, Loader2, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
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

const statusConfig: Record<string, { label: string; className: string }> = {
  pending:  { label: 'Pending',     className: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
  approved: { label: 'Disetujui',   className: 'bg-green-500/10 text-green-400 border-green-500/20' },
  rejected: { label: 'Ditolak',     className: 'bg-red-500/10 text-red-400 border-red-500/20' },
  expired:  { label: 'Kadaluarsa',  className: 'bg-gray-500/10 text-gray-400 border-gray-500/20' },
  done:     { label: 'Selesai',     className: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
}

export default function TiketTable() {
  const [tikets, setTikets] = useState<Tiket[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  // Modal reject
  const [rejectModal, setRejectModal] = useState<{ tiketId: string; judul: string } | null>(null)
  const [alasanReject, setAlasanReject] = useState('')

  // Modal approve
  const [approveModal, setApproveModal] = useState<{ tiketId: string; judul: string } | null>(null)
  const [pesanApprove, setPesanApprove] = useState('')

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

  const handleAction = async (tiketId: string, status: string, alasan?: string, pesan?: string) => {
    setActionLoading(tiketId)
    await fetch(`/api/admin/tikets/${tiketId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, alasanReject: alasan, pesanApprove: pesan }),
    })
    setActionLoading(null)
    setRejectModal(null)
    setAlasanReject('')
    setApproveModal(null)
    setPesanApprove('')
    fetchTikets()
  }

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
                    <tr key={tiket.id} className="hover:bg-gray-800/50 transition">
                      <td className="px-5 py-4">
                        <div className="font-medium text-white text-sm">{tiket.judul}</div>
                        <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">{tiket.deskripsi}</div>
                        {tiket.pesanApprove && (
                          <div className="text-xs text-green-400 mt-0.5">✓ {tiket.pesanApprove}</div>
                        )}
                        {tiket.alasanReject && (
                          <div className="text-xs text-red-400 mt-0.5">✕ {tiket.alasanReject}</div>
                        )}
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
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {tiket.status === 'pending' && !isExpired && (
                            <>
                              <button
                                onClick={() => setApproveModal({ tiketId: tiket.id, judul: tiket.judul })}
                                disabled={actionLoading === tiket.id}
                                className="p-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg transition"
                                title="Setujui"
                              >
                                {actionLoading === tiket.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                              </button>
                              <button
                                onClick={() => setRejectModal({ tiketId: tiket.id, judul: tiket.judul })}
                                disabled={actionLoading === tiket.id}
                                className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition"
                                title="Tolak"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          {tiket.status === 'approved' && (
                            <button
                              onClick={() => handleAction(tiket.id, 'done')}
                              disabled={actionLoading === tiket.id}
                              className="px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-xs rounded-lg transition"
                            >
                              Selesai
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(tiket.id)}
                            disabled={actionLoading === tiket.id}
                            className="p-1.5 bg-gray-500/10 hover:bg-red-500/10 text-gray-400 hover:text-red-400 rounded-lg transition"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
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
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 text-gray-400 hover:text-white disabled:opacity-30 transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-gray-400">{page} / {totalPages}</span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 text-gray-400 hover:text-white disabled:opacity-30 transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Approve */}
      {approveModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-white mb-1">Setujui Tiket</h3>
            <p className="text-sm text-gray-400 mb-4">{approveModal.judul}</p>
            <textarea
              value={pesanApprove}
              onChange={(e) => setPesanApprove(e.target.value)}
              placeholder="Tulis balasan / pesan untuk user (opsional)..."
              rows={3}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => { setApproveModal(null); setPesanApprove('') }}
                className="flex-1 py-2.5 bg-gray-800 hover:bg-gray-700 text-white text-sm rounded-lg transition"
              >
                Batal
              </button>
              <button
                onClick={() => handleAction(approveModal.tiketId, 'approved', undefined, pesanApprove || undefined)}
                disabled={actionLoading === approveModal.tiketId}
                className="flex-1 py-2.5 bg-green-600 hover:bg-green-500 text-white text-sm font-medium rounded-lg transition flex items-center justify-center gap-2"
              >
                {actionLoading === approveModal.tiketId ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Setujui Tiket
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Reject */}
      {rejectModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-white mb-1">Tolak Tiket</h3>
            <p className="text-sm text-gray-400 mb-4">{rejectModal.judul}</p>
            <textarea
              value={alasanReject}
              onChange={(e) => setAlasanReject(e.target.value)}
              placeholder="Alasan penolakan (opsional)..."
              rows={3}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => { setRejectModal(null); setAlasanReject('') }}
                className="flex-1 py-2.5 bg-gray-800 hover:bg-gray-700 text-white text-sm rounded-lg transition"
              >
                Batal
              </button>
              <button
                onClick={() => handleAction(rejectModal.tiketId, 'rejected', alasanReject || undefined)}
                disabled={actionLoading === rejectModal.tiketId}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white text-sm font-medium rounded-lg transition"
              >
                Tolak Tiket
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
