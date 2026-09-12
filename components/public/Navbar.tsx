'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, LogOut } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import Image from 'next/image'

const navLinks = [
  { href: '/', label: 'Beranda' },
  { href: '/tentang', label: 'Tentang' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { data: session } = useSession()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const role = (session?.user as any)?.role

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#0c0c0c]/95 backdrop-blur-sm border-b border-white/[0.05]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-5xl mx-auto px-6 md:px-16 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-70 transition-opacity">
          <div className="w-7 h-7 rounded-full overflow-hidden shrink-0">
            <Image src="/Foto.jpeg" alt="Rabbit TJ" width={28} height={28} className="object-cover w-full h-full" />
          </div>
          <span className="text-sm font-black text-white tracking-tight uppercase">
            Rabbit<span className="text-white/30">TJ</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-[11px] font-medium tracking-[0.2em] uppercase transition-colors ${
                pathname === link.href ? 'text-white' : 'text-white/35 hover:text-white/70'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-3">
          {role === 'user' ? (
            <>
              <Link
                href="/dashboard"
                className="text-[11px] font-bold tracking-[0.2em] uppercase text-black bg-white hover:bg-white/80 px-5 py-2.5 transition-colors"
              >
                Dashboard
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex items-center gap-1.5 text-[11px] font-medium tracking-[0.15em] uppercase text-white/35 hover:text-white/70 border border-white/10 hover:border-white/25 px-3 py-2.5 transition-colors"
                title="Keluar"
              >
                <LogOut className="w-3.5 h-3.5" />
                Keluar
              </button>
            </>
          ) : (
            <>
              <Link
                href="/masuk"
                className="text-[11px] font-medium tracking-[0.2em] uppercase text-white/35 hover:text-white/70 transition-colors"
              >
                Masuk
              </Link>
              <Link
                href="/daftar"
                className="text-[11px] font-bold tracking-[0.2em] uppercase text-black bg-white hover:bg-white/80 px-5 py-2.5 transition-colors"
              >
                Daftar
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-white/40 hover:text-white transition-colors"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#0c0c0c] border-t border-white/[0.05] px-6 py-6 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block text-[11px] font-medium tracking-[0.2em] uppercase text-white/40 hover:text-white transition-colors py-1"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-white/[0.05] flex flex-col gap-3">
            {role === 'user' ? (
              <>
                <Link href="/dashboard" onClick={() => setOpen(false)}
                  className="text-center text-[11px] font-bold tracking-[0.2em] uppercase text-black bg-white py-3">
                  Dashboard
                </Link>
                <button
                  onClick={() => { setOpen(false); signOut({ callbackUrl: '/' }) }}
                  className="flex items-center justify-center gap-2 text-[11px] tracking-[0.2em] uppercase text-white/40 border border-white/10 py-3 hover:border-white/30 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Keluar
                </button>
              </>
            ) : (
              <>
                <Link href="/masuk" onClick={() => setOpen(false)}
                  className="text-center text-[11px] tracking-[0.2em] uppercase text-white/40 border border-white/10 py-3 hover:border-white/30 transition-colors">
                  Masuk
                </Link>
                <Link href="/daftar" onClick={() => setOpen(false)}
                  className="text-center text-[11px] font-bold tracking-[0.2em] uppercase text-black bg-white py-3 hover:bg-white/80 transition-colors">
                  Daftar
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
