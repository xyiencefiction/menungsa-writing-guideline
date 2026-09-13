import React, { useState } from 'react';
import { 
  Users, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  Compass,
  Check,
  X,
  HeartHandshake
} from 'lucide-react';
import { RegisterMap, LunarPips, MoonPhase } from '../charts/RegisterMap';
import { handleTablistKeys } from '../../utils/overlay';
import { languageRegisters } from '../../data';
import { SegmentedTabs } from '../common/SegmentedTabs';

interface RegisterItem {
  id: string;
  name: string;
  authorityLevel: number;
  intimacyLevel: number;
  socialRelationship: string;
  impression: string;
  risks: string;
  contexts: string;
  example: string;
}

const REGISTERS: RegisterItem[] = [
  {
    id: 'kamu',
    name: 'kamu',
    authorityLevel: 3,
    intimacyLevel: 3,
    socialRelationship: 'Langsung, personal, dan cukup netral untuk banyak konteks. Menjadi sapaan utama Menungsa ketika berbicara langsung kepada pembaca.',
    impression: 'Menyapa pembaca secara langsung. Kehangatannya bergantung pada kalimat dan konteks.',
    risks: 'Bisa terasa menggurui jika terlalu sering dipasangkan dengan tuntutan seperti "kamu harus", "kamu wajib", atau kesimpulan tentang pengalaman pembaca.',
    contexts: 'Konten edukasi, panduan praktis, caption, halaman website, email umum, dan komunikasi langsung yang tidak membutuhkan formalitas tinggi.',
    example: 'Kalau belakangan ada yang terasa berbeda dari rutinitasmu, coba perhatikan perubahan yang paling mudah kamu kenali dulu.'
  },
  {
    id: 'Anda',
    name: 'Anda',
    authorityLevel: 5,
    intimacyLevel: 1,
    socialRelationship: 'Formal, sopan, dan menjaga jarak profesional.',
    impression: 'Cocok untuk konteks yang memerlukan sapaan formal. Kata ganti ini tidak menjamin kerahasiaan layanan.',
    risks: 'Bisa terasa kaku atau terlalu institusional dalam percakapan yang seharusnya personal dan setara.',
    contexts: 'Dokumen formal, kebijakan privasi, persetujuan, korespondensi resmi, atau komunikasi dengan institusi dan profesional.',
    example: 'Data yang Anda berikan hanya akan digunakan sesuai tujuan yang dijelaskan pada formulir ini.'
  },
  {
    id: 'kita',
    name: 'kita',
    authorityLevel: 2,
    intimacyLevel: 4,
    socialRelationship: 'Menempatkan penulis dan pembaca dalam tindakan, ruang, atau pengalaman yang memang dibagi bersama.',
    impression: 'Menunjukkan kebersamaan tanpa mengasumsikan pengalaman semua orang sama.',
    risks: 'Mudah berubah menjadi asumsi palsu ketika penulis berbicara seolah semua orang mengalami hal yang sama.',
    contexts: 'Kegiatan bersama, refleksi kolektif yang benar-benar relevan, atau penjelasan tentang sesuatu yang dilakukan Menungsa bersama peserta.',
    example: 'Sebelum sesi dimulai, kita akan membaca aturan percakapan dan kerahasiaan bersama.'
  },
  {
    id: 'kami',
    name: 'kami',
    authorityLevel: 3,
    intimacyLevel: 2,
    socialRelationship: 'Mewakili Menungsa sebagai tim atau organisasi dan membedakan tindakan organisasi dari tindakan pembaca.',
    impression: 'Memperjelas bahwa Menungsa yang menyampaikan pesan.',
    risks: 'Bisa terasa berjarak jika dipakai untuk seluruh tulisan, tetapi penting ketika Menungsa perlu mengambil tanggung jawab atas keputusan, batas, atau tindakannya sendiri.',
    contexts: 'Kebijakan, transparansi program, laporan, pernyataan sikap, metode kerja, dan penjelasan tentang apa yang Menungsa lakukan.',
    example: 'Kami tidak akan membagikan cerita peserta ke publik tanpa izin.'
  },
  {
    id: 'gue',
    name: 'gue / gua',
    authorityLevel: 1,
    intimacyLevel: 5,
    socialRelationship: 'Ragam orang pertama yang santai dan sangat bergantung pada kebiasaan penutur. Umum dalam sebagian lingkungan urban, terutama ragam Jakarta dan sekitarnya.',
    impression: 'Dapat terasa akrab jika memang digunakan penutur sehari-hari.',
    risks: 'Terasa dibuat-buat jika digunakan hanya untuk membuat Menungsa terdengar lebih muda, maskulin, atau “tongkrongan”. Jangan jadikan gue sebagai brand voice default.',
    contexts: 'Kesaksian personal, dialog, video, atau percakapan ketika penutur memang menggunakan gue/gua secara alami.',
    example: 'Waktu usaha gue tutup, beberapa minggu pertama gue masih bangun pagi seperti mau berangkat kerja.'
  },
  {
    id: 'lo',
    name: 'lo / lu',
    authorityLevel: 1,
    intimacyLevel: 5,
    socialRelationship: 'Sapaan orang kedua yang akrab dalam ragam percakapan tertentu.',
    impression: 'Santai, tanpa basa-basi formal.',
    risks: 'Bisa terdengar invasif, sok dekat, atau terlalu regional jika hubungan dengan pembaca belum mendukung.',
    contexts: 'Dialog autentik, percakapan antarteman, atau konten personal ketika penutur memang biasa menggunakan pasangan gue–lo atau gua–lu.',
    example: 'Kalau lo belum mau cerita sekarang, nggak apa-apa. Kita bisa duduk dulu.'
  },
  {
    id: 'aku',
    name: 'aku',
    authorityLevel: 2,
    intimacyLevel: 4,
    socialRelationship: 'Orang pertama yang personal dan cukup intim, tetapi tetap lazim di banyak ragam bahasa Indonesia.',
    impression: 'Tingkat keakrabannya bergantung pada penutur, daerah, dan situasi.',
    risks: 'Bisa tidak sesuai jika penutur sebenarnya tidak menggunakan aku atau situasinya sangat formal; masalahnya bukan karena kata ini dianggap terlalu melankolis.',
    contexts: 'Kisah personal, esai, video orang pertama, percakapan pribadi, atau narasi reflektif.',
    example: 'Bulan ketiga setelah toko tutup, aku masih bangun jam lima pagi seperti biasanya.'
  },
  {
    id: 'saya',
    name: 'saya',
    authorityLevel: 4,
    intimacyLevel: 1,
    socialRelationship: 'Orang pertama yang sopan, fleksibel, dan dapat digunakan dalam konteks personal maupun profesional.',
    impression: 'Objektif, tenang, berwibawa, dan dapat diandalkan.',
    risks: 'Bisa terasa lebih formal daripada hubungan yang sedang dibangun, tetapi tidak otomatis dingin.',
    contexts: 'Wawancara, komunikasi profesional, kesaksian personal, fasilitasi, atau percakapan dengan orang yang belum akrab.',
    example: 'Saya akan menjelaskan alur sesi terlebih dahulu. Setelah itu, kamu bebas memilih mau bicara atau cukup mendengarkan.'
  },
  {
    id: 'laki-laki',
    name: 'laki-laki',
    authorityLevel: 3,
    intimacyLevel: 3,
    socialRelationship: 'Sebutan yang relatif netral untuk membahas laki-laki sebagai kelompok, terutama dalam tulisan sosial, kesehatan, riset, atau demografi.',
    impression: 'Gunakan saat identitas gender relevan dengan isi pesan.',
    risks: 'Jika diulang terlalu sering, gender menjadi pusat identitas bahkan ketika tidak relevan dan semua perilaku seolah dijelaskan melalui gender.',
    contexts: 'Analisis sosial, data, riset, kebijakan, atau pembahasan ketika gender memang penting bagi argumen.',
    example: 'Sebagian laki-laki menghadapi tekanan untuk menjadi sumber penghasilan utama dalam keluarga, tetapi pengalaman ini tidak sama bagi semua orang.'
  },
  {
    id: 'pria',
    name: 'pria',
    authorityLevel: 4,
    intimacyLevel: 2,
    socialRelationship: 'Sebutan yang lebih formal dan sering muncul dalam tulisan institusional, media, atau informasi layanan.',
    impression: 'Dapat terasa lebih formal; pilih sesuai konteks dan konsistensi naskah.',
    risks: 'Mudah terdengar normatif jika digabungkan dengan label seperti pria sejati, pria berkualitas, atau pria bernilai tinggi.',
    contexts: 'Tulisan formal, demografi, judul program tertentu, atau materi layanan ketika ragam bahasanya memang menggunakan pria.',
    example: 'Layanan ini tersedia untuk pria dewasa berusia [rentang usia] yang memenuhi kriteria program.'
  },
  {
    id: 'cowok',
    name: 'cowok',
    authorityLevel: 1,
    intimacyLevel: 4,
    socialRelationship: 'Sebutan kasual yang lebih ringan dan dekat dengan percakapan sehari-hari, terutama di kalangan usia muda.',
    impression: 'Ringan, santai, dan tidak kaku.',
    risks: 'Bisa terasa terlalu santai, kekanak-kanakan, atau tidak cocok untuk konteks formal maupun pembaca yang lebih tua. Jangan menjadikannya cara default agar konten laki-laki terdengar relatable.',
    contexts: 'Humor ringan, percakapan personal, dialog, atau konten kasual ketika istilah tersebut memang terdengar alami.',
    example: 'Kadang obrolan antar-cowok justru mulai dari hal yang kelihatannya nggak penting: kerjaan, motor, game, atau siapa yang telat datang.'
  },
  {
    id: 'bro',
    name: 'bro / bang / mas / pak',
    authorityLevel: 2,
    intimacyLevel: 4,
    socialRelationship: 'Sapaan relasional yang maknanya bergantung pada usia, daerah, tingkat keakraban, dan posisi sosial. bro, bang, mas, dan pak tidak dapat dipertukarkan begitu saja.',
    impression: 'Pilih sapaan yang lazim bagi pembaca; “bro”, “bang”, “mas”, dan “pak” tidak saling menggantikan begitu saja.',
    risks: 'Bisa terasa dibuat-buat, terlalu akrab, atau salah membaca usia dan relasi jika dipilih berdasarkan stereotip tentang cara laki-laki berbicara.',
    contexts: 'Percakapan langsung, fasilitasi, komentar, atau interaksi personal ketika sapaan tersebut sudah digunakan oleh lawan bicara atau sesuai konteks setempat.',
    example: 'Mas, kalau ada bagian yang belum jelas soal alur pendaftarannya, saya bisa jelaskan lagi.'
  }
];

