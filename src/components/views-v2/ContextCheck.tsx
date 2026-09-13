import React, { useState } from 'react';
import { Eye, Lock, Globe, Users, BarChart3, CheckCircle2, XCircle, ShieldAlert, ChevronDown } from 'lucide-react';
import { ComparisonTable } from '../common/ComparisonTable';

interface DoDontPair {
  doText: string;
  doWhy?: string;
  dontText: string;
  dontWhy?: string;
}

interface TabData {
  id: 'public' | 'private' | 'gender';
  label: string;
  title: string;
  description: string;
  pairs: DoDontPair[];
  note: string;
}

const CONTEXT_TABS: TabData[] = [
  {
    id: 'public',
    label: 'Ruang publik',
    title: 'Ruang publik',
    description:
      'Berikan informasi dan pilihan tanpa meminta pengakuan pribadi. Jika percakapan membutuhkan keterbukaan lebih jauh, arahkan ke jalur yang lebih privat.',
    pairs: [
      {
        doText: 'Kalau belakangan ada yang terasa berbeda, kamu bisa cek beberapa tandanya di slide berikut.',
        doWhy: 'Memberi informasi dan opsi mandiri tanpa menuntut pembaca mengakui kerentanan diri di ruang terbuka.',
        dontText: 'Ceritakan masalah mentalmu di kolom komentar.',
        dontWhy: 'Mendesak pengakuan emosional berisiko tinggi di hadapan publik.',
      },
      {
        doText: 'Simpan postingan ini jika kamu atau rekanmu butuh kontak layanan sewaktu-waktu.',
        doWhy: 'Menyediakan retensi privat yang diskrit tanpa sorotan sosial.',
        dontText: 'Tag teman cowokmu yang kelihatannya butuh ke psikolog atau lagi rapuh.',
        dontWhy: 'Mempermalukan atau menandai kondisi orang lain di linimasa publik.',
      },
      {
        doText: 'Menurutmu, apa hal yang paling sering membuat seseorang ragu untuk mengambil jeda saat lelah?',
        doWhy: 'Mendorong refleksi berbasis topik umum yang aman dibahas bersama.',
        dontText: 'Pernah merasa gagal sebagai laki-laki? Tulis pengalaman terpurukmu di bawah.',
        dontWhy: 'Menjadikan kegagalan atau luka pribadi sebagai tontonan publik.',
      },
      {
        doText: 'Sesi bincang santai ini menyediakan opsi nama samaran dan kamera nonaktif demi kenyamanan.',
        doWhy: 'Menurunkan social cost dengan menjamin kendali privasi dan anonimitas peserta.',
        dontText: 'Buktikan kamu berani terbuka dan hadapi rasa takutmu dengan ikut siaran langsung ini.',
        dontWhy: 'Membingkai keterbukaan sebagai ajang uji nyali atau pembuktian keberanian.',
      },
    ],
    note: 'Di ruang publik, tindakan sederhana seperti memberi komentar dapat terasa lebih berisiko karena identitas dan respons seseorang dapat dilihat orang lain.',
  },
  {
    id: 'private',
    label: 'Ruang privat',
    title: 'Ruang privat',
    description:
      'Privat tidak otomatis berarti aman. Jelaskan batas privasi dan beri orang kendali atas seberapa jauh mereka ingin bercerita.',
    pairs: [
      {
        doText: 'Kalau kamu ingin cerita lebih jauh, kamu bisa mulai dari bagian yang terasa nyaman.',
        doWhy: 'Memberikan agensi penuh kepada pembaca untuk menentukan batas ceritanya sendiri.',
        dontText: 'Kalau serius ingin pulih, ceritakan semuanya sekarang.',
        dontWhy: 'Menuntut keterbukaan total dengan prasyarat yang menekan psikologis.',
      },
      {
        doText: 'Pesan dan identitasmu di kanal ini bersifat rahasia dan hanya diakses oleh konselor pendamping.',
        doWhy: 'Menegaskan batas privasi secara transparan dan profesional sebelum sesi dimulai.',
        dontText: 'Kamu wajib mengisi seluruh riwayat masa lalumu agar kami bisa memberikan solusi.',
        dontWhy: 'Memaksa pembongkaran riwayat trauma sebagai syarat mutlak bantuan.',
      },
      {
        doText: 'Tidak apa-apa kalau ada hal yang belum ingin kamu bahas hari ini. Kita bisa berhenti kapan saja.',
        doWhy: 'Memberikan izin eksplisit untuk jeda dan keluar tanpa rasa bersalah.',
        dontText: 'Jangan ditahan-tahan, tumpahkan dan tangisi semuanya di sini biar plong.',
        dontWhy: 'Memaksakan katarsis emosional yang dapat memicu rasa tidak aman atau kewalahan.',
      },
      {
        doText: 'Pesan ini sekadar menyapa berkala. Kamu tidak harus membalas sekarang kalau sedang butuh waktu.',
        doWhy: 'Follow-up rendah tekanan yang menghormati ritme dan ruang pribadi seseorang.',
        dontText: 'Kenapa kamu tiba-tiba menghilang? Menutup diri dari bantuan tidak akan menyelesaikan masalahmu.',
        dontWhy: 'Menghakimi keheningan seseorang sebagai bentuk kesalahan atau pembangkangan.',
      },
    ],
    note: 'Ruang privat dapat mengurangi sorotan sosial, tetapi tetap tidak boleh dianggap sebagai izin untuk meminta keterbukaan penuh.',
  },
  {
    id: 'gender',
    label: 'Cek norma gender',
    title: 'Cek norma gender',
    description:
      'Jika suatu tindakan masih berpotensi dianggap ‘tidak laki-laki’, jangan menjadikan maskulinitas sebagai medan pembuktian. Fokuskan pesan pada kegunaan, pilihan, dan situasinya.',
    pairs: [
      {
        doText: 'Konsultasi bisa membantu kamu memahami apa yang belakangan berubah dan menentukan langkah berikutnya.',
        doWhy: 'Fokus pada kegunaan praktis dan kejelasan langkah tanpa membawa beban gender.',
        dontText: 'Cowok juga boleh kok ke psikolog—nggak usah malu jadi laki-laki yang sensitif.',
        dontWhy: 'Secara tidak sengaja menegaskan bahwa mencari bantuan adalah anomali bagi laki-laki.',
      },
      {
        doText: 'Mengambil jeda saat tubuh lelah adalah cara menjaga ritme kerja agar tetap berfungsi optimal.',
        doWhy: 'Membingkai istirahat secara instrumental sebagai pemeliharaan kapasitas harian.',
        dontText: 'Laki-laki sejati bukan yang tahan banting, tapi yang berani mengakui dirinya rapuh.',
        dontWhy: 'Menggunakan klise "laki-laki sejati" untuk mendefinisikan ulang maskulinitas secara menggurui.',
      },
      {
        doText: 'Mendiskusikan masalah dengan pihak profesional memberi sudut pandang baru yang objektif.',
        doWhy: 'Menempatkan konsultasi setara dengan mencari masukan objektif atau second opinion.',
        dontText: 'Tunjukkan kejantananmu dengan berani jujur soal kesehatan mentalmu.',
        dontWhy: 'Menjadikan kesehatan mental sebagai standar uji maskulinitas baru.',
      },
      {
        doText: 'Rasa kewalahan atau sedih adalah respons wajar atas situasi berat yang sedang dihadapi siapa pun.',
        doWhy: 'Menormalisasi beban secara situasional dan manusiawi tanpa menyudutkan pembaca.',
        dontText: 'Zaman sekarang cowok jangan sok keras; buang gengsi dan ego toxic masculinity-mu.',
        dontWhy: 'Menggurui dengan jargon moralis yang justru memicu penolakan defensif.',
      },
    ],
    note: 'Kalimat seperti ‘cowok juga boleh’ terlihat suportif, tetapi tetap dapat memperkuat anggapan bahwa tindakan tersebut pada dasarnya berada di luar norma laki-laki.',
  },
];

