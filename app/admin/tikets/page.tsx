import TiketTable from '@/components/admin/TiketTable'

export default function AdminTiketsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Manajemen Tiket</h1>
        <p className="text-gray-400 mt-1">Kelola semua tiket yang masuk</p>
      </div>
      <TiketTable />
    </div>
  )
}
