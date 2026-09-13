import React, { useState } from 'react';
import { Eye, Lock, Globe, Users, BarChart3, CheckCircle2, XCircle, ShieldAlert } from 'lucide-react';
import { ComparisonTable } from '../common/ComparisonTable';
import { handleTablistKeys } from '../../utils/overlay';

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

/**
 * The three visibility positions, tied to the tabs that select them.
 *
 * This was three fixed dots on a line: decoration shaped like a chart, encoding
 * nothing and connected to nothing. Two of the three correspond to a tab, so the
 * highlight can follow the reader's choice; `gender` is a different axis
 * entirely, and when it is active no position is claimed rather than a wrong one
 * being lit.
 */
const VISIBILITY_POINTS: {
  tab: 'public' | 'private' | null;
  label: string;
  dot: string;
  tone: string;
  /** Where the marker sits on the rail, and how the label lines up beneath it. */
  place: string;
  align: string;
  guide: boolean;
}[] = [
  {
    tab: 'private',
    label: 'Privat',
    dot: 'bg-mn-green',
    tone: 'text-emerald-700 dark:text-emerald-400',
    place: 'left-0',
    align: 'text-left',
    guide: false,
  },
  {
    tab: null,
    label: 'Terlihat orang lain',
    dot: 'bg-mn-gold',
    tone: 'text-yellow-700 dark:text-yellow-500',
    place: 'left-1/2 -translate-x-1/2',
    align: 'text-center',
    guide: true,
  },
  {
    tab: 'public',
    label: 'Publik + personal',
    dot: 'bg-mn-orange',
    tone: 'text-rose-700 dark:text-rose-400',
    place: 'right-0',
    align: 'text-right',
    guide: true,
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
    chip: 'border-emerald-900 bg-emerald-950 text-emerald-700 dark:border-emerald-800 dark:text-emerald-400',
    label: 'Cek ruangnya',
    question:
      '“Apakah respons pembaca akan terlihat oleh teman, keluarga, rekan kerja, pasangan, atau publik?”',
  },
  {
    icon: Users,
    chip: 'border-amber-900 bg-amber-950 text-amber-500',
    label: 'Cek social cost',
    question:
      '“Apakah tindakan yang kita ajak masih berpotensi dinilai memalukan, lemah, atau ‘tidak laki-laki’ dalam konteks audiens ini?”',
  },
  {
    icon: BarChart3,
    chip: 'border-sky-900 bg-sky-950 text-sky-700 dark:border-sky-800 dark:text-sky-400',
    label: 'Sesuaikan ajakannya',
    question:
      '“Semakin tinggi risiko penilaian sosial, semakin kecil tuntutan untuk mengungkapkan pengalaman pribadi di depan orang lain.”',
  },
];

