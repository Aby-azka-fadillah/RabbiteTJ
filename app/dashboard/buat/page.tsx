'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Loader2, AlertTriangle } from 'lucide-react'

export default function BuatTiketPage() {
  const router = useRouter()
  const [form, setForm] = useState({ judul: '', deskripsi: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [kuota, setKuota] = useState<{ used: number; limit: number; resetAt: string | null } | null>(null)

  useEffect(() => {
    fetch('/api/tiket/kuota')
      .then(r => r.json())
      .then(setKuota)
  }, [])

  const sisaKuota = kuota ? kuota.limit - kuota.used : null
  const kuotaHabis = sisaKuota !== null && sisaKuota <= 0

  function sisaWaktuReset(dateStr: string) {
    const diff = new Date(dateStr).getTime() - Date.now()
    const h = Math.floor(diff / 3600000)
    const m = Math.floor((diff % 3600000) / 60000)
    return `${h} jam ${m} menit`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.judul.trim() || !form.deskripsi.trim()) {
      setError('Judul dan deskripsi wajib diisi.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/tiket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Gagal membuat tiket.')
        setLoading(false)
        return
      }
      router.push('/dashboard?created=1')
    } catch {
      setError('Terjadi kesalahan. Coba lagi.')
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 pt-4">
      {/* Header */}
      <div>
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-[11px] text-white/25 hover:text-white/50 transition-colors tracking-[0.15em] uppercase mb-6">
          <ArrowLeft className="w-3 h-3" /> Kembali
        </Link>
        <span className="block text-[10px] tracking-[0.3em] text-white/20 uppercase mb-1">Buat Tiket Baru</span>
        <h1 className="text-3xl font-black uppercase tracking-tight">Ajukan Jasa</h1>
      </div>

      {/* Kuota info */}
      {kuota && (
        <div className={`border px-5 py-4 flex items-start gap-3 ${kuotaHabis ? 'border-white/20 bg-white/[0.02]' : 'border-white/[0.06] bg-[#0a0a0a]'}`}>
          {kuotaHabis && <AlertTriangle className="w-4 h-4 text-white/40 shrink-0 mt-0.5" />}
          <div>
            <div className="text-xs font-medium text-white/60">
              {kuotaHabis
                ? 'Kuota habis'
                : `Sisa kuota: ${sisaKuota} dari ${kuota.limit} tiket`}
            </div>
            {kuota.resetAt && (
              <div className="text-[10px] text-white/25 mt-1">
                {kuotaHabis
                  ? `Reset dalam ${sisaWaktuReset(kuota.resetAt)}`
                  : `Reset dalam ${sisaWaktuReset(kuota.resetAt)}`}
              </div>
            )}
          </div>
        </div>
      )}

      {kuotaHabis ? (
        <div className="border border-white/[0.06] bg-[#0a0a0a] py-14 text-center">
          <p className="text-sm text-white/30">Kuota tiket kamu sudah habis.</p>
          <p className="text-xs text-white/15 mt-2">
            {kuota?.resetAt && `Coba lagi dalam ${sisaWaktuReset(kuota.resetAt)}.`}
          </p>
          <Link href="/dashboard" className="inline-block mt-6 text-xs text-white underline underline-offset-4 opacity-40 hover:opacity-70 transition-opacity">
            Kembali ke dashboard
          </Link>
        </div>
      ) : (
        <div className="border border-white/[0.06] bg-[#0a0a0a] p-8 md:p-10">
          {error && (
            <div className="mb-6 border border-red-500/30 bg-red-500/5 px-4 py-3 text-xs text-red-400">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] tracking-[0.25em] text-white/35 uppercase mb-3">
                Judul Tiket
              </label>
              <input
                type="text"
                value={form.judul}
                onChange={(e) => setForm({ ...form, judul: e.target.value })}
                required
                maxLength={100}
                placeholder="cth: Perbaikan AC Rumah"
                className="w-full bg-transparent border border-white/10 hover:border-white/20 focus:border-white/40 outline-none px-4 py-3 text-sm text-white placeholder-white/15 transition-colors"
              />
              <div className="text-[10px] text-white/15 mt-1.5 text-right">{form.judul.length}/100</div>
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.25em] text-white/35 uppercase mb-3">
                Deskripsi Kebutuhan
              </label>
              <textarea
                value={form.deskripsi}
                onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                required
                maxLength={500}
                rows={5}
                placeholder="Jelaskan kebutuhan jasa kamu secara detail — lokasi, kondisi, dll."
                className="w-full bg-transparent border border-white/10 hover:border-white/20 focus:border-white/40 outline-none px-4 py-3 text-sm text-white placeholder-white/15 transition-colors resize-none"
              />
              <div className="text-[10px] text-white/15 mt-1.5 text-right">{form.deskripsi.length}/500</div>
            </div>

            <div className="pt-2 border-t border-white/[0.05] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <p className="text-[10px] text-white/15 leading-relaxed">
                Tiket aktif selama 12 jam setelah dibuat.
              </p>
              <button
                type="submit"
                disabled={loading}
                className="shrink-0 flex items-center gap-3 bg-white text-black font-bold text-sm px-8 py-3.5 uppercase tracking-wider hover:bg-white/80 disabled:opacity-50 transition-colors"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <><span>Kirim Tiket</span><ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
