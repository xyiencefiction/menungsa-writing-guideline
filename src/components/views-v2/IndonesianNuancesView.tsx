import React, { useState } from 'react';
import { 
  MapPin, 
  Eye, 
  ShieldCheck, 
  Scale, 
  CheckCircle2,
  XCircle
} from 'lucide-react';

interface ExamplePair {
  example: string;
  why: string;
}

interface ContrastItem {
  id: string;
  dimension: string;
  status: 'CONVERGES' | 'DIVERGES' | 'GAP';
  statusLabel: string;
  north?: number;
  south?: number;
  note: string;
  writerImplication: string;
  dos: ExamplePair;
  donts: ExamplePair;
}

const INDONESIAN_CONTRASTS: ContrastItem[] = [
  {
    id: 'KT01',
    dimension: 'Komunitas & Kebersamaan Sebaya',
    status: 'CONVERGES',
    statusLabel: 'Berlaku Sama di Indonesia',
    north: 77,
    south: 82,
    note: 'Komunitas banyak dibahas dalam sumber yang ditelaah, termasuk enam studi Indonesia. Kemunculan tema tidak membuktikan bahwa suatu pilihan kata atau format komunitas efektif.',
    writerImplication: 'Gunakan kebersamaan sebagai salah satu cara membangun hubungan, tanpa menganggap kedekatan harus dimulai dari cerita pribadi. Buat orang bisa hadir dan ikut kegiatan tanpa harus membuktikan keterbukaan atau keakraban.',
    dos: {
      example: 'Minggu pagi kita jalan santai di [lokasi]. Datang buat jalan bareng aja juga boleh—nggak ada sesi cerita wajib.',
      why: 'Mengajak berkumpul melalui aktivitas bersama tanpa beban tuntutan psikologis.'
    },
    donts: {
      example: 'Kalau kamu merasa kesepian, datang dan ceritakan apa yang selama ini kamu pendam ke kelompok.',
      why: 'Melabeli pria sebagai sosok kesepian yang menyedihkan dan menuntut keterbukaan di depan orang asing.'
    }
  },
  {
    id: 'KT02',
    dimension: 'Realitas Finansial & Beban Ekonomi',
    status: 'CONVERGES',
    statusLabel: 'Berlaku Sama di Indonesia',
    north: 67,
    south: 76,
    note: 'Kondisi ekonomi merupakan bagian penting dalam sumber yang ditelaah. Temuan ini tidak mengukur seberapa berat tekanan ekonomi setiap pembaca.',
    writerImplication: 'Pertimbangkan biaya hidup, pendapatan, waktu kerja, dan tanggungan ketika menyarankan bantuan atau perubahan perilaku. Jangan menganggap keterbatasan uang sebagai kurangnya komitmen terhadap kesehatan mental.',
    dos: {
      example: 'Dengan penghasilan yang sama, kebutuhan makan, transportasi, cicilan, dan kiriman ke keluarga bisa saling berebut porsi. Sulit menyisihkan biaya untuk bantuan bukan otomatis soal kurang disiplin mengatur uang.',
      why: 'Menghormati perjuangan nafkah konkret tanpa mereduksinya menjadi istilah batin yang abstrak.'
    },
    donts: {
      example: 'Kesehatan mental harus jadi prioritas. Kalau memang serius, pasti ada cara menyisihkan uang untuk terapi.',
      why: 'Meremehkan kenyataan hidup dan terdengar elitis bagi pria yang menanggung beban ekonomi keluarga.'
    }
  },
  {
    id: 'KT03',
    dimension: 'Tuntutan Harus Tangguh & Pantang Lemah',
    status: 'CONVERGES',
    statusLabel: 'Berlaku Sama di Indonesia',
    north: 25,
    south: 24,
    note: 'Tema tuntutan untuk terlihat tangguh muncul dengan frekuensi yang berdekatan dalam kelompok studi Global North dan Global South. Ini bukan ukuran kekuatan norma pada seluruh penduduk Indonesia.',
    writerImplication: 'Jangan melawan tuntutan “laki-laki harus kuat” dengan standar baru tentang seperti apa laki-laki yang benar-benar kuat. Pisahkan kebutuhan akan bantuan, istirahat, atau keterbukaan dari ukuran maskulinitas.',
    dos: {
      example: 'Belum siap cerita bukan berarti kamu gagal menghadapi masalah. Kamu bisa mulai dari bagian yang terasa cukup aman untuk dibicarakan—atau cukup mendengarkan dulu.',
      why: 'Memberi ruang untuk beristirahat tanpa tuntutan membuktikan produktivitas.'
    },
    donts: {
      example: 'Laki-laki yang benar-benar kuat justru berani terbuka dan menangis.',
      why: 'Menggurui, mencela harga diri pria, dan menuntut kerapuhan secara agresif.'
    }
  },
  {
    id: 'KT04',
    dimension: 'Peran Agama, Takdir & Ikhtiar',
    status: 'DIVERGES',
    statusLabel: 'Berbeda di Indonesia',
    north: 5,
    south: 34,
    note: 'Agama dibahas dengan frekuensi berbeda dalam kelompok studi Global North dan Global South. Pengaruhnya terhadap pencarian bantuan dapat berbeda menurut keyakinan dan konteks.',
    writerImplication: 'Gunakan kerangka agama atau spiritualitas ketika memang relevan bagi penutur atau audiens. Jangan menjelaskan masalah kesehatan mental sebagai ukuran kualitas iman, dan jangan memosisikan dukungan spiritual serta layanan profesional sebagai dua pilihan yang harus saling menggantikan.',
    dos: {
      example: 'Kalau doa atau ibadah penting bagimu, itu bisa tetap menjadi bagian dari caramu menghadapi masa sulit. Mencari bantuan profesional juga bisa berjalan bersamaan.',
      why: 'Menghormati keyakinan pembaca tanpa membuat klaim tentang keimanan atau hasil pengobatan.'
    },
    donts: {
      example: 'Kalau kamu masih cemas, mungkin kamu perlu memperbaiki ibadah dulu sebelum mencari bantuan lain.',
      why: 'Menghakimi keimanan seseorang dan memicu rasa bersalah religius yang melumpuhkan.'
    }
  },
  {
    id: 'KT05',
    dimension: 'Pencarian Bantuan Mandiri vs Peran Keluarga',
    status: 'DIVERGES',
    statusLabel: 'Perbedaan Konteks',
    note: 'Dalam beberapa studi Indonesia, pasangan dan keluarga ikut mengatur akses perawatan. Keterlibatan mereka perlu mempertimbangkan persetujuan dan keamanan orang yang dibantu.',
    writerImplication: 'Keluarga dapat menjadi sumber dukungan sekaligus tekanan. Jangan otomatis melibatkan keluarga dalam keputusan kesehatan seseorang; beri pembaca pilihan tentang siapa yang ingin mereka libatkan.',
    dos: {
      example: 'Kalau kamu ingin ditemani saat mencari bantuan, pilih orang yang kamu percaya. Kamu juga boleh memilih mengurusnya sendiri.',
      why: 'Memberi panduan praktis dan suportif bagi orang terdekat tanpa melanggar privasi pria.'
    },
    donts: {
      example: 'Sebaiknya ceritakan dulu ke keluarga sebelum mencari bantuan profesional.',
      why: 'Mengabaikan kultur gotong royong keluarga Indonesia dan menghakimi kemitraan rumah tangga yang sehat.'
    }
  },
  {
    id: 'KT06',
    dimension: 'Tanggung Jawab Nafkah & Tekanan Ekonomi',
    status: 'DIVERGES',
    statusLabel: 'Perbedaan Konteks',
    note: 'Dalam sumber yang ditelaah, peran pencari nafkah terkait dengan aturan, agama, dan adat. Dampaknya pada setiap orang tidak sama; jangan mengubahnya menjadi tuntutan editorial.',
    writerImplication: 'Akui bahwa tanggung jawab finansial dan peran sebagai pencari nafkah dapat terasa penting bagi sebagian laki-laki. Jangan menjadikan kemampuan memenuhi peran tersebut sebagai ukuran martabat atau nilai diri.',
    dos: {
      example: 'Tanggung jawab pada keluarga bisa terasa penting sekaligus berat. Besarnya penghasilan tidak menentukan seberapa layak seseorang dihargai.',
      why: 'Mengakui tanggung jawab tanpa menjadikan pengorbanan sebagai syarat harga diri.'
    },
    donts: {
      example: 'Sebagai kepala keluarga, kamu harus tetap kuat karena semua orang bergantung padamu.',
      why: 'Menyerang peran etis dan hukum yang dipegang teguh pria Indonesia, memicu penolakan ideologis seketika.'
    }
  },
  {
    id: 'KT07',
    dimension: 'Komunitas sebagai Pelindung Sekaligus Pengawas',
    status: 'DIVERGES',
    statusLabel: 'Perbedaan Konteks',
    note: 'Dalam konteks yang dibahas sumber, dukungan komunitas dapat hadir bersama pengawasan sosial. Istilah Jawa seperti rukun, tepa salira, dan isin perlu dijelaskan tanpa dianggap mewakili semua Indonesia.',
    writerImplication: 'Pertimbangkan bukan hanya apakah suatu ruang disebut “privat”, tetapi siapa yang dapat melihat, merekam, meneruskan, atau mengetahui partisipasi seseorang. Jangan membuat pencarian bantuan menjadi informasi publik tanpa alasan.',
    dos: {
      example: 'Kalau ingin ikut, daftar lewat [jalur privat]. Nama orang yang mendaftar tidak akan dibagikan ke grup tanpa izin.',
      why: 'Contoh informasi privasi; gunakan hanya jika proses tersebut benar-benar tersedia.'
    },
    donts: {
      example: 'Yang mau ikut sesi minggu ini, tulis HADIR di grup supaya kami bisa mendata.',
      why: 'Memaksa pria menantang sanksi sosial lingkungan tempat tinggalnya secara gegabah.'
    }
  },
  {
    id: 'KT08',
    dimension: 'Tempat Pertama Mencari Pertolongan',
    status: 'DIVERGES',
    statusLabel: 'Perbedaan Konteks',
    note: 'Sebagian sumber Indonesia membahas penggunaan beberapa bentuk bantuan, termasuk dukungan keluarga, praktik keagamaan, dan layanan kesehatan. Temuan ini tidak menetapkan satu urutan bantuan untuk semua orang.',
    writerImplication: 'Jangan menganggap layanan profesional selalu menjadi tempat pertama seseorang mencari dukungan. Keluarga, teman, tokoh agama, layanan kesehatan primer, atau sumber lain bisa menjadi pintu awal. Tambahkan pilihan profesional ketika dibutuhkan tanpa merendahkan jalur yang sebelumnya digunakan.',
    dos: {
      example: 'Kalau kamu lebih nyaman mulai dari orang yang sudah kamu percaya, itu bisa menjadi langkah awal. Kalau keluhan terus mengganggu keseharian, kamu juga bisa mencari informasi layanan kesehatan yang tersedia di wilayahmu.',
      why: 'Menjelaskan langkah mencari informasi tanpa menetapkan masa tunggu atau menjanjikan layanan tertentu.'
    },
    donts: {
      example: 'Kalau memang serius ingin membaik, langsung cari psikiater. Ngobrol dengan keluarga atau tokoh agama cuma menunda bantuan.',
      why: 'Arogan, meremehkan kebiasaan turun-temurun, dan membuat biaya pencarian bantuan terasa sangat mahal.'
    }
  },
  {
    id: 'KT09',
    dimension: 'Teman Nongkrong vs Teman Curhat',
    status: 'DIVERGES',
    statusLabel: 'Perbedaan Konteks',
    note: 'Studi sebaya yang dibahas sumber membedakan teman untuk berkegiatan dan teman untuk berbagi masalah pribadi. Temuan ini tidak menggambarkan semua pertemanan laki-laki Indonesia.',
    writerImplication: 'Aktivitas bersama dapat menjadi bentuk hubungan yang bermakna tanpa harus berubah menjadi sesi keterbukaan emosional. Jangan menganggap kedekatan hanya sah ketika orang saling menceritakan masalah pribadi.',
    dos: {
      example: 'Datang buat main, makan, atau duduk bareng juga cukup. Nggak ada sesi cerita wajib.',
      why: 'Mengajak berkegiatan tanpa mewajibkan peserta mengungkap hal pribadi.'
    },
    donts: {
      example: 'Supaya lebih dekat, nanti setiap orang akan cerita masalah pribadi secara bergiliran.',
      why: 'Merusak suasana nongkrong yang rileks dan menciptakan kecanggungan sosial yang fatal.'
    }
  },
  {
    id: 'KT10',
    dimension: 'Maskulinitas Bukan Hambatan Tunggal',
    status: 'GAP',
    statusLabel: 'Belum Cukup Bukti',
    note: 'Dua studi yang dirangkum mengukur hal berbeda: sikap mencari bantuan dan penggunaan layanan primer. Keduanya tidak menetapkan maskulinitas sebagai hambatan utama di seluruh Indonesia.',
    writerImplication: 'Sebelum menjelaskan pencarian bantuan sebagai persoalan malu, gengsi, atau maskulinitas, pertimbangkan juga biaya, jarak, jam layanan, transportasi, ketersediaan tenaga, prosedur rujukan, antrean, dan privasi.',
    dos: {
      example: 'Untuk layanan di [fasilitas], pendaftaran tersedia [waktu], biaya atau skema pembiayaannya [informasi terverifikasi], dan cara mendaftarnya [alur]. Kalau informasi ini berubah, cek kembali melalui [kontak resmi].',
      why: 'Template informasi layanan. Isi bagian dalam kurung siku setelah diverifikasi.'
    },
    donts: {
      example: 'Kalau belum mencari bantuan, mungkin yang menghalangi kamu cuma gengsi.',
      why: 'Mengabaikan kenyataan antrean panjang, jam kerja kantor yang ketat, dan kesulitan birokrasi faskes.'
    }
  },
  {
    id: 'KT11',
    dimension: 'Pentingnya Kehati-hatian Menulis Kalimat',
    status: 'GAP',
    statusLabel: 'Belum Diuji',
    note: 'Dalam korpus ini tidak ditemukan eksperimen acak yang menguji pilihan kata pada laki-laki dewasa Indonesia. Semua contoh di halaman ini adalah usulan penerapan.',
    writerImplication: 'Jangan menggunakan “laki-laki Indonesia” seolah pengalaman mereka seragam. Sebutkan wilayah, kelompok usia, kondisi sosial, atau populasi penelitian ketika relevan, dan jelaskan jika bukti hanya berasal dari kelompok tertentu.',
    dos: {
      example: 'Temuan ini berasal dari laki-laki usia 18–30 tahun di [wilayah/populasi] dan belum tentu menggambarkan pengalaman laki-laki di daerah atau kelompok lain.',
      why: 'Memberi pilihan tanpa menjanjikan respons yang sama pada semua pembaca.'
    },
    donts: {
      example: 'Laki-laki Indonesia biasanya sulit bicara soal perasaan.',
      why: 'Klaim mutlak tanpa dasar bukti empiris yang merusak integritas dan kredibilitas brand.'
    }
  }
];

