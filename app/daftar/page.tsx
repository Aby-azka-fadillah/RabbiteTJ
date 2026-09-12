'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react'

export default function DaftarPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirm) { setError('Password tidak cocok.'); return }
    if (form.password.length < 6) { setError('Password minimal 6 karakter.'); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Gagal mendaftar.'); setLoading(false); return }
      router.push('/masuk?registered=1')
    } catch {
      setError('Terjadi kesalahan. Coba lagi.')
      setLoading(false)
    }
  }

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
              width: i % 4 === 0 ? 2 : 1,
              height: i % 4 === 0 ? 2 : 1,
              top: `${(i * 19 + 5) % 100}%`,
              left: `${(i * 27 + 11) % 100}%`,
              opacity: 0.05 + (i % 6) * 0.06,
            }}
          />
        ))}

        {/* Planet */}
        <div className="absolute right-12 top-1/4 w-40 h-40 rounded-full border border-white/[0.06]"
          style={{
            background: 'radial-gradient(circle at 35% 30%, #1a1a2a, #060608)',
            boxShadow: 'inset -15px -15px 30px rgba(0,0,0,0.9)',
          }}
        >
          <div className="absolute top-6 left-8 w-5 h-5 rounded-full bg-[#0a0a0a] border border-white/[0.04]" />
          <div className="absolute bottom-8 right-6 w-3 h-3 rounded-full bg-[#0a0a0a] border border-white/[0.04]" />
          {/* Ring */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-white/[0.07] rounded-full rotate-[20deg]"
            style={{ width: '160%', height: '25%' }}
          />
        </div>

        {/* Moon kecil */}
        <div className="absolute left-16 bottom-1/3 w-12 h-12 rounded-full border border-white/[0.05]"
          style={{
            background: 'radial-gradient(circle at 40% 30%, #1e1e1e, #090909)',
            boxShadow: 'inset -6px -6px 15px rgba(0,0,0,0.9)',
          }}
        />

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
            <span className="block text-white">MULAI</span>
            <span
              className="block"
              style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.15)', color: 'transparent' }}
            >
              GRATIS.
            </span>
          </h2>
          <p className="text-xs text-white/25 leading-relaxed mt-6 max-w-xs">
            Daftar dan langsung buat tiket. Tidak ada biaya, tidak ada syarat tersembunyi.
          </p>
          <div className="mt-8 space-y-3">
            {['Riwayat tiket tersimpan permanen', 'Max 3 tiket per 2 hari', 'Notifikasi status real-time'].map((t) => (
              <div key={t} className="flex items-center gap-3 text-[11px] text-white/20">
                <div className="w-px h-3 bg-white/20" />
                {t}
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 p-12">
          <div className="text-[10px] text-white/10 tracking-[0.3em] uppercase">© 2026 RabbitTJ</div>
        </div>
      </div>

      {/* ── Form kanan ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-16 relative z-10">
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
              <span className="text-[10px] tracking-[0.3em] text-white/25 uppercase">Buat Akun</span>
            </div>
            <h1 className="text-4xl font-black uppercase tracking-tight leading-none">
              <span className="block text-white">DAFTAR</span>
              <span
                className="block"
                style={{ WebkitTextStroke: '1px rgba(255,255,255,0.15)', color: 'transparent' }}
              >
                SEKARANG
              </span>
            </h1>
            <p className="text-white/25 text-xs mt-4">
              Sudah punya akun?{' '}
              <Link href="/masuk" className="text-white/50 underline underline-offset-4 hover:text-white transition-colors">
                Masuk di sini
              </Link>
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 border-l-2 border-white/40 pl-4 py-1">
              <p className="text-xs text-white/50">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] tracking-[0.25em] text-white/25 uppercase mb-2">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                placeholder="Budi Santoso"
                className="w-full bg-transparent border-b border-white/10 hover:border-white/25 focus:border-white/50 outline-none pb-3 text-sm text-white placeholder-white/15 transition-colors"
              />
            </div>

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
                  placeholder="Min. 6 karakter"
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

            <div>
              <label className="block text-[10px] tracking-[0.25em] text-white/25 uppercase mb-2">
                Ulangi Password
              </label>
              <input
                type={showPass ? 'text' : 'password'}
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                required
                placeholder="Ulangi password"
                className="w-full bg-transparent border-b border-white/10 hover:border-white/25 focus:border-white/50 outline-none pb-3 text-sm text-white placeholder-white/15 transition-colors"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="group w-full flex items-center justify-between bg-white text-black font-bold text-xs uppercase tracking-[0.2em] px-6 py-4 hover:bg-white/85 disabled:opacity-40 transition-colors"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                ) : (
                  <>
                    <span>Buat Akun</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>

          <p className="text-[10px] text-white/10 mt-8 leading-relaxed">
            Dengan mendaftar kamu menyetujui syarat & ketentuan layanan RabbitTJ.
          </p>
        </div>
      </div>
    </div>
  )
}