interface EthicalAlternativeItem {
  id: string;
  mechanismId: string;
  functionName: string;
  shortLabel: string;
  psychologicalNeed: string;
  whyCompelling: string;
  harmfulVersion: string;
  ethicalAlternative: string;
  keyPrinciple: string;
}

const ETHICAL_ALTERNATIVES: EthicalAlternativeItem[] = [
  {
    id: 'certainty',
    mechanismId: 'M03',
    shortLabel: 'Orientasi & Kejelasan',
    functionName: 'Orientasi & Kejelasan Arah Hidup',
    psychologicalNeed: 'Kebutuhan untuk memahami apa yang sedang terjadi, mengurangi kebingungan, dan melihat pilihan atau langkah yang masih tersedia.',
    whyCompelling: 'Penjelasan yang sederhana dan terstruktur dapat membuat situasi yang rumit terasa lebih mudah dipahami dan memberi titik awal untuk bertindak.',
    harmfulVersion: 'Memberikan satu penjelasan mutlak untuk masalah yang kompleks, mengklaim bahwa nasib laki-laki sudah ditentukan oleh biologi atau gender, atau menunjuk kelompok tertentu sebagai penyebab utama semua masalah.',
    ethicalAlternative: 'Berikan penjelasan yang cukup jelas untuk membantu pembaca berorientasi, tetapi tetap bedakan apa yang diketahui, apa yang masih mungkin, dan apa yang belum diketahui. Jika persoalannya kompleks, jangan berpura-pura ada satu penyebab atau satu jawaban.',
    keyPrinciple: 'Beri arah tanpa menjual kepastian palsu.'
  },
  {
    id: 'validation',
    mechanismId: 'M05',
    shortLabel: 'Pengakuan Beban',
    functionName: 'Pengakuan Beban & Rasa Didengar',
    psychologicalNeed: 'Kebutuhan untuk merasa bahwa kesulitan yang dialami benar-benar dilihat dan tidak langsung dianggap sebagai kelemahan, kegagalan, atau kekurangan pribadi.',
    whyCompelling: 'Ketika pengalaman seseorang diakui dengan konkret, ia tidak perlu terus membuktikan bahwa bebannya nyata sebelum percakapan bisa dimulai.',
    harmfulVersion: 'Mengubah pengalaman kecewa atau terluka menjadi narasi bahwa kelompok lain adalah penyebab bersama, lalu memperkuat kemarahan melalui permusuhan kolektif.',
    ethicalAlternative: 'Akui beban, emosi, dan kondisi yang memang sedang dihadapi tanpa otomatis membenarkan kesimpulan tentang siapa yang harus disalahkan. Jika faktor sosial atau struktural relevan, jelaskan secara spesifik dan berdasarkan bukti.',
    keyPrinciple: 'Akui pengalamannya tanpa mengubah luka menjadi musuh bersama.'
  },
  {
    id: 'status',
    mechanismId: 'M08',
    shortLabel: 'Keahlian & Martabat',
    functionName: 'Kompetensi, Penghargaan & Martabat',
    psychologicalNeed: 'Kebutuhan untuk merasa mampu melakukan sesuatu dengan baik, melihat perkembangan diri, mendapatkan penghargaan yang wajar, dan tetap diperlakukan sebagai manusia yang bernilai.',
    whyCompelling: 'Kemampuan yang berkembang dan hasil yang dapat dilihat memberi rasa kemajuan. Pengakuan dari orang lain juga dapat memperkuat rasa bahwa usaha seseorang memiliki arti.',
    harmfulVersion: 'Mengubah harga diri menjadi hierarki—siapa yang paling kaya, kuat, menarik, dominan, atau “bernilai tinggi”—lalu memperlakukan orang yang berada di bawah standar tersebut sebagai kurang layak dihormati.',
    ethicalAlternative: 'Dorong keterampilan, disiplin, kesehatan, atau pencapaian ketika itu memang penting bagi pembaca. Bedakan dengan jelas antara sesuatu yang dapat dikembangkan dan martabat dasar yang tidak perlu diperoleh melalui pencapaian.',
    keyPrinciple: 'Kemampuan bisa dibangun; martabat tidak perlu dibuktikan.'
  },
  {
    id: 'agency',
    mechanismId: 'M02',
    shortLabel: 'Pilihan & Tindakan',
    functionName: 'Pilihan & Kemampuan Bertindak',
    psychologicalNeed: 'Kebutuhan untuk melihat bahwa masih ada sesuatu yang bisa dipilih, dicoba, dihentikan, atau diubah meskipun tidak semua keadaan berada dalam kendali.',
    whyCompelling: 'Satu langkah yang konkret dapat membuat masalah yang besar terasa lebih mungkin untuk dihadapi dan membantu seseorang melihat pilihan yang masih tersedia.',
    harmfulVersion: 'Menganggap semua hasil bergantung pada kemauan dan disiplin individu, mengabaikan keterbatasan ekonomi atau sosial, atau menjadikan kelelahan dan kesulitan sebagai bukti bahwa seseorang kurang berusaha.',
    ethicalAlternative: 'Tawarkan langkah yang cukup kecil dan realistis berdasarkan waktu, tenaga, uang, akses, dan kondisi pembaca. Akui dengan jelas bagian yang memang tidak dapat dikendalikan oleh individu.',
    keyPrinciple: 'Perluas pilihan yang nyata, bukan tuntutan untuk mengendalikan semuanya.'
  },
  {
    id: 'belonging',
    mechanismId: 'M04',
    shortLabel: 'Rasa Memiliki',
    functionName: 'Rasa Memiliki & Kebersamaan',
    psychologicalNeed: 'Kebutuhan untuk memiliki hubungan dan tempat di mana seseorang dapat hadir tanpa terus-menerus membuktikan kemampuan, status, atau kesesuaian dirinya.',
    whyCompelling: 'Kebersamaan memberi pengalaman bahwa seseorang dikenali, dibutuhkan, dan memiliki orang lain untuk berbagi waktu, kegiatan, atau percakapan.',
    harmfulVersion: 'Membangun solidaritas melalui musuh bersama, memperkuat identitas “kita melawan mereka”, atau menjadikan kesetiaan pada kelompok sebagai syarat untuk diterima.',
    ethicalAlternative: 'Bangun kebersamaan melalui percakapan, aktivitas, humor, saling membantu, dan pengalaman bersama tanpa mensyaratkan semua anggota memiliki pandangan, gaya hidup, atau bentuk maskulinitas yang sama.',
    keyPrinciple: 'Bangun rasa memiliki dari apa yang dilakukan bersama, bukan dari siapa yang dibenci bersama.'
  },
  {
    id: 'purpose',
    mechanismId: 'M09',
    shortLabel: 'Makna & Kontribusi',
    functionName: 'Makna, Arah & Kontribusi',
    psychologicalNeed: 'Kebutuhan untuk merasa bahwa waktu, hubungan, pekerjaan, minat, atau tindakan seseorang memiliki arti yang dianggap penting olehnya.',
    whyCompelling: 'Memiliki sesuatu yang dianggap berarti dapat memberi arah pada keputusan sehari-hari dan membantu seseorang menentukan apa yang ingin ia jaga, bangun, atau kejar.',
    harmfulVersion: 'Menentukan satu misi hidup yang dianggap wajib bagi semua laki-laki—menjadi penyedia, pelindung, pemenang, pemimpin, atau pejuang—dan menjadikannya ukuran nilai seseorang.',
    ethicalAlternative: 'Beri ruang bagi pembaca untuk menentukan sendiri apa yang dianggap berarti: hubungan, keluarga, pekerjaan, belajar, kesehatan, karya, komunitas, kesenangan, atau bentuk kontribusi lain. Tujuan hidup tidak harus heroik atau sama bagi semua orang.',
    keyPrinciple: 'Bantu orang menemukan apa yang berarti tanpa menentukan untuk apa hidup mereka seharusnya digunakan.'
  }
];