interface CulturalReality {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  /** Icon tint only — the cards themselves share one surface so the set reads calm. */
  chip: string;
  title: string;
  body: string;
}

const CULTURAL_REALITIES: CulturalReality[] = [
  {
    icon: Eye,
    chip: 'border-amber-900 bg-amber-950 text-amber-500',
    title: 'Siapa yang Bisa Melihat?',
    body: 'Sebelum meminta respons atau cerita pribadi, pertimbangkan siapa yang dapat melihatnya. Di ruang publik atau grup, beri informasi tanpa menuntut pengakuan pribadi. Jika percakapan membutuhkan keterbukaan lebih jauh, sediakan jalur yang lebih privat dan jelaskan batas privasinya.',
  },
  {
    icon: ShieldCheck,
    chip: 'border-emerald-900 bg-emerald-950 text-emerald-700 dark:border-emerald-800 dark:text-emerald-400',
    title: 'Siapa yang Ikut Memengaruhi Keputusan?',
    body: 'Keluarga, teman, komunitas, dan keyakinan dapat menjadi sumber dukungan, tekanan, atau keduanya sekaligus. Jangan menganggap keterlibatan mereka selalu membantu atau selalu menghambat. Beri pembaca pilihan tentang siapa yang ingin mereka libatkan.',
  },
  {
    icon: Scale,
    chip: 'border-sky-900 bg-sky-950 text-sky-700 dark:border-sky-800 dark:text-sky-400',
    title: 'Apa yang Benar-Benar Bisa Diakses?',
    body: 'Jangan menganggap seseorang belum mencari bantuan hanya karena malu atau enggan terbuka. Biaya, jarak, jadwal kerja, transportasi, ketersediaan tenaga, prosedur layanan, dan kekhawatiran soal privasi juga dapat membatasi pilihan. Jika menyarankan layanan, berikan informasi akses yang sudah diverifikasi.',
  },
];

