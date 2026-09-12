import Link from 'next/link'
import Navbar from '@/components/public/Navbar'
import {
  Ticket, Zap, Clock, ShieldCheck, ArrowRight,
  CheckCircle, Wrench, Cpu, Hammer, Settings,
  Mail, Phone, MapPin, Share2, MessageCircle, Code2
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white overflow-x-hidden font-sans">
      {/* grain overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-[1] opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px',
        }}
      />

      <Navbar />

      {/* ───────── HERO ───────── */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden px-6 md:px-16 pt-20">
        {/* raw grid lines */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Big blobs */}
        <div className="absolute -top-10 -right-10 w-[420px] h-[420px] rounded-full bg-[#1a1a2e] blur-[80px] opacity-70" />
        <div className="absolute bottom-20 -left-20 w-[300px] h-[300px] rounded-full bg-[#0f0f1a] blur-[60px]" />

        {/* Floating planet — kanan atas */}
        <div className="absolute right-[6%] top-[14%] select-none pointer-events-none">
          <div className="relative w-48 h-48 md:w-64 md:h-64">
            {/* planet body */}
            <div
              className="w-full h-full rounded-full border border-white/10"
              style={{
                background: 'radial-gradient(circle at 35% 35%, #2a2a3a, #0a0a14)',
                boxShadow: '0 0 60px rgba(255,255,255,0.04), inset -20px -20px 40px rgba(0,0,0,0.8)',
              }}
            />
            {/* craters */}
            <div className="absolute top-8 left-10 w-7 h-7 rounded-full bg-[#111] border border-white/5" />
            <div className="absolute bottom-12 right-8 w-4 h-4 rounded-full bg-[#111] border border-white/5" />
            <div className="absolute top-20 right-14 w-3 h-3 rounded-full bg-[#111] border border-white/5" />
            {/* ring */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-white/10 rounded-full rotate-[20deg]"
              style={{ width: '140%', height: '28%' }}
            />
          </div>
        </div>

        {/* Moon kiri bawah */}
        <div className="absolute left-[8%] bottom-[22%] select-none pointer-events-none">
          <div
            className="w-20 h-20 rounded-full border border-white/10"
            style={{
              background: 'radial-gradient(circle at 40% 30%, #2c2c2c, #111)',
              boxShadow: 'inset -8px -8px 20px rgba(0,0,0,0.9)',
            }}
          />
        </div>

        {/* Stars */}
        {[...Array(80)].map((_, i) => {
          const sizes = [1, 1, 1, 1.5, 2]
          const size = sizes[i % sizes.length]
          return (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: size,
                height: size,
                top: `${(i * 17 + 3) % 100}%`,
                left: `${(i * 23 + 7) % 100}%`,
                opacity: 0.08 + (i % 5) * 0.08,
              }}
            />
          )
        })}

        {/* Content */}
        <div className="relative z-10 max-w-5xl">
          {/* Label */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px bg-white/40" />
            <span className="text-xs tracking-[0.3em] text-white/40 uppercase">Platform Layanan IT</span>
          </div>

          {/* Headline — bold, raw */}
          <h1
            className="text-[clamp(3.5rem,10vw,9rem)] font-black leading-[0.9] tracking-tight uppercase"
            style={{ letterSpacing: '-0.02em' }}
          >
            <span className="block text-white">JELAJAHI</span>
            <span
              className="block"
              style={{
                WebkitTextStroke: '1.5px rgba(255,255,255,0.25)',
                color: 'transparent',
              }}
            >
              LAYANAN
            </span>
            <span className="block text-white">KAMI.</span>
          </h1>

          {/* Subtext */}
          <div className="mt-8 max-w-sm ml-2">
            <p className="text-white/40 text-sm leading-relaxed">
              Buat tiket IT dalam hitungan detik. Kami review dan respons
              dalam 12 jam — dijamin transparan.
            </p>
            <p className="text-white/20 text-xs mt-2 italic">— RabbitTJ, 2026</p>
          </div>

          {/* CTA */}
          <div className="flex flex-wrap items-center gap-4 mt-10">
            <Link
              href="/daftar"
              className="group flex items-center gap-3 bg-white text-black font-bold text-sm px-7 py-4 rounded-none hover:bg-white/90 transition-all tracking-wider uppercase"
            >
              Buat Tiket
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/tentang"
              className="text-sm text-white/40 hover:text-white/70 transition underline underline-offset-4 tracking-wider uppercase"
            >
              Pelajari Lebih
            </Link>
          </div>

          {/* Stats — raw style */}
          <div className="flex flex-wrap gap-10 mt-16 pt-10 border-t border-white/[0.06]">
            {[
              { val: '500+', label: 'Tiket selesai' },
              { val: '12j', label: 'Respon tercepat' },
              { val: '98%', label: 'Kepuasan klien' },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-4xl font-black text-white tracking-tight">{s.val}</div>
                <div className="text-xs text-white/30 mt-1 tracking-widest uppercase">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll line */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-20">
          <div className="w-px h-14 bg-white" />
          <span className="text-[9px] tracking-[0.3em] uppercase rotate-90 mt-2 text-white">scroll</span>
        </div>
      </section>

      {/* ───────── CARA BUAT TIKET ───────── */}
      <section className="relative py-28 px-6 md:px-16 border-t border-white/[0.05]">
        <div className="max-w-5xl mx-auto">
          {/* Section label */}
          <div className="flex items-center gap-4 mb-16">
            <span className="text-[10px] tracking-[0.4em] text-white/25 uppercase">001</span>
            <div className="h-px flex-1 bg-white/[0.06]" />
            <span className="text-[10px] tracking-[0.4em] text-white/25 uppercase">Cara Kerja</span>
          </div>

          <h2 className="text-5xl md:text-7xl font-black uppercase leading-none tracking-tight mb-16 text-white">
            Tiga<br />
            <span style={{ WebkitTextStroke: '1px rgba(255,255,255,0.2)', color: 'transparent' }}>
              Langkah
            </span>
          </h2>

          <div className="grid md:grid-cols-3 gap-px bg-white/[0.05]">
            {[
              { n: '01', title: 'Daftar & Login', desc: 'Buat akun gratis. Verifikasi email, lalu masuk ke dashboard kamu.' },
              { n: '02', title: 'Isi Form Tiket', desc: 'Jelaskan kebutuhan IT kamu. Tiket aktif selama 12 jam.' },
              { n: '03', title: 'Tunggu Konfirmasi', desc: 'Kami review. Kamu dapat notifikasi approve atau alasan penolakan.' },
            ].map((item) => (
              <div key={item.n} className="bg-[#0c0c0c] p-8 hover:bg-[#111] transition-colors group">
                <div className="text-6xl font-black text-white/[0.04] mb-6 select-none group-hover:text-white/[0.07] transition-colors">
                  {item.n}
                </div>
                <h3 className="text-lg font-bold text-white mb-3 tracking-tight">{item.title}</h3>
                <p className="text-sm text-white/35 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA Banner */}
          <div className="mt-px bg-white/[0.03] border border-white/[0.06] p-10 md:p-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">
                Siap Mulai?
              </h3>
              <p className="text-white/35 text-sm mt-2">Max 3 tiket per 2 hari. Reset otomatis.</p>
            </div>
            <Link
              href="/daftar"
              className="shrink-0 flex items-center gap-3 border border-white/20 hover:border-white/60 text-white font-bold text-sm px-8 py-4 uppercase tracking-wider transition-all hover:bg-white hover:text-black group"
            >
              Buat Tiket
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ───────── KEUNGGULAN ───────── */}
      <section className="relative py-28 px-6 md:px-16 border-t border-white/[0.05]">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-16">
            <span className="text-[10px] tracking-[0.4em] text-white/25 uppercase">002</span>
            <div className="h-px flex-1 bg-white/[0.06]" />
            <span className="text-[10px] tracking-[0.4em] text-white/25 uppercase">Keunggulan</span>
          </div>

          <h2 className="text-5xl md:text-7xl font-black uppercase leading-none tracking-tight mb-16 text-white">
            Kenapa<br />
            <span style={{ WebkitTextStroke: '1px rgba(255,255,255,0.2)', color: 'transparent' }}>
              Pilih Kami
            </span>
          </h2>

          <div className="grid md:grid-cols-2 gap-px bg-white/[0.05]">
            {[
              { icon: <Zap className="w-4 h-4" />, title: 'Respon 12 Jam', desc: 'Setiap tiket direspons dalam 12 jam. Tidak ada tiket yang diabaikan.' },
              { icon: <ShieldCheck className="w-4 h-4" />, title: 'Transparan', desc: 'Status bisa dipantau real-time. Jika ditolak, ada alasan jelasnya.' },
              { icon: <Clock className="w-4 h-4" />, title: 'Efisien', desc: 'Tidak perlu chat sana-sini. Semua tersimpan rapi di satu dashboard.' },
              { icon: <Wrench className="w-4 h-4" />, title: 'Multi Layanan IT', desc: 'Web, server, database, jaringan, software — semua bisa diajukan dalam satu platform.' },
              { icon: <Cpu className="w-4 h-4" />, title: 'Sistem Modern', desc: 'Dibangun dengan teknologi terkini, cepat dan responsive di semua device.' },
              { icon: <Settings className="w-4 h-4" />, title: 'Kuota Adil', desc: '3 tiket per 2 hari. Reset otomatis — cukup untuk semua kebutuhan.' },
            ].map((f) => (
              <div key={f.title} className="bg-[#0c0c0c] p-8 hover:bg-[#111] transition-colors group flex gap-5">
                <div className="shrink-0 w-8 h-8 flex items-center justify-center border border-white/10 text-white/40 group-hover:border-white/30 group-hover:text-white/70 transition-all">
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm mb-2 tracking-tight">{f.title}</h3>
                  <p className="text-xs text-white/30 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── MANFAAT ───────── */}
      <section className="relative py-28 px-6 md:px-16 border-t border-white/[0.05]">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-16">
            <span className="text-[10px] tracking-[0.4em] text-white/25 uppercase">003</span>
            <div className="h-px flex-1 bg-white/[0.06]" />
            <span className="text-[10px] tracking-[0.4em] text-white/25 uppercase">Manfaat</span>
          </div>

          <div className="grid md:grid-cols-2 gap-20 items-start">
            <div>
              <h2 className="text-5xl md:text-6xl font-black uppercase leading-none tracking-tight text-white">
                Semua<br />Yang<br />
                <span style={{ WebkitTextStroke: '1px rgba(255,255,255,0.2)', color: 'transparent' }}>
                  Kamu Perlu
                </span>
              </h2>
              <p className="text-white/35 text-sm leading-relaxed mt-8 max-w-xs">
                Satu platform untuk semua kebutuhan IT. Tidak perlu ribet, tidak perlu nunggu lama.
              </p>
              <ul className="mt-8 space-y-5">
                {[
                  'Riwayat tiket tersimpan permanen di dashboard',
                  'Notif otomatis saat status tiket berubah',
                  'Kuota 3 tiket per 2 hari — reset sendiri',
                  'Tiket kadaluarsa otomatis setelah 12 jam',
                  'Alasan jelas jika tiket ditolak',
                ].map((item, i) => (
                  <li key={item} className="flex items-start gap-4 text-sm text-white/50 group">
                    <span className="shrink-0 text-[10px] text-white/20 mt-1 tracking-widest">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="group-hover:text-white/70 transition-colors">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/daftar"
                className="inline-flex items-center gap-3 mt-10 border border-white/15 hover:border-white/50 text-white text-sm font-bold px-7 py-4 uppercase tracking-wider transition-all hover:bg-white hover:text-black group"
              >
                Mulai Sekarang
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Mock dashboard — raw look */}
            <div className="border border-white/[0.08] bg-[#0a0a0a]">
              {/* Title bar */}
              <div className="flex items-center gap-2 px-5 py-3 border-b border-white/[0.06]">
                <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                <span className="ml-3 text-[10px] text-white/20 tracking-widest">DASHBOARD — TIKET SAYA</span>
              </div>
              {/* Tiket list */}
              <div className="divide-y divide-white/[0.04]">
                {[
                  { title: 'Bug pada Aplikasi Web', st: 'SELESAI', dot: 'bg-white' },
                  { title: 'Install & Setup Server', st: 'PENDING', dot: 'bg-white/40' },
                  { title: 'Optimasi Database', st: 'DISETUJUI', dot: 'bg-white/70' },
                  { title: 'Recovery Data Laptop', st: 'DITOLAK', dot: 'bg-white/20' },
                ].map((t) => (
                  <div key={t.title} className="flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors">
                    <div>
                      <div className="text-xs font-medium text-white/70">{t.title}</div>
                      <div className="text-[10px] text-white/20 mt-0.5">2 jam yang lalu</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${t.dot}`} />
                      <span className="text-[9px] tracking-[0.15em] text-white/30">{t.st}</span>
                    </div>
                  </div>
                ))}
              </div>
              {/* Quota bar */}
              <div className="px-5 py-4 border-t border-white/[0.06]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] tracking-[0.2em] text-white/20 uppercase">Kuota Tersisa</span>
                  <span className="text-[9px] text-white/30">2/3</span>
                </div>
                <div className="flex gap-1.5">
                  <div className="h-1 flex-1 bg-white/60" />
                  <div className="h-1 flex-1 bg-white/60" />
                  <div className="h-1 flex-1 bg-white/10" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── FOOTER ───────── */}
      <footer className="border-t border-white/[0.06] bg-[#080808]">
        <div className="max-w-5xl mx-auto px-6 md:px-16 py-16">
          <div className="grid md:grid-cols-4 gap-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="text-xl font-black text-white tracking-tight uppercase mb-4">
                Tiket<span className="text-white/30">Jasa</span>
              </div>
              <p className="text-xs text-white/25 leading-relaxed">
                Platform layanan IT digital. Cepat, transparan, terpercaya.
              </p>
              <div className="flex gap-3 mt-6">
                {[Share2, MessageCircle, Code2].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-8 h-8 border border-white/10 flex items-center justify-center text-white/25 hover:text-white hover:border-white/40 transition-all"
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Nav */}
            <div>
              <h4 className="text-[9px] tracking-[0.3em] text-white/25 uppercase mb-5">Navigasi</h4>
              <ul className="space-y-3">
                {[['/', 'Beranda'], ['/tentang', 'Tentang'], ['/masuk', 'Masuk'], ['/daftar', 'Daftar']].map(([href, label]) => (
                  <li key={label}>
                    <Link href={href} className="text-xs text-white/35 hover:text-white transition tracking-wide">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Layanan */}
            <div>
              <h4 className="text-[9px] tracking-[0.3em] text-white/25 uppercase mb-5">Layanan</h4>
              <ul className="space-y-3">
                {['Teknisi AC', 'Instalasi CCTV', 'Service Laptop', 'Pompa Air', 'Instalasi Listrik'].map((l) => (
                  <li key={l}>
                    <span className="text-xs text-white/25 tracking-wide">{l}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Kontak */}
            <div>
              <h4 className="text-[9px] tracking-[0.3em] text-white/25 uppercase mb-5">Kontak</h4>
              <ul className="space-y-3">
                {[
                  [Mail, 'admin@tiketjasa.com'],
                  [Phone, '+62 812-3456-7890'],
                  [MapPin, 'Jakarta, Indonesia'],
                ].map(([Icon, text], i) => (
                  <li key={i} className="flex items-center gap-2.5">
                    {/* @ts-ignore */}
                    <Icon className="w-3 h-3 text-white/25 shrink-0" />
                    <span className="text-xs text-white/25">{text as string}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-14 pt-8 border-t border-white/[0.04] flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-[10px] text-white/15 tracking-widest">© 2026 RABBIT TJ — ALL RIGHTS RESERVED</span>
            <div className="flex gap-6">
              {['Privasi', 'Syarat', 'Bantuan'].map((l) => (
                <a key={l} href="#" className="text-[10px] text-white/15 hover:text-white/40 transition tracking-widest uppercase">
                  {l}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