export const ContextCheck: React.FC = () => {
  const [activeTabId, setActiveTabId] = useState<'public' | 'private' | 'gender'>('public');

  const activeTab = CONTEXT_TABS.find((t) => t.id === activeTabId) ?? CONTEXT_TABS[0];

  return (
    <section className="space-y-8 rounded-2xl sm:rounded-3xl border border-stone-800 bg-stone-950 p-6 sm:p-8 lg:p-9">
      {/* A. Intro */}
      <div className="space-y-2 max-w-3xl">
        <div className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-amber-500">
          <Eye size={13} />
          <span>CONTEXT CHECK</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-100 leading-tight">
          Pertimbangkan siapa yang bisa melihat
        </h2>
        <p className="text-sm sm:text-base text-stone-400 font-sans leading-[1.65]">
          Cara orang merespons sebuah pesan dapat berubah ketika tindakan atau pengalaman mereka terlihat oleh orang lain. Untuk topik yang masih membawa stigma atau norma gender tertentu, ruang publik dapat meningkatkan kekhawatiran akan penilaian sosial.
        </p>
      </div>

      {/* B. Prinsip Utama */}
      <div className="relative overflow-hidden rounded-xl border border-amber-900 bg-amber-950 border-l-4 border-l-amber-500 p-5 sm:p-6">
        {/* The principle is about being watched; the figures say so without a caption. */}
        <Users
          size={132}
          strokeWidth={1.1}
          aria-hidden="true"
          className="pointer-events-none absolute -right-6 -top-6 text-amber-900 opacity-60"
        />
        <div className="relative space-y-2 max-w-3xl">
          <span className="text-[10.5px] font-sans font-bold uppercase tracking-[0.16em] text-amber-500 block">
            Prinsip Utama
          </span>
          <blockquote className="text-base sm:text-lg font-serif italic text-amber-700 dark:text-amber-400 leading-snug">
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
              className="cc-step rounded-xl border border-stone-800 bg-stone-900 p-5 space-y-3"
            >
              <div className="flex items-center gap-3">
                <span className={`h-10 w-10 shrink-0 rounded-full border flex items-center justify-center ${step.chip}`}>
                  <Icon size={18} strokeWidth={1.9} />
                </span>
                <span className="text-[11px] font-sans font-bold uppercase tracking-[0.14em] text-stone-300">
                  {step.label}
                </span>
              </div>
              <p className="text-[13px] text-stone-500 leading-[1.62] font-sans">
                {step.question}
              </p>
            </li>
          );
        })}
      </ol>

      {/* D. Interactive Context Examples */}
      <div className="space-y-4">
        {/* The spectrum now sits directly above the control that moves it, so the
            highlight changing is visible in the same glance as the click. */}
        <div className="rounded-xl border border-stone-800 bg-stone-900 p-4 sm:p-5 space-y-3">
          <span className="text-[10px] font-sans font-bold uppercase tracking-[0.16em] text-stone-500 block">
            Spektrum Keterlihatan
          </span>

          {/* The rail carries the brand gradient (§2.5) from the green end of the
              spectrum to the orange one; the markers sit on it rather than on a
              hairline, so position and colour say the same thing twice. */}
          <div className="space-y-2">
            <div className="relative h-4">
              <div
                className="absolute inset-x-0 top-1/2 h-3 -translate-y-1/2 rounded-full"
                style={{ background: 'linear-gradient(90deg, #2E4034 0%, #AF4D28 100%)' }}
                aria-hidden="true"
              />
              {VISIBILITY_POINTS.map((point) => {
                const claimed = VISIBILITY_POINTS.some((p) => p.tab === activeTabId);
                const isActive = point.tab === activeTabId;
                return (
                  <span
                    key={point.label}
                    className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full ring-2 ring-stone-900 transition duration-200 ${point.place} ${point.dot} ${
                      !claimed ? 'opacity-80' : isActive ? 'opacity-100 scale-125' : 'opacity-40'
                    }`}
                  />
                );
              })}
            </div>

            <div className="grid grid-cols-3 gap-2 text-[10.5px] font-sans">
              {VISIBILITY_POINTS.map((point) => {
                const claimed = VISIBILITY_POINTS.some((p) => p.tab === activeTabId);
                const isActive = point.tab === activeTabId;
                return (
                  <span
                    key={point.label}
                    className={`font-medium transition-opacity duration-200 ${point.align} ${point.tone} ${
                      !claimed ? 'opacity-80' : isActive ? 'opacity-100' : 'opacity-45'
                    }`}
                  >
                    {point.label}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selector Tabs */}
        <div
          role="tablist"
          aria-label="Pilihan Ruang dan Norma"
          onKeyDown={(e) => handleTablistKeys(e, (i) => setActiveTabId(CONTEXT_TABS[i].id))}
          className="flex flex-wrap gap-2"
        >
          {CONTEXT_TABS.map((tab) => {
            const isActive = tab.id === activeTabId;
            return (
              <button
                key={tab.id}
                role="tab"
                id={`context-tab-${tab.id}`}
                aria-selected={isActive}
                aria-controls="context-tabpanel"
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActiveTabId(tab.id)}
                className={`px-4 py-2.5 rounded-[10px] text-xs font-sans font-medium transition cursor-pointer flex items-center gap-2 border ${
                  isActive
                    ? 'border-amber-500 bg-amber-500 text-stone-950 font-semibold'
                    : 'border-stone-800 bg-stone-900 text-stone-500 hover:text-stone-200 hover:border-stone-700'
                }`}
              >
                {tab.id === 'public' && <Globe size={13} />}
                {tab.id === 'private' && <Lock size={13} />}
                {tab.id === 'gender' && <ShieldAlert size={13} />}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Panel */}
        <div
          role="tabpanel"
          id="context-tabpanel"
          aria-labelledby={`context-tab-${activeTab.id}`}
          className="rounded-xl border border-stone-800 bg-stone-900 p-5 sm:p-6 space-y-4"
        >
          <div className="space-y-1">
            <h3 className="text-lg font-serif font-semibold text-stone-100">{activeTab.title}</h3>
            <p className="text-[13px] sm:text-sm text-stone-500 leading-[1.65] font-sans">{activeTab.description}</p>
          </div>

          {/* Unified Comparison Table */}
          <ComparisonTable
            key={activeTab.id}
            className="cmp-stagger"
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
            rows={activeTab.pairs.map((pair, idx) => ({
              id: `${activeTab.id}-${idx}`,
              positive: (
                <>
                  <p className="font-serif italic text-emerald-700 dark:text-emerald-200 leading-snug">
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
                  <p className="font-serif italic text-rose-700 dark:text-rose-200 leading-snug">
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

          <p className="text-[13px] text-stone-500 bg-stone-950 p-3.5 rounded-lg border border-stone-800 leading-[1.62] font-sans">
            {activeTab.note}
          </p>
        </div>
      </div>

      {/* E. Rangkuman / Takeaway */}
      <div className="rounded-xl border border-stone-800 bg-stone-900 p-5 sm:p-6 space-y-3">
        <span className="text-[11px] font-sans font-bold uppercase tracking-[0.16em] text-amber-500 block">
          Prinsip sederhananya
        </span>
        <div className="space-y-2 text-[13px] sm:text-sm text-stone-500 leading-[1.65] font-sans">
          <p>
            “Di ruang publik, beri informasi dan pilihan tanpa meminta pengakuan pribadi. Jika percakapan membutuhkan keterbukaan lebih jauh, sediakan jalur yang lebih privat dan jelaskan batas privasinya.”
          </p>
          <p>
            “Jika tindakan yang kita ajak masih berpotensi dinilai sebagai ‘tidak laki-laki’, jangan memperkuat stereotip dengan mengatakan ‘cowok juga boleh…’. Fokuskan pesan pada kegunaan, pilihan, dan situasinya.”
          </p>
        </div>
        <div className="text-[11px] font-mono text-stone-500 pt-2.5 border-t border-stone-800">
          * Ini adalah contextual check, bukan aturan terpisah untuk setiap topik.
        </div>
      </div>
    </section>
  );
};