/** The three checks, in the order they are meant to be run. */
const CONTEXT_STEPS: {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  chip: string;
  label: string;
  question: string;
}[] = [
  {
    icon: Eye,
    chip: 'border-emerald-900/60 bg-emerald-950/60 text-emerald-700 dark:border-emerald-800 dark:text-emerald-400',
    label: 'Cek ruangnya',
    question:
      '“Apakah respons pembaca akan terlihat oleh teman, keluarga, rekan kerja, pasangan, atau publik?”',
  },
  {
    icon: Users,
    chip: 'border-amber-900/60 bg-amber-950/60 text-amber-500',
    label: 'Cek social cost',
    question:
      '“Apakah tindakan yang kita ajak masih berpotensi dinilai memalukan, lemah, atau ‘tidak laki-laki’ dalam konteks audiens ini?”',
  },
  {
    icon: BarChart3,
    chip: 'border-sky-900/60 bg-sky-950/60 text-sky-700 dark:border-sky-800 dark:text-sky-400',
    label: 'Sesuaikan ajakannya',
    question:
      '“Semakin tinggi risiko penilaian sosial, semakin kecil tuntutan untuk mengungkapkan pengalaman pribadi di depan orang lain.”',
  },
];

export const ContextCheck: React.FC = () => {
  const [openTabId, setOpenTabId] = useState<string | null>('public');

  return (
    <section className="space-y-6 sm:space-y-8 rounded-3xl border border-stone-800/80 bg-stone-900/40 dark:bg-stone-950/70 p-6 sm:p-8 lg:p-9 shadow-sm">
      {/* A. Intro */}
      <div className="space-y-2 max-w-3xl">
        <div className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-amber-500">
          <Eye size={13} />
          <span>CONTEXT CHECK</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-100 leading-tight">
          Pertimbangkan siapa yang bisa melihat
        </h2>
        <p className="text-sm sm:text-base text-stone-500 dark:text-stone-300 font-sans leading-[1.65]">
          Cara orang merespons sebuah pesan dapat berubah ketika tindakan atau pengalaman mereka terlihat oleh orang lain. Untuk topik yang masih membawa stigma atau norma gender tertentu, ruang publik dapat meningkatkan kekhawatiran akan penilaian sosial.
        </p>
      </div>

      {/* B. Prinsip Utama (Clean, no left bookmark bar, no background watermark icon) */}
      <div className="rounded-2xl border border-amber-500/30 dark:border-amber-500/20 bg-amber-500/5 dark:bg-amber-950/30 p-5 sm:p-6">
        <div className="space-y-2 max-w-3xl">
          <span className="text-[10.5px] font-sans font-bold uppercase tracking-[0.16em] text-amber-600 dark:text-amber-400 block">
            Prinsip Utama
          </span>
          <blockquote className="text-base sm:text-lg font-serif italic text-stone-100 leading-snug">
            “Semakin publik dan semakin personal tindakannya, semakin rendah tuntutan untuk membuka diri.”
          </blockquote>
        </div>
      </div>

      {/* C. Tiga Context Check Cards */}
      <ol className="cc-steps grid grid-cols-1 md:grid-cols-3 gap-4 list-none p-0 m-0">
        {CONTEXT_STEPS.map((step) => {
          const Icon = step.icon;
          return (
            <li
              key={step.label}
              className="cc-step rounded-2xl border border-stone-800/80 bg-stone-900/80 dark:bg-stone-900/50 p-5 space-y-3 shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <span className={`h-10 w-10 shrink-0 rounded-full border flex items-center justify-center ${step.chip}`}>
                  <Icon size={18} strokeWidth={1.9} />
                </span>
                <span className="text-[11px] font-sans font-bold uppercase tracking-[0.14em] text-stone-100">
                  {step.label}
                </span>
              </div>
              <p className="text-[13px] text-stone-500 dark:text-stone-300 leading-[1.62] font-sans">
                {step.question}
              </p>
            </li>
          );
        })}
      </ol>

      {/* D. Collapsible Context Cards (Buttons as Section Titles) */}
      <div className="space-y-3.5 pt-2">
        {CONTEXT_TABS.map((tab) => {
          const isOpen = openTabId === tab.id;
          const TabIcon =
            tab.id === 'public' ? Globe : tab.id === 'private' ? Lock : ShieldAlert;

          return (
            <div
              key={tab.id}
              className={`rounded-2xl border transition-all duration-200 shadow-2xs overflow-hidden ${
                isOpen
                  ? 'border-amber-500/70 dark:border-amber-500/50 bg-stone-900/90 dark:bg-stone-900/90 shadow-sm'
                  : 'border-stone-800/80 bg-stone-900/70 dark:bg-stone-900/50 hover:border-stone-700 dark:hover:border-stone-700 hover:bg-stone-900'
              }`}
            >
              {/* Header as the title button */}
              <button
                type="button"
                onClick={() => setOpenTabId(isOpen ? null : tab.id)}
                aria-expanded={isOpen}
                aria-controls={`context-content-${tab.id}`}
                className="w-full flex items-center justify-between gap-4 p-4 sm:p-5 text-left cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${
                      tab.id === 'public'
                        ? 'bg-[#EBF0FA] dark:bg-sky-950/60 text-[#17243D] dark:text-sky-300 border-[#C6D0E2] dark:border-sky-800/50'
                        : tab.id === 'private'
                        ? 'bg-[#ECF2EE] dark:bg-emerald-950/60 text-[#2E4034] dark:text-emerald-300 border-[#C7D3CB] dark:border-emerald-800/50'
                        : 'bg-[#FFEBE5] dark:bg-amber-950/60 text-[#AF4D28] dark:text-amber-300 border-[#FCBFAA] dark:border-amber-800/50'
                    }`}
                  >
                    <TabIcon size={18} strokeWidth={1.9} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-serif font-bold text-base sm:text-lg text-stone-100 leading-snug">
                      {tab.title}
                    </h3>
                    <p className="text-xs sm:text-[13px] text-stone-500 dark:text-stone-400 font-sans line-clamp-1 mt-0.5">
                      {tab.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <span className="text-[11px] font-sans font-medium text-stone-500 dark:text-stone-400 hidden sm:inline">
                    {isOpen ? 'Tutup panduan' : 'Lihat panduan'}
                  </span>
                  <div className="p-1.5 rounded-lg text-stone-500 dark:text-stone-400 hover:text-stone-100 hover:bg-stone-800/40 transition">
                    <ChevronDown
                      size={18}
                      className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </div>
                </div>
              </button>

              {/* Collapsible Content: DO and DON'T Table */}
              {isOpen && (
                <div
                  id={`context-content-${tab.id}`}
                  role="region"
                  className="px-4 pb-5 sm:px-5 sm:pb-6 pt-1 border-t border-stone-800/70 space-y-4 animate-fadeIn"
                >
                  <p className="text-[13px] sm:text-sm text-stone-500 dark:text-stone-300 leading-relaxed font-sans pt-3">
                    {tab.description}
                  </p>

                  {/* Unified Comparison Table */}
                  <ComparisonTable
                    positiveLabel={
                      <>
                        <CheckCircle2 size={14} className="shrink-0 text-emerald-400" />
                        <span>DO (Sesuai Panduan)</span>
                      </>
                    }
                    negativeLabel={
                      <>
                        <XCircle size={14} className="shrink-0 text-rose-500 dark:text-rose-400" />
                        <span>DON'T (Perlu Dihindari)</span>
                      </>
                    }
                    rows={tab.pairs.map((pair, idx) => ({
                      id: `${tab.id}-${idx}`,
                      positive: (
                        <>
                          <p className="font-serif italic text-emerald-700 dark:text-emerald-300 leading-snug">
                            "{pair.doText}"
                          </p>
                          {pair.doWhy && (
                            <p className="text-[13px] text-stone-500 dark:text-stone-400 leading-relaxed font-sans">
                              {pair.doWhy}
                            </p>
                          )}
                        </>
                      ),
                      negative: (
                        <>
                          <p className="font-serif italic text-rose-700 dark:text-rose-300 leading-snug">
                            "{pair.dontText}"
                          </p>
                          {pair.dontWhy && (
                            <p className="text-[13px] text-stone-500 dark:text-stone-400 leading-relaxed font-sans">
                              {pair.dontWhy}
                            </p>
                          )}
                        </>
                      ),
                    }))}
                  />

                  <p className="text-[12.5px] sm:text-[13px] text-stone-500 dark:text-stone-400 bg-stone-950/60 p-3.5 rounded-xl border border-stone-800/70 leading-relaxed font-sans">
                    {tab.note}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* E. Rangkuman / Takeaway */}
      <div className="rounded-2xl border border-stone-800/80 bg-stone-900/60 dark:bg-stone-900/40 p-5 sm:p-6 space-y-3">
        <span className="text-[11px] font-sans font-bold uppercase tracking-[0.16em] text-amber-500 block">
          Prinsip sederhananya
        </span>
        <div className="space-y-2 text-[13px] sm:text-sm text-stone-500 dark:text-stone-300 leading-[1.65] font-sans">
          <p>
            “Di ruang publik, beri informasi dan pilihan tanpa meminta pengakuan pribadi. Jika percakapan membutuhkan keterbukaan lebih jauh, sediakan jalur yang lebih privat dan jelaskan batas privasinya.”
          </p>
          <p>
            “Jika tindakan yang kita ajak masih berpotensi dinilai sebagai ‘tidak laki-laki’, jangan memperkuat stereotip dengan mengatakan ‘cowok juga boleh…’. Fokuskan pesan pada kegunaan, pilihan, dan situasinya.”
          </p>
        </div>
        <div className="text-[11px] font-mono text-stone-500 dark:text-stone-400 pt-2.5 border-t border-stone-800/70">
          * Ini adalah contextual check, bukan aturan terpisah untuk setiap topik.
        </div>
      </div>
    </section>
  );
};

