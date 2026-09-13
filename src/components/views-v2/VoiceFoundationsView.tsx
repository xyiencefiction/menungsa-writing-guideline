import React, { useState } from 'react';
import type { ViewType } from '../../types';
import { CheckCircle2, XCircle, Sparkles, ArrowRight, SlidersHorizontal, Lightbulb, ShieldCheck } from 'lucide-react';
import { ValueSpectrum } from '../charts/ValueSpectrum';
import { ContextCheck } from './ContextCheck';
import { ComparisonTable } from '../common/ComparisonTable';
import { SegmentedTabs } from '../common/SegmentedTabs';
import { brandValues } from '../../data';

interface Props {
  onNavigate: (view: ViewType) => void;
}

interface ValuePillar {
  id: string;
  title: string;
  voiceTrait: string;
  positionNote: string;
  boundaryCondition: string;
  dos: { example: string; why: string }[];
  donts: { example: string; why: string }[];
}

const VALUE_PILLARS: ValuePillar[] = [
  {
    id: "V1",
    title: "Setara, Bukan Menghakimi",
    voiceTrait: "Sapa dan temui pembaca di titik mereka berada (meet them where they are). Jangan menilai mereka dari kekuatan, keberanian, atau kepantasan untuk dihargai.",
    positionNote: "Memberikan rasa aman dan mengurangi kemungkinan pembaca bereaksi secara defensif. Membuat audiens merasa menjadi bagian dari Menungsa, alih-alih merasa sebagai orang luar yang perlu 'diperbaiki' atau 'diubah'.",
    boundaryCondition: "Prinsip ini tidak berarti menghindari penilaian terhadap risiko, perilaku, atau situasi. Dalam konteks keselamatan, kesehatan, atau kondisi darurat, gunakan bahasa yang akurat dan tegas untuk menjelaskan risiko. Yang dihindari adalah menghakimi pembaca, bukan menyamarkan atau mereduksi realita dan risiko.",
    dos: [
      {
        example: "Ini ruang buat cerita dan ngobrol bareng. Kamu tidak harus cerita apa-apa jika memang belum siap.",
        why: "Menyapa pembaca dan menjelaskan suasana program tanpa membebaninya dengan syarat atau tuntutan yang mungkin sebelumnya sudah berat (i.e. bercerita)"
      },
      {
        example: "Minggu lalu, program kami dihadiri oleh tujuh orang. Empat di antaranya lebih banyak mendengarkan.",
        why: "Menggambarkan fakta atau perilaku yang terlihat tanpa memberi label maupun penilaian terhadap orang yang melakukannya."
      }
    ],
    donts: [
      {
        example: "Laki-laki kuat adalah laki-laki yang berani bercerita.",
        why: "Mengganti tuntutan “laki-laki harus kuat” dengan tuntutan baru untuk berani bercerita. Bercerita akhirnya menjadi ukuran apakah seseorang cukup “kuat”."
      },
      {
        example: "Kamu hebat karena sudah mau terbuka dan meruntuhkan ego",
        why: "Memuji keterbukaan sambil mengasumsikan bahwa sebelumnya pembaca dikuasai oleh ego; secara tidak langsung pembaca dapat merasa dihakimi."
      },
      {
        example: "Pria sejati tidak takut mengakui traumanya",
        why: "Menjadikan keberanian mengakui trauma sebagai ukuran apakah seseorang cukup “sejati” sebagai laki-laki.\n---"
      }
    ]
  },
  {
    id: "V2",
    title: "Mudah untuk Dimulai",
    voiceTrait: "Jelaskan secara konkret dan ringkas. Jangan bertele-tele; menambah langkah, istilah, atau tuntutan yang tidak diperlukan..",
    positionNote: "Kejelasan mengurangi beban untuk memahami, memutuskan, dan mengambil langkah pertama. Audiens lebih mudah merespons ketika proses, pilihan, dan apa yang akan mereka dapatkan terasa jelas dan sederhana.",
    boundaryCondition: "Pada kondisi krisis atau darurat, gunakan instruksi yang singkat, tegas, dan terarah.",
    dos: [
      {
        example: "Ruang MENdukung pada Selasa ini pukul 19.00 WIB via Google Meet. Gratis, dan kamu bebas memilih mau bercerita, menguatkan, atau sekadar mendengarkan.",
        why: "Menjelaskan hal penting–waktu, biaya (cost), tempat–sejak awal dan memberi pilihan yang jelas kepada audiens."
      },
      {
        example: "Belum siap cerita? Nggak apa-apa. Kamu bisa ikut dulu sebagai pendengar.",
        why: "Membuat langkah pertama terasa lebih ringan tanpa menuntut keterlibatan tertentu."
      }
    ],
    donts: [
      {
        example: "Ceritakan semua yang selama ini kamu pendam",
        why: "Langsung meminta pembaca membuka pengalaman pribadi tanpa memberi ruang untuk menentukan batasnya sendiri."
      },
      {
        example: "Sebelum ikut, isi formulir lengkap dan ceritakan masalah yang sedang kamu alami.",
        why: "Menambah tuntutan sebelum audiens sempat merasa aman atau memahami apa yang akan mereka ikuti.\n---"
      }
    ]
  },
  {
    id: "V3",
    title: "Satu Langkah Nyata",
    voiceTrait: "Tawarkan satu tindakan yang konkret dan realistis. Jika ada banyak pilihan, bantu pembaca menentukan langkah yang paling masuk akal untuk dilakukan terlebih dahulu.",
    positionNote: "Terlalu banyak saran sekaligus dapat membuat pembaca bingung atau tidak melakukan apa pun. Satu langkah yang jelas membantu mengubah pemahaman menjadi tindakan.",
    boundaryCondition: "Tidak semua situasi cukup ditangani dengan satu langkah. Untuk masalah yang kompleks atau berkelanjutan, satu langkah berfungsi sebagai titik awal menuju dukungan atau penanganan berikutnya.",
    dos: [
      {
        example: "Kalau belakangan kamu merasa kewalahan, coba pilih satu orang yang cukup kamu percaya dan bilang, ‘Gue pusing nih, ayok nongkrong?",
        why: "Memberikan satu tindakan konkret yang bisa langsung dicoba, termasuk cara sederhana untuk memulainya."
      },
      {
        example: "Sebelum tidur malam ini, coba catat satu hal yang paling menguras energimu hari ini.",
        why: "Mengubah ajakan untuk lebih memahami diri menjadi satu tindakan kecil dengan awal dan akhir yang jelas."
      }
    ],
    donts: [
      {
        example: "Mulai olahraga rutin, tidur cukup, makan lebih sehat, kurangi media sosial, coba journaling, dan jangan ragu mencari bantuan profesional.",
        why: "Memberikan terlalu banyak tindakan sekaligus tanpa membantu pembaca menentukan mana yang perlu dilakukan terlebih dahulu."
      },
      {
        example: "Mulai sekarang, kamu perlu menata ulang hidup dan mengubah pola pikirmu.",
        why: "Meminta perubahan besar tanpa memberi satu tindakan konkret yang dapat dilakukan.\n---"
      }
    ]
  },
  {
    id: "V4",
    title: "Mulai dari yang Terlihat",
    voiceTrait: "Mulailah dari situasi, kebiasaan, atau perubahan yang bisa dikenali pembaca. Tunjukkan apa yang terjadi terlebih dahulu. Jangan langsung menyimpulkan apa yang mereka rasakan, pikirkan, atau alami.",
    positionNote: "Seseorang sering lebih mudah mengenali apa yang berubah dalam kesehariannya sebelum bisa menjelaskan apa yang sedang ia rasakan. Mulai dari hal yang bisa ia lihat atau alami langsung, lalu beri ruang baginya untuk menghubungkan pola tersebut dan menamai perasaannya sendiri.",
    boundaryCondition: "Situasi konkret tetap perlu beragam dan sesuai konteks. Jangan menganggap satu kebiasaan atau pengalaman mewakili semua laki-laki.",
    dos: [
      {
        example: "Sudah lewat jam tiga pagi. Lampu kamar mati, tapi kamu masih buka aplikasi bank dan mengecek saldo lagi.",
        why: "Memulai dari situasi yang bisa dikenali tanpa langsung menyimpulkan apa yang sedang dirasakan atau dipikirkan pembaca."
      },
      {
        example: "Belakangan, chat makin sering menumpuk, jam makan sering kali terlewat, dan alarm pagi lebih sering kalah dengan \"ah mending tidur lagi\".",
        why: "Menunjukkan perubahan dalam keseharian terlebih dahulu agar pembaca bisa mengenali polanya sebelum memberi nama pada pengalamannya sendiri."
      }
    ],
    donts: [
      {
        example: "Kalau belakangan kamu jadi lebih sering menghindar dari orang lain dan rasanya nggak punya tenaga buat ngapa-ngapain, berarti kamu depresi.",
        why: "Terlalu cepat menyimpulkan apa yang sedang dialami pembaca hanya dari beberapa perubahan yang kelihatan."
      },
      {
        example: "Kalau gini, kamu pasti merasa hampa, kesepian, dan gagal sebagai laki-laki, kan?",
        why: "Menentukan perasaan dan pikiran pembaca sebelum memberi mereka ruang untuk mengenali dan menamainya sendiri.\n---"
      }
    ]
  },
  {
    id: "V5",
    title: "Jelas soal Batasan",
    voiceTrait: "Sampaikan informasi sesuai tingkat kepastian yang tersedia. Bedakan apa yang sudah diketahui, apa yang masih berupa kemungkinan, dan apa yang belum diketahui. Jangan mengklaim lebih dari bukti atau kapasitas yang Menungsa miliki.",
    positionNote: "Dengan jujur dan terbuka menjelaskan apa yang sudah diketahui, apa yang belum diketahui, dan apa yang belum bisa dilakukan, audiens dapat memahami informasi yang diterima dengan lebih jelas dan akurat.",
    boundaryCondition: "Tidak semua ketidakpastian perlu dijelaskan panjang lebar. Sesuaikan dengan pentingnya informasi dan risiko jika terjadi kesalahpahaman. Dalam situasi darurat, prioritaskan langkah yang jelas dan informasi layanan yang sudah diverifikasi.",
    dos: [
      {
        example: "Bercerita bisa membantu sebagian orang, tetapi pengalaman dan dampaknya bisa berbeda-beda.",
        why: "Menyampaikan kemungkinan manfaat tanpa menjanjikan hasil yang pasti atau berlaku untuk semua orang."
      },
      {
        example: "Menungsa belum menyediakan layanan krisis 24 jam. Kalau kamu butuh bantuan segera, cari layanan darurat atau pergi ke fasilitas kesehatan terdekat bersama orang yang kamu percaya.",
        why: "Menjelaskan dengan terbuka apa yang belum bisa Menungsa lakukan, sambil tetap memberi langkah yang jelas saat keselamatan menjadi prioritas."
      }
    ],
    donts: [
      {
        example: "Bercerita terbukti membuat laki-laki merasa lebih baik.",
        why: "Terdengar terlalu pasti, seolah hasilnya akan sama untuk semua orang."
      },
      {
        example: "Kalau situasinya dirasa darurat, mungkin kamu bisa coba mencari bantuan profesional kalau merasa perlu.",
        why: "Terlalu ragu untuk situasi yang justru membutuhkan arahan yang jelas.\n---"
      }
    ]
  },
  {
    id: "V6",
    title: "Tindakan, Bukan Tuntutan",
    voiceTrait: "Jelaskan secara konkret apa yang Menungsa lakukan, pilih, atau ubah. Saat menyatakan nilai atau sikap, tunjukkan bagaimana hal itu diterapkan dalam tindakan.",
    positionNote: "Mengatakan apa yang “seharusnya” dilakukan orang lain (misalnya, “laki-laki harus...”) dapat terasa seperti tekanan terhadap kebebasan mereka untuk memilih, sehingga memicu sikap defensif atau penolakan. Menunjukkan apa yang Menungsa lakukan sendiri memberi contoh tanpa memaksa dan membuat sikap lebih nyata lewat praktiknya.",
    boundaryCondition: "Ada situasi ketika Menungsa perlu menyampaikan batas atau sikap dengan tegas, terutama terkait keselamatan, kekerasan, diskriminasi, atau tindakan yang merugikan orang lain. Dalam situasi seperti ini, ketegasan tetap perlu diikuti dengan penjelasan tentang apa yang akan Menungsa lakukan atau batas apa yang akan Menungsa pegang.",
    dos: [
      {
        example: "Kami ingin Ruang MENdukung menjadi tempat yang aman untuk bercerita. Karena itu, sebelum sesi dimulai, setiap peserta menyepakati aturan mengobrol dan kerahasiaan bersama.",
        why: "Menunjukkan bagaimana nilai “ruang aman” diterapkan lewat aturan dan kebiasaan yang jelas."
      },
      {
        example: "Kami tidak akan membagikan cerita peserta ke publik tanpa izin. Kalau ada bagian yang ingin digunakan, kami akan meminta persetujuan terlebih dahulu.",
        why: "Menunjukkan komitmen lewat tindakan yang jelas, bukan hanya lewat pernyataan."
      }
    ],
    donts: [
      {
        example: "Kalau kesehatan mental laki-laki mau membaik, laki-laki harus mulai terbuka dan berhenti gengsi.",
        why: "Menuntut audiens untuk berubah tanpa menunjukkan apa yang Menungsa lakukan untuk membantu menciptakan perubahan tersebut."
      },
      {
        example: "Menungsa berkomitmen menciptakan ruang aman untuk semua laki-laki.",
        why: "Menyatakan nilai yang baik, tetapi belum menunjukkan tindakan atau praktik yang membuat ruang tersebut lebih aman.\n---"
      }
    ]
  }
];

