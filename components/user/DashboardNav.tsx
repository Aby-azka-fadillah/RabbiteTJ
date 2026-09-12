'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { LogOut, LayoutDashboard, PlusSquare } from 'lucide-react'

interface Props {
  user: { name?: string | null; email?: string | null }
}

export default function DashboardNav({ user }: Props) {
  const pathname = usePathname()

  return (
    <header className="relative z-10 border-b border-white/[0.06] bg-[#0a0a0a]">
      <div className="max-w-5xl mx-auto px-6 md:px-16 flex items-center justify-between h-14">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-sm font-black text-white uppercase tracking-tight hover:opacity-60 transition-opacity">
            Tiket<span className="text-white/30">Jasa</span>
          </Link>
          <nav className="hidden sm:flex items-center gap-6">
            <Link
              href="/dashboard"
              className={`text-[11px] tracking-[0.2em] uppercase transition-colors flex items-center gap-1.5 ${pathname === '/dashboard' ? 'text-white' : 'text-white/30 hover:text-white/60'}`}
            >
              <LayoutDashboard className="w-3 h-3" />
              Dashboard
            </Link>
            <Link
              href="/dashboard/buat"
              className={`text-[11px] tracking-[0.2em] uppercase transition-colors flex items-center gap-1.5 ${pathname === '/dashboard/buat' ? 'text-white' : 'text-white/30 hover:text-white/60'}`}
            >
              <PlusSquare className="w-3 h-3" />
              Buat Tiket
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-5">
          <span className="hidden sm:block text-[11px] text-white/25 truncate max-w-[160px]">{user.name}</span>
          <button
            onClick={() => signOut({ callbackUrl: '/masuk' })}
            className="flex items-center gap-1.5 text-[11px] tracking-[0.15em] uppercase text-white/25 hover:text-white/60 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Keluar
          </button>
        </div>
      </div>
    </header>
  )
}
