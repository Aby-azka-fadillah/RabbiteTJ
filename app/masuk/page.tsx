'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react'

function MasukForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')

  useEffect(() => {
    if (searchParams.get('registered')) setInfo('Akun berhasil dibuat. Silakan masuk.')
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const result = await signIn('credentials', {
      email: form.email,
      password: form.password,
      role: 'user',
      redirect: false,
    })
    if (result?.error) {
      setError('Email atau password salah.')
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="w-full max-w-sm">
      {/* Mobile logo */}
      <Link href="/" className="lg:hidden flex items-center gap-2 mb-12 hover:opacity-50 transition-opacity">
        <div className="w-6 h-6 rounded-full overflow-hidden shrink-0">
          <img src="/Foto.jpeg" alt="Rabbit TJ" className="object-cover w-full h-full" />
        </div>
        <span className="text-sm font-black text-white uppercase tracking-tight">
          Rabbit<span className="text-white/25">TJ</span>
        </span>
      </Link>

      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-5 h-px bg-white/25" />
          <span className="text-[10px] tracking-[0.3em] text-white/25 uppercase">Login Akun</span>
        </div>
        <h1 className="text-4xl font-black uppercase tracking-tight leading-none">
          <span className="block text-white">SELAMAT</span>
          <span
            className="block"
            style={{ WebkitTextStroke: '1px rgba(255,255,255,0.15)', color: 'transparent' }}
          >
            DATANG
          </span>
        </h1>
        <p className="text-white/25 text-xs mt-4">
          Belum punya akun?{' '}
          <Link href="/daftar" className="text-white/50 underline underline-offset-4 hover:text-white transition-colors">
            Daftar gratis
          </Link>
        </p>
      </div>

      {/* Info / Error */}
      {info && (
        <div className="mb-6 border-l-2 border-white/30 pl-4 py-1">
          <p className="text-xs text-white/40">{info}</p>
        </div>
      )}
      {error && (
        <div className="mb-6 border-l-2 border-white/40 pl-4 py-1">
          <p className="text-xs text-white/50">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-[10px] tracking-[0.25em] text-white/25 uppercase mb-2">
            Email
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            placeholder="kamu@email.com"
            className="w-full bg-transparent border-b border-white/10 hover:border-white/25 focus:border-white/50 outline-none pb-3 text-sm text-white placeholder-white/15 transition-colors"
          />
        </div>

        <div>
          <label className="block text-[10px] tracking-[0.25em] text-white/25 uppercase mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              placeholder="••••••••"
              className="w-full bg-transparent border-b border-white/10 hover:border-white/25 focus:border-white/50 outline-none pb-3 pr-10 text-sm text-white placeholder-white/15 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-0 bottom-3 text-white/20 hover:text-white/50 transition-colors"
            >
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="group w-full flex items-center justify-between bg-white text-black font-bold text-xs uppercase tracking-[0.2em] px-6 py-4 hover:bg-white/85 disabled:opacity-40 transition-colors"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin mx-auto" />
            ) : (
              <>
                <span>Masuk</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      </form>

      <div className="mt-10 pt-8 border-t border-white/[0.05]">
        <p className="text-[10px] text-white/15 text-center">
          Login sebagai admin?{' '}
          <Link href="/login" className="text-white/25 underline underline-offset-4 hover:text-white/50 transition-colors">
            Admin Panel
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function MasukPage() {
  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white flex overflow-hidden">
      {/* Grain */}
      <div
        className="pointer-events-none fixed inset-0 z-[1] opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px',
        }}
      />

      {/* ── Panel kiri ── */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] shrink-0 relative overflow-hidden bg-[#080808] border-r border-white/[0.05]">
        {/* Grid lines */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Stars */}
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: i % 5 === 0 ? 2 : 1,
              height: i % 5 === 0 ? 2 : 1,
              top: `${(i * 23 + 7) % 100}%`,
              left: `${(i * 31 + 13) % 100}%`,
              opacity: 0.05 + (i % 5) * 0.07,
            }}
          />
        ))}

        {/* Planet besar */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-52 h-52 rounded-full border border-white/[0.06]"
          style={{
            background: 'radial-gradient(circle at 30% 25%, #181820, #050508)',
            boxShadow: 'inset -20px -20px 40px rgba(0,0,0,0.95), 0 0 80px rgba(0,0,0,0.5)',
          }}
        >
          <div className="absolute top-10 left-12 w-6 h-6 rounded-full bg-black/60 border border-white/[0.03]" />
          <div className="absolute bottom-14 right-10 w-4 h-4 rounded-full bg-black/60 border border-white/[0.03]" />
          <div className="absolute top-20 right-16 w-2 h-2 rounded-full bg-black/60 border border-white/[0.03]" />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-white/[0.06] rounded-full rotate-[15deg]"
            style={{ width: '155%', height: '22%' }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 p-12">
          <Link href="/" className="flex items-center gap-2 hover:opacity-50 transition-opacity">
            <div className="w-6 h-6 rounded-full overflow-hidden shrink-0">
              <img src="/Foto.jpeg" alt="Rabbit TJ" className="object-cover w-full h-full" />
            </div>
            <span className="text-sm font-black text-white uppercase tracking-tight">
              Rabbit<span className="text-white/25">TJ</span>
            </span>
          </Link>
        </div>

        <div className="relative z-10 p-12">
          <h2 className="text-6xl font-black uppercase leading-none tracking-tight">
            <span className="block text-white">KEMBALI</span>
            <span
              className="block"
              style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.15)', color: 'transparent' }}
            >
              LAGI.
            </span>
          </h2>
          <p className="text-xs text-white/25 leading-relaxed mt-6 max-w-xs">
            Pantau tiket kamu, lihat statusnya, dan buat yang baru langsung dari dashboard.
          </p>
        </div>

        <div className="relative z-10 p-12">
          <div className="text-[10px] text-white/10 tracking-[0.3em] uppercase">© 2026 RabbitTJ</div>
        </div>
      </div>

      {/* ── Form kanan ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-16 relative z-10">
        <Suspense>
          <MasukForm />
        </Suspense>
      </div>
    </div>
  )
}
