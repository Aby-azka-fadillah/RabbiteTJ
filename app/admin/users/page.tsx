import UserTable from '@/components/admin/UserTable'

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Manajemen User</h1>
        <p className="text-gray-400 mt-1">Kelola semua user terdaftar</p>
      </div>
      <UserTable />
    </div>
  )
}
