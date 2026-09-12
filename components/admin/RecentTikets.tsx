import { formatDistanceToNow } from 'date-fns'
import { id } from 'date-fns/locale'
import Link from 'next/link'

type TiketWithUser = {
  id: string
  judul: string
  status: string
  createdAt: Date
  user: { name: string; email: string }
}

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
  approved: { label: 'Disetujui', className: 'bg-green-500/10 text-green-400 border-green-500/20' },
  rejected: { label: 'Ditolak', className: 'bg-red-500/10 text-red-400 border-red-500/20' },
  expired: { label: 'Kadaluarsa', className: 'bg-gray-500/10 text-gray-400 border-gray-500/20' },
  done: { label: 'Selesai', className: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
}

export default function RecentTikets({ tikets }: { tikets: TiketWithUser[] }) {
  if (tikets.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">Belum ada tiket masuk</div>
    )
  }

  return (
    <div className="divide-y divide-gray-800">
      {tikets.map((tiket) => {
        const status = statusConfig[tiket.status] || statusConfig.pending
        return (
          <div key={tiket.id} className="flex items-center justify-between p-5 hover:bg-gray-800/50 transition">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{tiket.judul}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {tiket.user.name} · {formatDistanceToNow(new Date(tiket.createdAt), { addSuffix: true, locale: id })}
              </p>
            </div>
            <span className={`ml-4 px-2.5 py-1 text-xs font-medium rounded-full border ${status.className}`}>
              {status.label}
            </span>
          </div>
        )
      })}
      <div className="p-4 text-center">
        <Link href="/admin/tikets" className="text-sm text-indigo-400 hover:text-indigo-300 transition">
          Lihat semua tiket →
        </Link>
      </div>
    </div>
  )
}