interface PlaybookItem {
  id: string;
  category: string;
  categoryLabel: string;
  action: string;
  rationale: string;
  doText: string;
  doWhy: string;
  dontText: string;
  dontWhy: string;
}

const PLAYBOOK_ITEMS: PlaybookItem[] = [
  {
    id: 'R01',
    category: 'REGULATION',
    categoryLabel: 'Keterbukaan dan privasi',
    action: 'Jadikan langkah pertama kecil, privat, dan tanpa beban komitmen',
    rationale: 'Jelaskan langkah pertama, siapa yang dapat melihat respons pembaca, dan apakah ia bisa berhenti. Ini usulan berdasarkan sintesis, bukan bukti bahwa satu pendekatan selalu lebih efektif.',
    doText: 'Sesi berikutnya Selasa pukul 19.00. Boleh datang, boleh sekadar duduk mengamati dulu.',
    doWhy: 'Memberikan pilihan leluasa sehingga hadir ke lokasi bukan berarti terikat komitmen apa pun.',
    dontText: 'Yuk tumpahkan semua unek-unekmu di kolom komentar postingan ini!',
    dontWhy: 'Ajakan ini meminta pengalaman pribadi dibagikan di kolom komentar yang terbuka.'
  },
  {
    id: 'R02',
    category: 'FRAMING',
    categoryLabel: 'Maskulinitas & Martabat',
    action: 'Gunakan latar situasi nyata agar emosi hadir secara alami',
    rationale: 'Gunakan situasi yang relevan sebagai pembuka. Istilah klinis tetap dapat dijelaskan saat dibutuhkan, tanpa mendiagnosis pembaca.',
    doText: 'Jam tiga pagi, lampu kamar sudah mati, tapi jari masih terus menggulir layar ponsel.',
    doWhy: 'Satu situasi yang nyata terlihat, tanpa melabeli perasaan, tanpa memaksa pembaca mengakui kerapuhan.',
    dontText: 'Kenali 5 tanda kamu sedang mengalami depresi berat dan gangguan mental!',
    dontWhy: 'Judul ini menyatakan diagnosis pembaca sebelum ada penilaian profesional.'
  },
  {
    id: 'R03',
    category: 'AUDIENCE_DEFENSE',
    categoryLabel: 'Ajakan tanpa paksaan',
    action: 'Tawarkan kendali mandiri dengan pilihan sukarela yang nyata',
    rationale: 'Bahasa yang menekan kebebasan memilih dapat memicu penolakan. Temuan ini tidak khusus pada laki-laki.',
    doText: 'Ada dua hal kecil yang bisa dicoba malam ini: jalan santai 15 menit atau mandi air hangat sebelum tidur.',
    doWhy: 'Memberi opsi dan membiarkan pembaca memilih sendiri ritme yang paling nyaman baginya.',
    dontText: 'Kamu harus berhenti memendam emosi dan wajib konsultasi sekarang juga!',
    dontWhy: 'Mendikte dengan nada menggurui yang langsung memicu sikap defensif.'
  },
  {
    id: 'R04',
    category: 'REGISTER',
    categoryLabel: 'Ragam Bahasa',
    action: 'Gunakan “kamu” sebagai sapaan utama dalam panduan Menungsa',
    rationale: '“Kamu” dipilih sebagai sapaan utama Menungsa. Sesuaikan dengan hubungan penulis dan pembaca serta konteks layanan.',
    doText: 'Ketika tubuhmu memberi sinyal lelah yang berkepanjangan, dengarkan.',
    doWhy: 'Bicara jujur sebagai pendamping yang menghormati jarak sosial pembaca.',
    dontText: 'Halo bro/cuy, gimana kabar mental lo hari ini? Curhat yuk sama mimin!',
    dontWhy: 'Organisasi yang memaksakan bahasa gaul anak muda terdengar canggung dan tidak autentik.'
  },
  {
    id: 'R05',
    category: 'FRAMING',
    categoryLabel: 'Maskulinitas & Martabat',
    action: 'Jaga pilihan pembaca saat membahas pengalaman pribadi',
    rationale: 'Di ruang publik, hindari meminta pembaca mengungkap pengalaman pribadi. Topik emosi tetap dapat dibahas; sediakan pilihan untuk merespons secara privat.',
    doText: 'Di linimasa publik: bahas pengalaman sehari-hari dan emosi tanpa meminta pembaca menceritakan masalahnya di komentar.',
    doWhy: 'Pembaca dapat mengikuti pembahasan tanpa perlu membagikan pengalaman pribadi.',
    dontText: 'Share di kolom komentar, cerita paling sedih atau aib rumah tangga yang selama ini kamu pendam dari pasanganmu!',
    dontWhy: 'Meminta pembongkaran privasi keluarga di linimasa terbuka yang melanggar batas martabat pria di ruang publik.'
  },
  {
    id: 'R06',
    category: 'AUDIENCE_DEFENSE',
    categoryLabel: 'Ajakan tanpa paksaan',
    action: 'Hindari label "Pria Sejati", "Cowok Alfa", atau kasta maskulinitas',
    rationale: 'Menungsa menghindari label yang menjadikan harga diri laki-laki bergantung pada standar ketangguhan atau pencapaian.',
    doText: 'Menyelesaikan pekerjaan dengan tuntas dan menjaga keluarga tetap aman.',
    doWhy: 'Fokus pada tanggung jawab dan fungsi nyata tanpa embel-embel jargon maskulinitas.',
    dontText: 'Cowok yang bernilai tinggi itu nggak kenal kata menyerah. Buktikan kamu punya mental baja untuk sukses!',
    dontWhy: 'Slogan hustle/manosphere klise yang menekan pembaca dengan tuntutan performa semu.'
  }
];