type GuideTab = 'pronouns' | 'gender' | 'alternatives';

/** The page's primary choice, so it is rendered as one full-width switcher. */
const GUIDE_TAB_ITEMS: { id: GuideTab; label: string; icon: typeof Users; tabId: string; panelId: string }[] = [
  { id: 'pronouns', label: '1. Sapaan & Kata Ganti', icon: Users, tabId: 'tab-pronouns', panelId: 'panel-pronouns' },
  { id: 'gender', label: '2. Sebutan Gender', icon: ShieldCheck, tabId: 'tab-gender', panelId: 'panel-gender' },
  { id: 'alternatives', label: '3. Kebutuhan Pembaca & Alternatif Etis', icon: Sparkles, tabId: 'tab-alternatives', panelId: 'panel-alternatives' },
];

export const WordGuideView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<GuideTab>('pronouns');
  const [selectedRegisterId, setSelectedRegisterId] = useState<string>('kamu');
  const [selectedFunctionId, setSelectedFunctionId] = useState<string>('all');

  const activeRegister = REGISTERS.find((r) => r.id === selectedRegisterId) ?? REGISTERS[0];

  return (
    <div className="space-y-10 pb-16">
      {/* Header */}
      <div className="space-y-3">
        <div className="kicker flex items-center gap-1.5 text-amber-500 font-mono text-xs font-bold uppercase tracking-wider">
          <Sparkles size={13} className="text-amber-500" />
          <span>PILIHAN KATA</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-tight text-stone-100 leading-tight">
          Pilihan Kata dan Sapaan
        </h1>
        <p className="text-sm md:text-base text-stone-400 max-w-[74ch] leading-relaxed font-sans">
          Gunakan panduan ini untuk memilih sapaan, kata ganti, dan istilah yang sesuai dengan hubungan, kanal, dan situasi pesan. Tidak ada satu pilihan yang selalu tepat sehingga pertimbangkan konteks dan bagaimana kata tersebut dapat diterima oleh pembaca.
        </p>

        {/* Tab Switcher */}
        <div className="pt-3">
          <SegmentedTabs
            items={GUIDE_TAB_ITEMS}
            value={activeTab}
            onChange={(id) => setActiveTab(id as GuideTab)}
            ariaLabel="Navigasi Panduan Kata"
            fill
            size="lg"
          />
        </div>
      </div>

      {/* TAB 1: PRONOUNS */}
      {activeTab === 'pronouns' && (
        <div role="tabpanel" id="panel-pronouns" aria-labelledby="tab-pronouns" className="space-y-6">
          {/* Interactive 2D Register Map & Active Register Deep Dive (2-Column Desktop Grid) */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
              <div>
                <h3 className="text-sm font-mono text-amber-500 uppercase tracking-wider font-semibold flex items-center gap-2">
                  <Compass size={15} />
                  <span>Memahami jarak dan keakraban dalam sapaan</span>
                </h3>
                <p className="text-xs text-stone-400 mt-1 leading-relaxed max-w-2xl font-sans">
                  Pilihan kata ganti menentukan batas jarak sosial antara organisasi dan pembaca pria. Peta di bawah memperlihatkan mengapa Menungsa memilih <strong className="text-amber-500 font-semibold">"kamu"</strong> di titik seimbang (3/5, 3/5)—cukup hangat untuk peduli, namun cukup tertib untuk menghormati privasi.
                </p>
              </div>
              <span className="text-[11px] font-mono text-stone-500 shrink-0">
                Pilih titik untuk melihat penjelasan
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              <div className="lg:col-span-7">
                <RegisterMap
                  registers={languageRegisters}
                  selectedId={selectedRegisterId}
                  onSelect={(id) => setSelectedRegisterId(id)}
                />
              </div>

              {/* Active Register Deep Dive (Right Column) */}
              <div className="lg:col-span-5">
                {activeRegister && (
                  <div
                    role="tabpanel"
                    id="panel-register-detail"
                    aria-labelledby={`tab-register-${activeRegister.id}`}
                    className="rounded-xl border border-stone-800 bg-stone-900 p-4 sm:p-5 space-y-3.5 shadow-raised"
                  >
                    <div className="flex items-center justify-between border-b border-stone-800 pb-2.5">
                      <div>
                        <span className="text-[10px] font-mono text-amber-500 uppercase font-bold tracking-wider">Penjelasan sapaan</span>
                        <h4 className="text-xl font-serif font-bold text-stone-100">{activeRegister.name}</h4>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 text-[11px] font-mono text-stone-400">
                        <LunarPips level={activeRegister.authorityLevel} label="Otoritas" />
                        <LunarPips level={activeRegister.intimacyLevel} label="Keintiman" />
                      </div>
                    </div>

                    <div className="space-y-2 text-xs text-stone-300 leading-relaxed font-sans">
                      <div><strong className="text-stone-100 font-semibold">Hubungan:</strong> {activeRegister.socialRelationship}</div>
                      <div><strong className="text-stone-100 font-semibold">Kesan:</strong> {activeRegister.impression}</div>
                      <div className="pt-1.5 border-t border-stone-800">
                        <strong className="text-stone-100 block mb-0.5 font-semibold">Contoh Kalimat:</strong>
                        <span className="font-serif italic text-emerald-700 dark:text-emerald-300 text-sm leading-snug font-medium">"{activeRegister.example}"</span>
                      </div>
                      <div><strong className="text-stone-100 font-semibold">Konteks penggunaan:</strong> {activeRegister.contexts}</div>
                      <div className="text-rose-700 dark:text-rose-300 pt-1.5 border-t border-stone-800">
                        <strong className="text-rose-700 dark:text-rose-400 font-bold">Risiko:</strong> {activeRegister.risks}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Catalog Filter Pills */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-mono text-stone-400 uppercase tracking-wider font-semibold">
                Daftar kata ganti dan sapaan
              </h4>
              <div
                role="tablist"
                aria-label="Daftar kata ganti dan sapaan"
                onKeyDown={(e) => handleTablistKeys(e, (i) => setSelectedRegisterId(REGISTERS[i].id))}
                className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2"
              >
                {REGISTERS.map((reg) => (
                  <button
                    key={reg.id}
                    role="tab"
                    id={`tab-register-${reg.id}`}
                    aria-selected={selectedRegisterId === reg.id}
                    aria-controls="panel-register-detail"
                    tabIndex={selectedRegisterId === reg.id ? 0 : -1}
                    onClick={() => setSelectedRegisterId(reg.id)}
                    className={`px-3 py-2.5 rounded-lg border text-center transition cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                      selectedRegisterId === reg.id
                        ? 'border-emerald-700 bg-emerald-700 text-bone font-semibold shadow-raised dark:border-emerald-500 dark:bg-emerald-800'
                        : 'border-stone-800 bg-stone-900 text-stone-300 hover:border-emerald-700/60 hover:bg-stone-850'
                    }`}
                    title={`Otoritas: ${reg.authorityLevel}/5 · Kedekatan: ${reg.intimacyLevel}/5`}
                  >
                    <div className={`font-serif text-sm leading-tight ${selectedRegisterId === reg.id ? 'text-bone font-bold' : 'text-stone-100 font-medium'}`}>
                      {reg.name}
                    </div>
                    <div className="inline-flex items-center gap-2">
                      <span className="inline-flex items-center gap-1" title={`Otoritas: ${reg.authorityLevel}/5`}>
                        <MoonPhase
                          level={reg.authorityLevel}
                          size={12}
                          className={selectedRegisterId === reg.id ? 'text-bone' : 'text-amber-500 dark:text-amber-400/90'}
                        />
                      </span>
                      <span className={`text-[9px] select-none ${selectedRegisterId === reg.id ? 'text-bone/50' : 'text-stone-500/60'}`}>·</span>
                      <span className="inline-flex items-center gap-1" title={`Kedekatan: ${reg.intimacyLevel}/5`}>
                        <MoonPhase
                          level={reg.intimacyLevel}
                          size={12}
                          className={selectedRegisterId === reg.id ? 'text-bone' : 'text-emerald-500 dark:text-emerald-400/90'}
                        />
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GENDER ADDRESS */}
      {activeTab === 'gender' && (
        <div role="tabpanel" id="panel-gender" aria-labelledby="tab-gender" className="space-y-6">
          <div className="rounded-xl border border-stone-800 bg-stone-900 p-6 space-y-5 shadow-raised">
            <div>
              <h3 className="text-lg font-serif font-bold text-stone-100">Kapan Menggunakan "Pria", "Laki-laki", atau Tanpa Label?</h3>
              <p className="text-xs md:text-sm text-stone-400 leading-relaxed mt-1">
                Sebut identitas gender jika relevan. Hindari menjadikan suatu tindakan sebagai syarat untuk disebut laki-laki yang baik atau sejati.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="rounded-xl border border-emerald-900/40 bg-emerald-950/60 p-5 space-y-2.5 text-xs shadow-xs">
                <div className="text-emerald-700 dark:text-emerald-400 font-mono font-bold uppercase flex items-center gap-1.5">
                  <CheckCircle2 size={15} />
                  <span>Sebut tindakan atau situasinya</span>
                </div>
                <p className="text-stone-300 leading-relaxed">
                  Tidak perlu menyebut kata "pria" sama sekali jika pesannya tentang rutinitas sehari-hari atau ritme kerja.
                </p>
                <div className="font-serif italic text-emerald-700 dark:text-emerald-300 pt-2 border-t border-emerald-900/40 leading-snug font-medium">
                  "Menghadapi tumpukan pekerjaan setelah akhir pekan memang menguras energi."
                </div>
              </div>

              <div className="rounded-xl border border-amber-900/40 bg-amber-950/60 p-5 space-y-2.5 text-xs shadow-xs">
                <div className="text-amber-700 dark:text-amber-400 font-mono font-bold uppercase flex items-center gap-1.5">
                  <CheckCircle2 size={15} />
                  <span>Sebut gender jika relevan</span>
                </div>
                <p className="text-stone-300 leading-relaxed">
                  Gunakan “pria” atau “laki-laki” saat informasi tentang gender diperlukan untuk memahami pesan.
                </p>
                <div className="font-serif italic text-amber-700 dark:text-amber-300 pt-2 border-t border-amber-900/40 leading-snug font-medium">
                  “Panduan dukungan untuk laki-laki dewasa.”
                </div>
              </div>

              <div className="rounded-xl border border-rose-900/40 bg-rose-950/60 p-5 space-y-2.5 text-xs shadow-xs">
                <div className="text-rose-700 dark:text-rose-400 font-mono font-bold uppercase flex items-center gap-1.5">
                  <AlertCircle size={15} />
                  <span>Hindari syarat “pria sejati”</span>
                </div>
                <p className="text-stone-300 leading-relaxed">
                  Menungsa tidak memakai label ini untuk menilai harga diri pembaca atau mendesaknya melakukan sesuatu.
                </p>
                <div className="font-serif italic text-rose-700 dark:text-rose-300 pt-2 border-t border-rose-900/40 leading-snug font-medium">
                  "✕ Pria sejati adalah pria yang berani menangis dan meminta tolong."
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ETHICAL ALTERNATIVES (DECONSTRUCTING MANOSPHERE APPEALS INTO ETHICAL ALTERNATIVES) */}
      {activeTab === 'alternatives' && (
        <div role="tabpanel" id="panel-alternatives" aria-labelledby="tab-alternatives" className="space-y-6">
          {/* Header */}
          <div>
            <h3 className="text-xl md:text-2xl font-serif font-bold text-stone-100">
              Menanggapi kebutuhan tanpa memperkuat kebencian
            </h3>
            <p className="text-xs md:text-sm text-stone-400 mt-1 max-w-3xl leading-relaxed">
              Sebagian konten manosphere menawarkan kejelasan, pengakuan, atau rasa diterima. Tanggapi kebutuhan itu tanpa membenarkan penjelasan yang menyalahkan atau merendahkan kelompok lain.
            </p>
          </div>

          {/* Function Selector */}
          <div className="space-y-2">
            <span className="text-[11px] font-sans font-bold uppercase tracking-[0.14em] text-stone-500 block">
              Pilih kebutuhan yang ingin dibahas
            </span>
            <SegmentedTabs
              items={[
                { id: 'all', label: `Semua Kebutuhan (${ETHICAL_ALTERNATIVES.length})` },
                ...ETHICAL_ALTERNATIVES.map((alt) => ({ id: alt.id, label: alt.shortLabel })),
              ]}
              value={selectedFunctionId}
              onChange={setSelectedFunctionId}
              ariaLabel="Pilih kebutuhan yang ingin dibahas"
            />
          </div>

          {/* One need per card, read as a sequence: what the reader wants, why the
              pull works, the two ways of answering it, and the line to write by.
              Every block used to be a filled panel at the same weight, so the card
              was four competing boxes and the reader had no entry point. The need
              is now the lead, the two answers are a matched pair, and the rule
              closes on `gold` — the palette's one occasional surface (§2.1), which
              is exactly what a takeaway line is for. */}
          <div className="grid grid-cols-1 gap-6">
            {(selectedFunctionId === 'all'
              ? ETHICAL_ALTERNATIVES
              : ETHICAL_ALTERNATIVES.filter((a) => a.id === selectedFunctionId)
            ).map((item) => (
              <article
                key={item.id}
                className="rounded-2xl border border-stone-800 bg-stone-900 overflow-hidden"
              >
                {/* Card Header */}
                <header className="flex items-start gap-3.5 border-b border-stone-800 bg-stone-950 p-5 md:p-6">
                  <span className="h-11 w-11 shrink-0 rounded-[10px] border border-sky-900 bg-sky-950 text-sky-700 dark:border-sky-800 dark:text-sky-400 flex items-center justify-center">
                    <HeartHandshake size={20} strokeWidth={1.9} />
                  </span>
                  <div className="min-w-0 space-y-0.5">
                    <span className="text-[10.5px] font-sans font-bold uppercase tracking-[0.16em] text-amber-500 block">
                      Kebutuhan dan cara menanggapinya
                    </span>
                    <h4 className="text-lg md:text-xl font-serif font-semibold text-stone-100 leading-tight">
                      {item.functionName}
                    </h4>
                  </div>
                </header>

                <div className="p-5 md:p-6 space-y-5">
                  {/* The need itself — the card's lead, set larger than anything under it. */}
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                      <span className="text-[10.5px] font-sans font-bold uppercase tracking-[0.14em] text-sky-700 dark:text-sky-400">
                        1. Kebutuhan yang ingin dipenuhi
                      </span>
                      <span className="text-[10px] font-mono text-stone-500">
                        Kebutuhan pembaca
                      </span>
                    </div>
                    <p className="text-[15px] md:text-base text-stone-100 leading-[1.6] font-sans">
                      {item.psychologicalNeed}
                    </p>

                    <div className="border-t border-stone-800 pt-3 space-y-1.5">
                      <span className="text-[10.5px] font-sans font-bold uppercase tracking-[0.14em] text-stone-500 block">
                        2. Mengapa menarik
                      </span>
                      <p className="text-[13px] text-stone-400 leading-[1.65] font-sans">
                        {item.whyCompelling}
                      </p>
                    </div>
                  </div>

                  {/* The two answers, as a matched pair at equal weight. */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                    <div className="h-full rounded-xl border border-rose-900 bg-rose-950 p-4 space-y-2">
                      <div className="flex items-center gap-1.5 text-rose-700 dark:text-rose-400">
                        <X size={15} className="shrink-0 stroke-[2.5]" />
                        <span className="text-[10.5px] font-sans font-bold uppercase tracking-[0.14em]">
                          3. Cara yang dapat merugikan
                        </span>
                      </div>
                      <p className="text-[13px] text-stone-400 leading-[1.65] font-sans">
                        {item.harmfulVersion}
                      </p>
                    </div>

                    <div className="h-full rounded-xl border border-emerald-900 bg-emerald-950 p-4 space-y-2">
                      <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                        <Check size={15} className="shrink-0 stroke-[2.5]" />
                        <span className="text-[10.5px] font-sans font-bold uppercase tracking-[0.14em]">
                          4. Pendekatan Menungsa
                        </span>
                      </div>
                      <p className="text-[13px] text-stone-400 leading-[1.65] font-sans">
                        {item.ethicalAlternative}
                      </p>
                    </div>
                  </div>

                  {/* Governing Rule / Prinsip Emas — blue on gold is 7.81:1 (§3). */}
                  <div className="rounded-xl bg-mn-gold-soft p-4 flex items-start gap-3">
                    <ShieldCheck size={18} strokeWidth={1.9} className="shrink-0 text-mn-blue mt-0.5" />
                    <div className="min-w-0 space-y-1">
                      <span className="text-[10.5px] font-sans font-bold uppercase tracking-[0.14em] text-mn-green block">
                        Pegangan penulisan
                      </span>
                      <p className="font-serif italic text-[15px] md:text-base text-mn-blue leading-snug">
                        "{item.keyPrinciple}"
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
