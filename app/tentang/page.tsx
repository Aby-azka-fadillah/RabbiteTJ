import Navbar from '@/components/public/Navbar'
import Link from 'next/link'
import { ArrowRight, Wrench, Clock, ShieldCheck, Zap } from 'lucide-react'

export default function TentangPage() {
  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white">
      {/* grain */}
      <div
        className="pointer-events-none fixed inset-0 z-[1] opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px',
        }}
      />
      <Navbar />

      {/* Hero */}
      <section className="pt-36 pb-24 px-6 md:px-16 border-b border-white/[0.05]">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-8 h-px bg-white/30" />
            <span className="text-[10px] tracking-[0.35em] text-white/30 uppercase">Tentang Kami</span>
          </div>
          <h1 className="text-[clamp(3rem,8vw,7rem)] font-black uppercase leading-none tracking-tight">
            <span className="block text-white">SIAPA</span>
            <span className="block" style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.2)', color: 'transparent' }}>
              KAMI?
            </span>
          </h1>
          <p className="text-white/35 text-sm leading-relaxed mt-8 max-w-lg">
            RabbitTJ adalah platform pemesanan jasa digital yang memudahkan kamu
            menghubungi teknisi profesional tanpa ribet. Tidak ada chat yang hilang,
            tidak ada janji yang dilupakan — semua tercatat di sistem.
          </p>
        </div>
      </section>

      {/* Cerita */}
      <section className="py-24 px-6 md:px-16 border-b border-white/[0.05]">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          <div>
            <span className="text-[10px] tracking-[0.3em] text-white/20 uppercase">Latar Belakang</span>
            <h2 className="text-4xl font-black uppercase mt-4 mb-6 leading-tight">
              Berawal dari<br />
              <span style={{ WebkitTextStroke: '1px rgba(255,255,255,0.2)', color: 'transparent' }}>
                Masalah Nyata
              </span>
            </h2>
            <div className="space-y-4 text-sm text-white/35 leading-relaxed">
              <p>
                Dulu, kalau butuh teknisi — telfon dulu, nunggu dulu, belum tentu datang.
                Tidak ada bukti komunikasi, tidak ada status yang jelas.
              </p>
              <p>
                Kami bangun RabbitTJ untuk mengubah itu. Satu platform, satu tempat — dari
                pengajuan sampai penyelesaian, semua terdokumentasi.
              </p>
              <p>
                Dengan batas 3 tiket per 2 hari dan masa aktif 12 jam, sistem ini memaksa
                efisiensi dari dua sisi — klien maupun penyedia jasa.
              </p>
            </div>
          </div>
          <div className="border border-white/[0.07] bg-[#0a0a0a] p-8">
            <div className="text-6xl font-black text-white/[0.04] mb-6">—</div>
            <blockquote className="text-lg font-medium text-white/60 leading-relaxed italic">
              "Kami tidak membangun aplikasi — kami membangun kepercayaan antara klien dan teknisi."
            </blockquote>
            <div className="mt-6 pt-6 border-t border-white/[0.06]">
              <div className="text-xs font-bold text-white/50 tracking-widest uppercase">Pendiri RabbitTJ</div>
              <div className="text-xs text-white/20 mt-1">Jakarta, 2026</div>
            </div>
          </div>
        </div>
      </section>

      {/* Nilai */}
      <section className="py-24 px-6 md:px-16 border-b border-white/[0.05]">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-16">
            <span className="text-[10px] tracking-[0.4em] text-white/20 uppercase">Nilai Kami</span>
            <div className="h-px flex-1 bg-white/[0.05]" />
          </div>
          <div className="grid md:grid-cols-4 gap-px bg-white/[0.05]">
            {[
              { icon: <Zap className="w-4 h-4" />, title: 'Cepat', desc: 'Respon dalam 12 jam, tidak ada yang menunggu lebih lama.' },
              { icon: <ShieldCheck className="w-4 h-4" />, title: 'Jujur', desc: 'Jika ditolak, ada alasan. Tidak ada keputusan yang misterius.' },
              { icon: <Clock className="w-4 h-4" />, title: 'Tepat Waktu', desc: 'Sistem kuota mendorong disiplin dari semua pihak.' },
              { icon: <Wrench className="w-4 h-4" />, title: 'Terampil', desc: 'Setiap jasa ditangani oleh tenaga yang berpengalaman.' },
            ].map((v) => (
              <div key={v.title} className="bg-[#0c0c0c] p-8 hover:bg-[#111] transition-colors">
                <div className="w-8 h-8 border border-white/10 flex items-center justify-center text-white/30 mb-6">
                  {v.icon}
                </div>
                <h3 className="font-bold text-white text-sm mb-2 tracking-tight">{v.title}</h3>
                <p className="text-xs text-white/25 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 md:px-16">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <h2 className="text-4xl md:text-5xl font-black uppercase leading-tight text-white">
              Siap Coba<br />
              <span style={{ WebkitTextStroke: '1px rgba(255,255,255,0.2)', color: 'transparent' }}>
                Sekarang?
              </span>
            </h2>
            <p className="text-white/30 text-sm mt-4">Daftar gratis, tidak ada biaya tersembunyi.</p>
          </div>
          <Link
            href="/daftar"
            className="group shrink-0 flex items-center gap-3 bg-white text-black font-bold text-sm px-8 py-4 uppercase tracking-wider hover:bg-white/80 transition-colors"
          >
            Daftar Sekarang
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  )
}
