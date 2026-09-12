import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import DashboardNav from '@/components/user/DashboardNav'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'user') {
    redirect('/masuk')
  }
  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white">
      <div
        className="pointer-events-none fixed inset-0 z-[1] opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px',
        }}
      />
      <DashboardNav user={session.user} />
      <main className="relative z-10 max-w-5xl mx-auto px-6 md:px-16 py-10">
        {children}
      </main>
    </div>
  )
}
