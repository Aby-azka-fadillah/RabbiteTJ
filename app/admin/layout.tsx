import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  const ADMIN_EMAIL = 'azkafadillah1107@gmail.com'
  if (!session || !session.user || session.user.role !== 'admin' || session.user.email !== ADMIN_EMAIL) {
    redirect('/login')
  }

  return (
    <div className="flex h-screen bg-gray-950">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader user={session.user} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