export const IndonesianNuancesView: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'CONVERGES' | 'DIVERGES' | 'GAP'>('all');

  const filteredContrasts = INDONESIAN_CONTRASTS.filter((c) => {
    if (activeFilter === 'all') return true;
    return c.status === activeFilter;
  });

  return (
    <div className="space-y-10 pb-16">
      {/* Header */}
      <div className="space-y-3">
        <div className="kicker flex items-center gap-1.5">
          <MapPin size={12} className="text-amber-500" />
          <span>KOMPAS BUDAYA INDONESIA</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-serif font-semibold tracking-tight text-stone-100 leading-tight">
          Menulis dalam Konteks Indonesia
        </h1>
        <p className="text-sm md:text-base text-stone-300 max-w-[74ch] leading-relaxed font-sans">
          Indonesia bukan satu konteks yang seragam. Hubungan keluarga, agama, kondisi ekonomi, bahasa, akses layanan, dan norma sosial dapat berbeda menurut daerah, usia, kelas sosial, dan lingkungan tempat seseorang hidup. Gunakan panduan ini untuk mempertimbangkan konteks tersebut tanpa menganggap satu pola berlaku bagi semua pembaca.
        </p>
      </div>

      {/* The 3 Golden Cultural Realities */}
      {/* Icon, number, title and body were four stacked layers, so the eye
          re-oriented twice before reaching a sentence. One header line carries
          all three markers, a hairline closes it, and the body follows. The
          ordinal moved out of the heading text — it was printed twice, once as
          the chip's position and once as `1.` in the title. */}
      <ol className="grid grid-cols-1 md:grid-cols-3 gap-5 list-none p-0 m-0">
        {CULTURAL_REALITIES.map((reality, idx) => {
          const Icon = reality.icon;
          return (
            <li
              key={reality.title}
              className="h-full rounded-xl border border-stone-800 bg-stone-900 p-5"
            >
              <div className="flex items-start gap-3 min-h-[3.75rem]">
                <span
                  className={`h-10 w-10 shrink-0 rounded-[9px] border flex items-center justify-center ${reality.chip}`}
                >
                  <Icon size={18} strokeWidth={1.9} />
                </span>
                <div className="min-w-0 flex-1">
                  <span className="block font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-stone-500">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-serif text-base sm:text-[17px] font-semibold text-stone-100 leading-[1.3] mt-0.5 text-balance">
                    {reality.title}
                  </h3>
                </div>
              </div>

              <hr className="my-3.5 border-0 border-t border-stone-800" />

              <p className="text-[13px] text-stone-400 leading-[1.62] font-sans">
                {reality.body}
              </p>
            </li>
          );
        })}
      </ol>

      {/* Practical Comparison Table */}
      <div className="space-y-4">
        <div className="space-y-3">
          <div>
            <h2 className="text-xl md:text-2xl font-serif font-semibold text-stone-100 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              Apa yang Bisa Diterapkan di Indonesia, dan Apa yang Berbeda
            </h2>
            <p className="text-xs md:text-sm text-stone-400 mt-1 font-sans">
              Temuan berikut berasal dari sumber dengan populasi dan metode yang berbeda. Contoh kalimat adalah usulan penerapan, bukan hasil eksperimen pilihan kata di Indonesia.
            </p>
          </div>

          <div role="group" aria-label="Apa yang Bisa Diterapkan di Indonesia, dan Apa yang Berbeda" className="ctl-row no-scrollbar scroll-hint-x">
            <button
              onClick={() => setActiveFilter('all')}
              aria-pressed={activeFilter === 'all'}
              className={`px-3 py-1.5 rounded-[6px] text-xs font-sans whitespace-nowrap transition cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-amber-500 text-[#F1ECDF] font-semibold shadow-raised'
                  : 'bg-stone-900 border border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              Semua Dimensi ({INDONESIAN_CONTRASTS.length})
            </button>
            <button
              onClick={() => setActiveFilter('CONVERGES')}
              aria-pressed={activeFilter === 'CONVERGES'}
              className={`px-3 py-1.5 rounded-[6px] text-xs font-sans whitespace-nowrap transition cursor-pointer ${
                activeFilter === 'CONVERGES'
                  ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-500 dark:text-emerald-300 font-semibold'
                  : 'bg-stone-900 border border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              ✓ Pola Serupa
            </button>
            <button
              onClick={() => setActiveFilter('DIVERGES')}
              aria-pressed={activeFilter === 'DIVERGES'}
              className={`px-3 py-1.5 rounded-[6px] text-xs font-sans whitespace-nowrap transition cursor-pointer ${
                activeFilter === 'DIVERGES'
                  ? 'bg-amber-500/20 border border-amber-500/40 text-amber-500 dark:text-amber-300 font-semibold'
                  : 'bg-stone-900 border border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              ✕ Perbedaan Konteks
            </button>
            <button
              onClick={() => setActiveFilter('GAP')}
              aria-pressed={activeFilter === 'GAP'}
              className={`px-3 py-1.5 rounded-[6px] text-xs font-sans whitespace-nowrap transition cursor-pointer ${
                activeFilter === 'GAP'
                  ? 'bg-sky-500/20 border border-sky-500/40 text-sky-400 font-semibold'
                  : 'bg-stone-900 border border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              ? Belum Cukup Bukti
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredContrasts.map((item) => (
            <div
              key={item.id}
              className="rounded-[9px] border border-stone-800 bg-stone-900/50 p-5 md:p-6 space-y-4 hover:border-stone-700 transition flex flex-col justify-between shadow-raised"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2 border-b border-stone-800 pb-3">
                  <div>
                    <h4 className="text-lg font-serif font-semibold text-stone-100">
                      {item.dimension}
                    </h4>
                  </div>
                  <span
                    className={`text-[10px] font-sans px-2.5 py-1 rounded-[6px] font-bold uppercase shrink-0 tracking-wider ${
                      item.status === 'CONVERGES'
                        ? 'bg-emerald-500/20 text-emerald-500 dark:text-emerald-300 border border-emerald-500/30'
                        : item.status === 'GAP'
                        ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                        : 'bg-amber-500/20 text-amber-500 dark:text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {item.statusLabel}
                  </span>
                </div>

                <p className="text-xs md:text-sm text-stone-300 leading-relaxed font-sans">
                  {item.note}
                </p>

                <div className="rounded-[6px] bg-stone-950/70 p-3.5 border border-stone-800/80 text-xs space-y-1 font-sans">
                  <span className="kicker block">
                    Saran untuk penulis
                  </span>
                  <p className="text-stone-200 leading-relaxed font-medium">
                    {item.writerImplication}
                  </p>
                </div>

                {/* Concrete Sentence Examples (Do vs Don't) */}
                <div className="space-y-2.5 pt-1">
                  <span className="text-[10px] font-sans font-bold text-stone-400 uppercase tracking-wider block">
                    Contoh ilustratif
                  </span>
                  
                  {/* DO */}
                  <div className="rounded-[6px] border border-emerald-500/25 bg-emerald-950/20 p-3 space-y-1">
                    <div className="flex items-center gap-1.5 text-emerald-500 dark:text-emerald-400 text-xs font-sans font-bold uppercase">
                      <CheckCircle2 size={13} />
                      <span>Do</span>
                    </div>
                    <p className="font-serif italic text-xs md:text-sm text-emerald-700 dark:text-emerald-200 leading-relaxed">
                      "{item.dos.example}"
                    </p>
                    <p className="text-xs text-stone-300 leading-relaxed font-sans">
                      {item.dos.why}
                    </p>
                  </div>

                  {/* DON'T */}
                  <div className="rounded-[6px] border border-amber-700/25 bg-amber-950/20 p-3 space-y-1">
                    <div className="flex items-center gap-1.5 text-amber-500 dark:text-amber-400 text-xs font-sans font-bold uppercase">
                      <XCircle size={13} />
                      <span>Don't</span>
                    </div>
                    <p className="font-serif italic text-xs md:text-sm text-amber-700 dark:text-amber-200 leading-relaxed">
                      "{item.donts.example}"
                    </p>
                    <p className="text-xs text-stone-300 leading-relaxed font-sans">
                      {item.donts.why}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-800/60 text-xs font-sans text-stone-400">
                {item.north !== undefined && item.south !== undefined ? (
                  <div className="space-y-2">
                    <div className="space-y-1" title="Frekuensi tema dalam kelompok studi Global North (154 studi)">
                      <span className="block">Studi Global North: <strong className="text-stone-300 font-semibold font-mono tabular-nums">{item.north}%</strong></span>
                      <div className="h-1.5 w-full rounded-full bg-stone-800 overflow-hidden" aria-hidden="true">
                        <div className="h-full rounded-full bg-stone-500" style={{ width: `${item.north}%` }} />
                      </div>
                    </div>
                    <div className="space-y-1" title="Frekuensi tema dalam kelompok studi Global South (154 studi)">
                      <span className="block">Studi Global South: <strong className="text-amber-500 font-semibold font-mono tabular-nums">{item.south}%</strong></span>
                      <div className="h-1.5 w-full rounded-full bg-stone-800 overflow-hidden" aria-hidden="true">
                        <div className="h-full rounded-full bg-amber-500" style={{ width: `${item.south}%` }} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <span className="text-[11px] text-stone-500 font-sans italic">
                    Tidak tersedia angka pembanding dalam sumber
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