/** Reader-facing name per value id, handed to the spectrum as its row labels. */
const VALUE_TITLES: Record<string, string> = Object.fromEntries(
  VALUE_PILLARS.map((v) => [v.id, v.title]),
);

const VOICE_TRAITS = [
  'Akrab',
  'Empatik',
  'Mendukung',
  'Reflektif',
  'Tidak Menghakimi',
  'Berorientasi pada Kekuatan',
  'Hangat',
  'Male-Friendly'
];

export const VoiceFoundationsView: React.FC<Props> = ({ onNavigate }) => {
  const [activeValueId, setActiveValueId] = useState<string>('V1');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Semua panduan' },
    { id: 'REGULATION', label: 'Keterbukaan dan privasi' },
    { id: 'REGISTER', label: 'Ragam Bahasa & Kata Ganti' },
    { id: 'FRAMING', label: 'Maskulinitas & Martabat' },
    { id: 'AUDIENCE_DEFENSE', label: 'Mencegah Resistensi' },
  ];

  const filteredRules = PLAYBOOK_ITEMS.filter((r) => {
    if (selectedCategory === 'all') return true;
    return r.category === selectedCategory;
  });


  return (
    <div className="space-y-12 pb-16">
      {/* Seamless Editorial Hero Banner — Photography as immersive canvas with cinematic scrim */}
      <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-stone-800/90 bg-stone-950 min-h-[480px] sm:min-h-[520px] lg:min-h-[560px] flex flex-col justify-between p-6 sm:p-8 md:p-10 lg:p-12 shadow-2xl">
        {/* Full-bleed background photograph */}
        <img
          src="/brand/menungsa-cover.png"
          alt="Dokumentasi interaksi diskusi autentik Menungsa"
          className="absolute inset-0 w-full h-full object-cover object-[75%_center] lg:object-[80%_center] scale-[1.01] pointer-events-none select-none"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />

        {/* Multi-layer cinematic scrim gradients for AAA legibility */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/90 sm:via-stone-950/80 md:via-stone-950/70 to-stone-950/40 lg:to-stone-950/20 pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-stone-950/70 via-transparent to-transparent pointer-events-none"
          aria-hidden="true"
        />

        {/* Top Header Row: Frosted Glass Badge */}
        <div className="relative z-10 flex items-center justify-start">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-950/70 backdrop-blur-md border border-stone-700/60 text-xs font-medium text-amber-300 shadow-xs">
            <Sparkles size={13} className="text-amber-500 dark:text-amber-400" />
            <span className="tracking-wide">Panduan Menulis di Menungsa</span>
          </div>
        </div>

        {/* Middle Stage: Editorial Headline & Actions */}
        <div className="relative z-10 my-4 sm:my-6 space-y-4 sm:space-y-5 max-w-2xl">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-serif font-medium tracking-tight text-stone-100 leading-[1.12]">
            Cara Menungsa Berbicara dan Bertutur Kata
          </h1>

          <p className="text-sm sm:text-base md:text-lg leading-relaxed text-stone-200/90 font-sans max-w-xl text-balance">
            Menungsa berbicara dengan mengandalkan apa yang telah menjadi kekuatan pembaca, tidak menggurui, serta hadir sebagai sosok yang merangkul dan mendukung.
          </p>

          {/* Unlimited Scrolling Voice Traits Ticker */}
          <div
            className="w-full max-w-xl overflow-hidden py-1.5 my-1 opacity-80 hover:opacity-100 transition-opacity duration-300"
            style={{
              maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
              WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
            }}
          >
            <div className="animate-marquee gap-2.5 items-center">
              {[...VOICE_TRAITS, ...VOICE_TRAITS, ...VOICE_TRAITS, ...VOICE_TRAITS].map((trait, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-3.5 py-1 rounded-full text-xs sm:text-[13px] font-serif text-stone-200/90 bg-stone-900/50 border border-stone-700/40 shadow-xs backdrop-blur-xs whitespace-nowrap select-none tracking-wide"
                >
                  <span>{trait}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('studio')}
              className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs sm:text-sm transition-[scale,background-color] duration-150 ease-out shadow-raised flex items-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.96]"
            >
              <span>Contoh penulisan</span>
              <ArrowRight size={15} />
            </button>
            <button
              onClick={() => onNavigate('sandbox')}
              className="px-5 py-3 rounded-xl bg-stone-900/80 hover:bg-stone-800/90 text-stone-200 border border-stone-700/70 backdrop-blur-md font-medium text-xs sm:text-sm transition-[scale,background-color] duration-150 ease-out cursor-pointer hover:scale-[1.02] active:scale-[0.96]"
            >
              <span>Cek tulisanmu</span>
            </button>
            <button
              onClick={() => onNavigate('lexicon')}
              className="hidden sm:inline-flex px-4 py-3 rounded-xl bg-stone-950/50 hover:bg-stone-900/70 text-stone-300 border border-stone-800/80 backdrop-blur-md text-xs sm:text-sm transition-[scale,background-color] duration-150 ease-out cursor-pointer"
            >
              <span>Pemilihan kata</span>
            </button>
          </div>
        </div>
      </section>

      {/* 6 Core Pillars of Writing — Spektrum Voice Menungsa */}
      <section className="space-y-6">
        <ValueSpectrum
          values={brandValues}
          rowTitles={VALUE_TITLES}
          selectedId={activeValueId}
          onSelect={(id) => setActiveValueId(id === activeValueId ? '' : id)}
          renderDetail={(id) => {
            const val = VALUE_PILLARS.find((v) => v.id === id);
            if (!val) return null;
            return (
              <div className="space-y-5">
                <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:gap-6 lg:items-start">
                  <div className="space-y-2.5">
                    <span className="inline-block rounded-full border border-amber-900 bg-amber-950 px-3 py-1 text-[10px] font-sans font-bold uppercase tracking-[0.18em] text-amber-500">
                      VALUE {val.id.replace('V', '').padStart(2, '0')}
                    </span>
                    <h5 className="font-serif text-xl sm:text-2xl font-semibold text-stone-100 leading-tight">
                      Karakter Suara
                    </h5>
                    <p className="text-[13.5px] sm:text-sm text-stone-400 leading-[1.65] font-sans">
                      {val.voiceTrait}
                    </p>
                  </div>

                  <div className="rounded-xl border border-stone-800 bg-stone-950 p-4 sm:p-5">
                    <div className="flex items-start gap-3">
                      <span className="h-9 w-9 shrink-0 rounded-[8px] border border-mn-gold-mid bg-mn-gold-soft text-mn-blue dark:border-mn-gold-mid/45 dark:bg-mn-gold-mid/15 dark:text-mn-gold flex items-center justify-center">
                        <Lightbulb size={17} strokeWidth={1.9} />
                      </span>
                      <div className="space-y-1.5 min-w-0">
                        <h6 className="text-[10.5px] font-sans font-bold uppercase tracking-[0.14em] text-stone-400">
                          Mengapa ini penting
                        </h6>
                        <p className="text-[13.5px] text-stone-400 leading-[1.6] font-sans">
                          {val.positionNote}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-stone-800 bg-stone-950 p-4">
                  <span className="h-9 w-9 shrink-0 rounded-[8px] border border-emerald-900 bg-emerald-950 text-emerald-700 dark:border-emerald-800 dark:text-emerald-400 flex items-center justify-center">
                    <ShieldCheck size={17} strokeWidth={1.9} />
                  </span>
                  <p className="text-[13px] text-stone-400 leading-[1.65] font-sans">
                    <strong className="text-stone-100 font-semibold">Kapan perlu disesuaikan:</strong> {val.boundaryCondition}
                  </p>
                </div>

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
                  emptySlot={<span className="text-stone-500 italic">-</span>}
                  rows={Array.from({
                    length: Math.max(val.dos.length, val.donts.length),
                  }).map((_, idx) => {
                    const d = val.dos[idx];
                    const dt = val.donts[idx];
                    return {
                      id: `${val.id}-${idx}`,
                      positive: d && (
                        <>
                          <p className="font-serif italic text-emerald-300 leading-snug">"{d.example}"</p>
                          <p className="text-[13px] text-stone-300 leading-relaxed font-sans">{d.why}</p>
                        </>
                      ),
                      negative: dt && (
                        <>
                          <p className="font-serif italic text-rose-300 leading-snug">"{dt.example}"</p>
                          <p className="text-[13px] text-stone-300 leading-relaxed font-sans">{dt.why}</p>
                        </>
                      ),
                    };
                  })}
                />
              </div>
            );
          }}
        />

      </section>

      {/* New Context Check Component replacing Framing Matrix */}
      <ContextCheck />

      {/* The Golden Do's & Don'ts Playbook */}
      <section className="rounded-2xl sm:rounded-3xl border border-stone-800 bg-stone-900 p-5 sm:p-7 lg:p-9 space-y-7">
        <div className="space-y-5">
          <div className="flex items-start gap-3.5">
            <span className="h-10 w-10 shrink-0 rounded-[10px] border border-amber-900 bg-amber-950 text-amber-500 flex items-center justify-center">
              <SlidersHorizontal size={18} strokeWidth={1.9} />
            </span>
            <div className="space-y-1 pt-0.5">
              <h2 className="text-xl md:text-2xl font-serif font-semibold text-stone-100 leading-tight">
                Panduan singkat menulis
              </h2>
              <p className="text-xs md:text-sm text-stone-500 font-sans leading-relaxed max-w-[64ch]">
                Gunakan contoh berikut untuk meninjau cara menyapa, mengajak, dan menjelaskan informasi kepada pembaca.
              </p>
            </div>
          </div>

          <SegmentedTabs
            items={categories}
            value={selectedCategory}
            onChange={setSelectedCategory}
            ariaLabel="Panduan singkat menulis"
          />
        </div>

        {/* Playbook Rules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredRules.map((rule) => (
            <div
              key={rule.id}
              className="rounded-xl border border-stone-800 bg-stone-950 p-5 space-y-3.5 hover:border-stone-700 transition-colors"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-sans font-bold uppercase tracking-[0.14em] text-amber-500">
                  {rule.categoryLabel}
                </span>
                <h3 className="text-base font-serif font-semibold text-stone-100 leading-snug">
                  {rule.action}
                </h3>
              </div>

              <p className="text-[13px] text-stone-500 leading-[1.65] font-sans">
                {rule.rationale}
              </p>

              <ComparisonTable
                dense
                className="mt-3"
                positiveLabel={
                  <>
                    <CheckCircle2 size={13} className="shrink-0 text-emerald-400" />
                    <span>DO</span>
                  </>
                }
                negativeLabel={
                  <>
                    <XCircle size={13} className="shrink-0 text-rose-500 dark:text-rose-400" />
                    <span>DON'T</span>
                  </>
                }
                rows={[
                  {
                    id: rule.id,
                    positive: (
                      <>
                        <p className="font-serif italic text-emerald-300 leading-snug">"{rule.doText}"</p>
                        <p className="text-[13px] text-stone-400 leading-[1.6]">{rule.doWhy}</p>
                      </>
                    ),
                    negative: (
                      <>
                        <p className="font-serif italic text-rose-300 leading-snug">"{rule.dontText}"</p>
                        <p className="text-[13px] text-stone-400 leading-[1.6]">{rule.dontWhy}</p>
                      </>
                    ),
                  },
                ]}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
