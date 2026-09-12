import { prisma } from '@/lib/prisma'
import { Users, Ticket, Clock, CheckCircle, XCircle, AlertCircle, TrendingUp, Calendar } from 'lucide-react'
import RecentTikets from '@/components/admin/RecentTikets'

async function getStats() {
  const now = new Date()
  const today = new Date(now)
  today.setHours(0, 0, 0, 0)

  const [totalUsers, totalTikets, pendingTikets, approvedTikets, rejectedTikets, expiredTikets, tiketsToday] = await Promise.all([
    prisma.user.count({ where: { role: 'user' } }),
    prisma.tiket.count(),
    prisma.tiket.count({ where: { status: 'pending' } }),
    prisma.tiket.count({ where: { status: 'approved' } }),
    prisma.tiket.count({ where: { status: 'rejected' } }),
    prisma.tiket.count({ where: { status: 'expired' } }),
    prisma.tiket.count({ where: { createdAt: { gte: today } } }),
  ])

  return { totalUsers, totalTikets, pendingTikets, approvedTikets, rejectedTikets, expiredTikets, tiketsToday }
}

async function getRecentTikets() {
  return prisma.tiket.findMany({
    include: { user: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: 'desc' },
    take: 5,
  })
}

export default async function AdminDashboard() {
  const [stats, recentTikets] = await Promise.all([getStats(), getRecentTikets()])

  const statCards = [
    { label: 'Total User', value: stats.totalUsers, icon: Users, color: 'bg-blue-500/10 text-blue-400', border: 'border-blue-500/20' },
    { label: 'Total Tiket', value: stats.totalTikets, icon: Ticket, color: 'bg-purple-500/10 text-purple-400', border: 'border-purple-500/20' },
    { label: 'Tiket Pending', value: stats.pendingTikets, icon: Clock, color: 'bg-yellow-500/10 text-yellow-400', border: 'border-yellow-500/20' },
    { label: 'Disetujui', value: stats.approvedTikets, icon: CheckCircle, color: 'bg-green-500/10 text-green-400', border: 'border-green-500/20' },
    { label: 'Ditolak', value: stats.rejectedTikets, icon: XCircle, color: 'bg-red-500/10 text-red-400', border: 'border-red-500/20' },
    { label: 'Kadaluarsa', value: stats.expiredTikets, icon: AlertCircle, color: 'bg-gray-500/10 text-gray-400', border: 'border-gray-500/20' },
    { label: 'Tiket Hari Ini', value: stats.tiketsToday, icon: Calendar, color: 'bg-indigo-500/10 text-indigo-400', border: 'border-indigo-500/20' },
    { label: 'Tingkat Setuju', value: stats.totalTikets > 0 ? `${Math.round((stats.approvedTikets / stats.totalTikets) * 100)}%` : '0%', icon: TrendingUp, color: 'bg-emerald-500/10 text-emerald-400', border: 'border-emerald-500/20' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1">Ringkasan aktivitas Admin Rabbit</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.label} className={`bg-gray-900 border ${card.border} rounded-xl p-5`}>
              <div className={`inline-flex p-2 rounded-lg ${card.color} mb-3`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-2xl font-bold text-white">{card.value}</div>
              <div className="text-sm text-gray-400 mt-1">{card.label}</div>
            </div>
          )
        })}
      </div>

      {/* Recent Tikets */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl">
        <div className="p-5 border-b border-gray-800">
          <h2 className="text-lg font-semibold text-white">Tiket Terbaru</h2>
        </div>
        <RecentTikets tikets={recentTikets} />
      </div>
    </div>
  )
}
