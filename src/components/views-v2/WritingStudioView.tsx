import React, { useState, useMemo } from 'react';
import { toneExemplars, toneContexts } from '../../data';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  SlidersHorizontal,
  ChevronDown,
  LayoutGrid,
  StretchHorizontal
} from 'lucide-react';
import { playSound } from '../../utils/sound';
import { ComparisonTable } from '../common/ComparisonTable';
import { SegmentedTabs } from '../common/SegmentedTabs';

const CONTEXT_ID_MAP: Record<string, string> = {
  C01: 'Psikoedukasi & Ritme Tubuh',
  C02: 'Pengakuan Beban (Merasa Dipahami / Seen)',
  C03: 'Kisah Personal & Kejujuran Pengalaman',
  C04: 'Undangan Komunitas & Teman Sebaya',
  C05: 'Pertemuan Berbagi Cerita / Kelompok Sebaya',
  C06: 'Mencari Bantuan Profesional & Layanan Luar',
  C07: 'Dukungan Krisis & Pencegahan Bunuh Diri',
  C08: 'Meninjau Pandangan Umum & Ekspektasi Budaya',
  C09: 'Tekanan Kerja, Kelelahan & Masalah Sehari-hari',
  C10: 'Data, Kebijakan & Masalah Bersama',
  C11: 'Humor Sehari-hari & Situasi yang Terasa Akrab',
  C12: 'Perkembangan Bertahap & Harapan yang Realistis',
  C13: 'Duka, Kehilangan & Penyesuaian Diri',
  C14: 'Aktivitas Fisik & Kebersamaan'
};

const CHANNEL_ID_MAP: Record<string, string> = {
  'Social Carousel Opener': 'Slide Pembuka Carousel Medsos',
  'Micro-Guide Closing Note': 'Catatan Penutup Panduan Praktis',
  'Micro-Guide Slide': 'Slide Panduan Singkat Medsos',
  'Workplace Wellness Bulletin': 'Lembar Info Meja Kerja',
  'Feed Observation Post': 'Unggahan Refleksi Linimasa',
  'Short Reflection Fragment': 'Fragmen Renungan Singkat',
  'First-Person Personal Essay': 'Esai Narasi Orang Pertama',
  'Short Video Voiceover': 'Naskah Suara Video Pendek',
  'Community Gathering Invitation': 'Undangan Pertemuan Komunitas',
  'Online Circle Onboarding': 'Pengantar Diskusi Daring',
  'WhatsApp Community Broadcast': 'Siaran Komunitas WhatsApp',
  'Support Session Brief': 'Panduan Teknis Sesi Pendampingan',
  'Support Session Logistics Note': 'Catatan Logistik Sesi Pertemuan',
  'Attendance Clarification Email': 'Pesan Penegasan Tanpa Beban',
  'Attendance Clarification Notice': 'Pemberitahuan Fleksibilitas Hadir',
  'Clinic Navigation Guide': 'Panduan Kunjungan Konsultasi',
  'Informal Help Step': 'Langkah Obrolan Santai Awal',
  'Crisis Intervention Protocol': 'Protokol Respons Krisis Darurat',
  'Crisis De-escalation Protocol': 'Protokol De-eskalasi Krisis',
  'Immediate Safety Notice': 'Pemberitahuan Keselamatan Segera',
  'Immediate Safety Text': 'Panduan Pendampingan Krisis',
  'Myth Clarification Card': 'Kartu Penjelasan Mitos',
  'Cultural Belief Reframing': 'Penataan Ulang Keyakinan Tradisi',
  'Structural Analysis Article': 'Artikel Analisis Realitas Hidup',
  'Workplace Culture Commentary': 'Ulasan Budaya Kerja & Tekanan',
  'Policy Advocacy Release': 'Pernyataan Advokasi Bersama',
  'Campaign Action Statement': 'Pernyataan Sikap Berbasis Angka',
  'Behind-The-Scenes Social Snippet': 'Catatan Santai Tim Redaksi',
  'Casual Everyday Anecdote': 'Anekdot Kejadian Sehari-hari',
  'Recovery Case Feature': 'Cerita Pemulihan Tanpa Bualan',
  'Habit Rehabilitation Vignette': 'Catatan Kebiasaan Baru Bertahap',
  'Grief & Hardship Reflection': 'Refleksi Duka & Menghadapi Gagal',
  'Bereavement Support Message': 'Pesan Belasungkawa & Penemanan',
  'Physical Activity Debrief': 'Refleksi Aktivitas Fisik Bersama',
  'Sports Community Note': 'Catatan Komunitas Olahraga Sehat'
};

const RATIONALE_ID_MAP: Record<string, string> = {
  "EX-C01-1": "Mulai dari perubahan yang bisa dikenali pembaca, lalu membuka ruang untuk penjelasan tanpa langsung memberi label pada kondisinya.",
  "EX-C01-2": "Memberikan satu langkah yang konkret tanpa menjanjikan bahwa jeda singkat akan selalu memulihkan fokus.",
  "EX-C02-1": "Menggambarkan jarak antara fungsi yang masih berjalan dan apa yang terjadi setelahnya, tanpa menyimpulkan apa yang dirasakan atau dialami pembaca.",
  "EX-C02-2": "Membiarkan perubahan yang terlihat berbicara sendiri tanpa menebak penyebab sulit tidur atau memberi label pada kondisinya.",
  "EX-C03-1": "Menggunakan rutinitas dan detail keseharian untuk membawa pembaca masuk ke pengalaman penutur, tanpa mengubah ketidakpastian tersebut menjadi pelajaran atau tuntutan bagi orang lain.",
  "EX-C03-2": "Menunjukkan pengalaman menemani orang lain melalui kejadian konkret, tanpa menjadikan nasihat atau keterbukaan sebagai sesuatu yang harus terjadi.",
  "EX-C04-1": "Menjelaskan bentuk kegiatan dan tingkat keterlibatan yang diharapkan sejak awal, sehingga orang bisa memutuskan apakah ingin ikut tanpa harus lebih dulu membuka pengalaman pribadi.",
  "EX-C04-2": "Memberi pilihan yang jelas tentang cara berpartisipasi tanpa membuat diam atau tidak menyalakan kamera terasa seperti bentuk partisipasi yang kurang sah.",
  "EX-C05-1": "Memberi gambaran tentang bentuk sesi, siapa yang terlibat, dan bagaimana privasi dikelola sebelum peserta memutuskan untuk hadir, tanpa menjanjikan kerahasiaan secara mutlak.",
  "EX-C05-2": "Menjelaskan cara membatalkan dengan sederhana dan tanpa meminta peserta membuka alasan pribadi yang tidak diperlukan.",
  "EX-C06-1": "Memberikan satu titik masuk dan contoh kalimat yang bisa langsung digunakan, tanpa menganggap pembaca sudah memahami sistem layanan.",
  "EX-C06-2": "Mengubah kebutuhan bantuan menjadi permintaan yang spesifik dan realistis, tanpa mengharuskan pembaca menjelaskan seluruh kondisi pribadinya.",
  "EX-C07-1": "Menyebut risiko secara langsung, memberi urutan tindakan yang jelas, dan menjelaskan batas Menungsa tanpa membuat orang harus menceritakan situasinya terlebih dahulu.",
  "EX-C07-2": "Mengurangi keputusan yang perlu dibuat sendiri dan memprioritaskan kehadiran orang lain serta akses bantuan segera.",
  "EX-C08-1": "Mengakui mengapa sikap tersebut bisa dianggap bernilai sebelum menawarkan cara lain untuk merespons beban kerja, tanpa menyalahkan pekerja maupun lingkungan kerjanya secara menyeluruh.",
  "EX-C08-2": "Tidak mempertentangkan kemandirian dengan meminta bantuan. Keduanya ditempatkan sebagai pilihan yang bisa berguna dalam situasi yang berbeda.",
  "EX-C09-1": "Menghubungkan tekanan ekonomi dengan pilihan sehari-hari tanpa menyimpulkan bahwa biaya hidup menjelaskan seluruh kesulitan yang dialami seseorang.",
  "EX-C09-2": "Memperlihatkan bahwa kemampuan menetapkan batas tidak berdiri sendiri, tetapi dipengaruhi oleh aturan dan konsekuensi di tempat kerja.",
  "EX-C10-1": "Menghubungkan masalah yang didukung bukti dengan perubahan yang diminta, lalu menjelaskan peran Menungsa sendiri tanpa mengklaim dampak yang belum terbukti.",
  "EX-C10-2": "Memberikan tahun, wilayah, satuan, dan cakupan sebelum menafsirkan angka, sehingga pembaca dapat membedakan datanya dari posisi kebijakan yang diambil Menungsa.",
  "EX-C11-1": "Humor muncul dari kebiasaan tim sendiri dan kontradiksi kecil yang mudah dikenali, tanpa menjadikan kelelahan audiens sebagai bahan candaan.",
  "EX-C11-2": "Mengambil humor dari jarak antara rencana dan perilaku sehari-hari tanpa mengubahnya menjadi penilaian tentang disiplin atau kemauan seseorang.",
  "EX-C12-1": "Menunjukkan perubahan yang spesifik tanpa menjadikan konseling sebagai jalan menuju hasil yang cepat, linear, atau sama bagi semua orang.",
  "EX-C12-2": "Menempatkan kebiasaan kecil sebagai bagian dari proses, bukan sebagai intervensi ajaib atau ukuran apakah seseorang sedang “membaik”.",
  "EX-C13-1": "Mengakui beberapa hal yang benar-benar ikut hilang tanpa memaksa pengalaman tersebut menjadi pelajaran atau tanda bahwa seseorang harus segera melihat sisi positifnya.",
  "EX-C13-2": "Menawarkan bentuk kehadiran yang konkret sambil tetap memberi orang yang berduka kendali atas apakah ia ingin bicara atau cukup ditemani.",
  "EX-C14-1": "Menunjukkan bahwa orang bisa mengikuti kegiatan dengan kemampuan dan tempo yang berbeda tanpa menjadikan kecepatan sebagai ukuran keberhasilan.",
  "EX-C14-2": "Menempatkan permainan sebagai kegiatan bersama, bukan arena untuk membuktikan kemampuan atau ketangguhan fisik.",
  "EX-C01-3": "Menghubungkan saran dengan tanda yang bisa dikenali pembaca, bukan dengan klaim tentang kondisi tubuh atau sistem saraf yang belum perlu disimpulkan.",
  "EX-C01-4": "Mengubah situasi yang mudah membuat perhatian terpecah menjadi satu tindakan praktis, tanpa menganggap satu penyebab menjelaskan semua kesulitan fokus.",
  "EX-C02-3": "Menunjukkan bahwa beberapa hal masih bisa dilakukan sementara hal lain mulai terasa lebih sulit, tanpa menentukan alasan atau memberi penilaian pada perilaku tersebut.",
  "EX-C02-4": "Menggambarkan pengalaman yang bisa dikenali tanpa langsung menyebutnya sebagai overthinking, kecemasan, atau kondisi tertentu.",
  "EX-C03-3": "Membiarkan benda dan rutinitas membawa makna kehilangan, lalu memberi ruang bagi penutur untuk menyebut perasaannya tanpa mendramatisasi pengalaman tersebut.",
  "EX-C03-4": "Menunjukkan kedekatan tanpa menganggap percakapan mendalam harus selalu terjadi atau bahwa kebersamaan tersebut otomatis menyelesaikan masalah.",
  "EX-C04-3": "Membuat format kegiatan mudah dibayangkan dan menjelaskan bahwa keikutsertaan tidak bergantung pada kesediaan untuk membicarakan hal pribadi.",
  "EX-C04-4": "Menjelaskan kegiatan, waktu, dan kemampuan yang dibutuhkan supaya orang tidak harus menebak apakah mereka “cukup bisa” untuk ikut.",
  "EX-C05-3": "Menjelaskan kondisi ruang dan dokumentasi secara konkret agar peserta tidak perlu menebak seberapa privat sesi tersebut sebenarnya.",
  "EX-C05-4": "Menunjukkan bahwa peserta tetap punya kendali atas keterlibatannya selama sesi, bukan hanya saat memutuskan untuk datang.",
  "EX-C06-3": "Menjelaskan langkah yang benar-benar berlaku di fasilitas tertentu dan memisahkan informasi yang sudah diketahui dari hal yang masih perlu dikonfirmasi.",
  "EX-C06-4": "Memberi cara sederhana untuk meminta dukungan tanpa mengharuskan orang menceritakan seluruh masalahnya terlebih dahulu.",
  "EX-C07-3": "Memusatkan respons pada keselamatan lingkungan dan akses bantuan, tanpa menjadikan latihan napas, distraksi, atau teknik menenangkan diri sebagai syarat sebelum mendapatkan pertolongan.",
  "EX-C07-4": "Memberi pendamping langkah yang dapat dilakukan tanpa menempatkannya sebagai orang yang harus menyelesaikan krisis sendirian.",
  "EX-C08-3": "Mengakui pertimbangan di balik keinginan untuk tidak merepotkan orang lain, lalu memperluas pilihan tanpa mengatakan bahwa pembaca seharusnya lebih terbuka atau lebih bergantung pada keluarga.",
  "EX-C08-4": "Mengakui nilai yang diberikan pada ketegasan dan kemampuan menyelesaikan masalah, lalu memisahkannya dari penilaian terhadap harga diri seseorang ketika jawaban belum tersedia.",
  "EX-C09-3": "Mengakui peran keputusan pribadi tanpa mengabaikan besarnya tanggung jawab dan keterbatasan sumber daya yang dihadapi.",
  "EX-C09-4": "Memindahkan sebagian tanggung jawab dari kemampuan individu menetapkan batas ke aturan komunikasi yang juga dibentuk oleh tempat kerja.",
  "EX-C10-3": "Menjelaskan siapa yang dihitung dan wilayah yang dicakup sebelum menggunakan jumlah tenaga sebagai dasar advokasi. Jika memakai rasio, pembilang dan penyebut harus berasal dari periode dan populasi yang dapat dibandingkan.",
  "EX-C10-4": "Menjelaskan bagaimana data diperoleh dan seberapa jauh kesimpulan dapat ditarik sebelum menggunakannya sebagai dasar usulan.",
  "EX-C11-3": "Memperlihatkan sisi informal tim melalui kejadian kecil yang tidak mengorbankan topik sensitif atau pengalaman audiens sebagai punchline.",
  "EX-C11-4": "Humor datang dari selisih antara persiapan dan kenyataan, tanpa menjadikan konsistensi sebagai ukuran nilai diri atau mempermalukan orang yang belum menjalankan rencananya.",
  "EX-C12-3": "Menunjukkan kemajuan dan kemunduran dalam cerita yang sama tanpa memperlakukan hari yang lebih sulit sebagai bukti bahwa seluruh proses gagal.",
  "EX-C12-4": "Menunjukkan perubahan melalui pola yang berlangsung dari waktu ke waktu, termasuk saat kebiasaan lama masih muncul, tanpa mengarang manfaat klinis dari perubahan tersebut.",
  "EX-C13-3": "Memperlihatkan bahwa kehilangan pekerjaan dapat memengaruhi beberapa bagian kehidupan sekaligus tanpa menganggap dampaknya akan sama bagi semua orang atau menentukan kapan seseorang seharusnya sudah “pulih”.",
  "EX-C13-4": "Mengakui bahwa ingatan dan rasa kehilangan bisa muncul kembali tanpa menjadikannya tanda bahwa proses berduka berjalan salah atau terlalu lama.",
  "EX-C14-3": "Menawarkan aktivitas ringan tanpa membesar-besarkan manfaatnya atau menjadikan percakapan pribadi sebagai syarat untuk ikut.",
  "EX-C14-4": "Menjelaskan intensitas dan cara kelompok menjaga kebersamaan sehingga peserta bisa menilai apakah kegiatan sesuai dengan kemampuan dan kebutuhannya."
};
const WORKED_COPY_ID_MAP: Record<string, string> = {
  "EX-C01-1": "Kerjaan masih banyak, tapi belakangan satu halaman saja rasanya susah selesai. Apa yang terjadi ketika fokus mulai cepat terkuras?",
  "EX-C01-2": "Kalau perhatianmu sudah mulai buyar, coba berhenti beberapa menit sebelum lanjut ke tugas berikutnya.",
  "EX-C02-1": "Masih datang kerja tepat waktu. Masih membalas pesan kantor. Sampai di rumah, tas belum dilepas dan kamu sudah duduk di tepi kasur. Lampu kamar belum dinyalakan meski hari sudah gelap.",
  "EX-C02-2": "Jam sebelas malam, ponsel sudah diletakkan. Jam tiga pagi, kamu masih melihat langit-langit kamar.",
  "EX-C03-1": "Bulan ketiga setelah toko tutup, saya masih bangun jam lima pagi seperti biasa. Saya bikin kopi, duduk di teras, lalu melihat orang-orang berangkat kerja. Sampai sekarang saya masih belum tahu pasti apa yang akan saya lakukan setelah ini.",
  "EX-C03-2": "Waktu itu gue nggak tahu harus ngomong apa ke dia. Jadi kami duduk saja di warung, pesan kopi, dan ngobrol soal hal-hal lain. Beberapa saat kemudian, dia mulai cerita sendiri.",
  "EX-C04-1": "Ruang MENdukung berlangsung [hari, tanggal] pukul [jam] via [platform] selama sekitar [durasi]. Kamu boleh ikut untuk bercerita atau cukup mendengarkan. [Biaya dan cara bergabung yang sudah diverifikasi].",
  "EX-C04-2": "Kita mulai pukul 20.00 WIB malam ini. Kamera nggak wajib dinyalakan, dan kamu boleh ikut sambil mendengarkan dulu. Kalau ingin bicara, tinggal angkat tangan atau masuk saat ada ruang.",
  "EX-C05-1": "Ruang MENdukung berlangsung [hari, tanggal] pukul [jam] selama sekitar [durasi], bersama maksimal [jumlah] peserta. Sesi difasilitasi oleh [peran/kualifikasi yang sudah diverifikasi]. Kamu boleh bercerita atau cukup mendengarkan. Semua peserta menyepakati aturan kerahasiaan sebelum sesi dimulai, dan batas kerahasiaannya akan dijelaskan di awal.",
  "EX-C05-2": "Kalau ternyata kamu nggak bisa hadir, cukup balas pesan ini dengan “batal”. Kamu nggak perlu menjelaskan alasannya, dan [tidak ada biaya pembatalan / kebijakan pembatalan yang benar-benar berlaku].",
  "EX-C06-1": "Kalau ingin mulai mencari bantuan profesional, kamu bisa menghubungi [nama fasilitas/kontak resmi] dan bertanya, “Saya ingin konsultasi soal kesehatan mental. Untuk pertama kali, saya perlu daftar ke mana dan menyiapkan apa?”",
  "EX-C06-2": "Kalau pekerjaan sudah mulai sulit kamu urutkan sendiri, coba hubungi satu rekan yang kamu percaya: “Gue lagi kewalahan lihat semuanya sekaligus. Bisa bantu gue tentuin mana yang perlu dikerjain dulu?”",
  "EX-C07-1": "Kalau kamu merasa akan menyakiti diri atau mengakhiri hidup sekarang, jangan hadapi ini sendirian. Hubungi satu orang yang kamu percaya dan minta ia tetap bersamamu. Setelah itu, cari bantuan darurat atau pergi ke IGD terdekat dengan didampingi. Menungsa bukan layanan krisis dan tidak dapat memberikan respons darurat.",
  "EX-C07-2": "Kalau dorongan untuk menyakiti diri terasa sulit kamu kendalikan sekarang, minta seseorang datang atau tetap bersamamu. Jangan tinggal sendirian. Minta ia membantu kamu mencari bantuan darurat atau menemanimu ke IGD terdekat.",
  "EX-C08-1": "Di beberapa lingkungan kerja, tetap diam dan menyelesaikan beban sendiri bisa dianggap bagian dari profesionalitas. Tapi membicarakan beban kerja juga bisa menjadi cara untuk memperjelas prioritas, pembagian tugas, atau kapasitas yang tersedia.",
  "EX-C08-2": "Menyelesaikan masalah sendiri bisa menjadi bagian dari kemandirian. Di situasi lain, meminta pandangan orang yang kamu percaya juga bisa membantu melihat pilihan yang sebelumnya belum terpikirkan.",
  "EX-C09-1": "Ketika harga kebutuhan naik sementara penghasilan tidak bergerak secepat itu, ruang untuk menabung, beristirahat, atau menghadapi pengeluaran mendadak bisa ikut menyempit. Bagi sebagian keluarga, keputusan soal uang akhirnya bukan sekadar soal “lebih hemat”, tapi soal kebutuhan mana yang harus didahulukan.",
  "EX-C09-2": "Kalau lembur tanpa kompensasi terus dianggap bagian biasa dari pekerjaan, pekerja tidak hanya perlu “belajar bilang tidak”. Aturan tentang jam kerja, beban tugas, dan ekspektasi respons dari tempat kerja juga ikut menentukan seberapa realistis batas itu bisa dibuat.",
  "EX-C10-1": "Menurut [sumber, tahun], [temuan utama yang relevan] di [wilayah/populasi]. Karena itu, kami mendorong [institusi yang dituju] untuk [perubahan konkret]. Menungsa akan mendukung langkah ini melalui [tindakan organisasi yang memang sudah diputuskan atau dilakukan].",
  "EX-C10-2": "Pada [tahun], [sumber resmi] mencatat anggaran [program/layanan] di [wilayah] sebesar [angka dan satuan], untuk [cakupan yang dapat dipastikan dari sumber]. Data ini menunjukkan [interpretasi terbatas yang memang didukung]. Kami mengusulkan [perubahan konkret] agar [tujuan yang relevan].",
  "EX-C11-1": "Rapat pagi tadi agendanya menyusun konten tentang istirahat. Lima belas menit kemudian, kami malah debat soal siapa yang paling sering bilang “habis ini istirahat” lalu buka satu tab lagi.",
  "EX-C11-2": "Alarm sudah dipasang jam 05.45 buat lari pagi. Jam 05.46 dimatikan dengan keyakinan penuh bahwa “lima menit lagi” adalah keputusan yang sangat rasional.",
  "EX-C12-1": "Enam bulan setelah mulai konseling, masalah Dimas belum semuanya selesai. Sekarang ia lebih cepat mengenali saat beban mulai menumpuk dan beberapa kali bisa meminta bantuan sebelum semuanya terasa terlalu berat. Masih ada minggu ketika itu sulit dilakukan.",
  "EX-C12-2": "Belakangan, Raka mulai merapikan tempat tidur sebelum mandi pagi. Nggak selalu dilakukan, dan itu tentu nggak menyelesaikan semua yang sedang ia hadapi. Buat sekarang, itu salah satu cara kecil untuk memulai pagi dengan sesuatu yang terasa selesai.",
  "EX-C13-1": "Lima tahun membangun usaha tidak hilang begitu saja ketika tokonya tutup. Ada penghasilan, rutinitas, rencana, dan bagian dari hidup yang ikut berubah. Nggak semua itu perlu segera diberi hikmah supaya terasa sah untuk disesali.",
  "EX-C13-2": "Aku ikut berduka. Kalau kamu ingin ditemani, aku bisa datang dan duduk bareng. Nggak harus cerita apa-apa kalau memang belum ingin.",
  "EX-C14-1": "Pagi ini kami lari bareng tanpa target waktu. Ada yang berlari terus, ada yang beberapa kali jalan, lalu kami ketemu lagi di titik akhir.",
  "EX-C14-2": "Main bola minggu ini nggak pakai seleksi siapa yang paling jago. Salah umpan, oper lagi. Capek, gantian keluar sebentar. Setelah selesai, lanjut makan bareng.",
  "EX-C01-3": "Sudah lama menatap layar dan baca kalimat yang sama berulang kali? Coba alihkan pandangan sebentar sebelum lanjut.",
  "EX-C01-4": "Email baru masuk sebelum tugas sebelumnya selesai. Sebelum pindah, catat satu hal yang perlu kamu selesaikan dari tugas yang sedang dikerjakan.",
  "EX-C02-3": "Kamu masih sempat pulang naik motor, mencuci piring, dan memberi makan kucing. Tapi pesan teman yang ngajak ngopi baru kamu balas tiga hari kemudian.",
  "EX-C02-4": "Badan sudah di tempat tidur. Rapat tadi siang sudah selesai berjam-jam lalu, tapi potongan percakapannya masih terus muncul di kepala.",
  "EX-C03-3": "Enam bulan setelah usaha sablon tutup, saya masih sesekali masuk ke garasi dan merapikan rak cat. Ada beberapa kaleng yang sudah kering, tapi saya masih hafal kode warnanya. Rasanya aneh punya kebiasaan yang masih tertinggal ketika pekerjaannya sudah tidak ada.",
  "EX-C03-4": "Kami duduk di depan minimarket sampai hampir tengah malam. Gue belum cerita banyak, dan dia juga nggak maksa nanya. Kami cuma duduk, sesekali ngobrol hal lain, sampai akhirnya pulang.",
  "EX-C04-3": "Minggu pagi kita jalan santai di [lokasi] mulai pukul [jam]. Rutenya sekitar [durasi/jarak] dengan tempo santai. Nggak ada sesi sharing khusus—datang, jalan bareng, dan ngobrol kalau memang pengin. [Biaya atau ketentuan yang berlaku].",
  "EX-C04-4": "Sabtu ini kita kumpul di [lokasi] buat merapikan dan memperbaiki perkakas lama bareng-bareng. Mulai pukul [jam] dan selesai sekitar [jam]. Nggak perlu punya pengalaman khusus—kalau belum tahu caranya, kita kerjakan bareng.",
  "EX-C05-3": "Sesi berlangsung di [nama ruang/lantai] dan dapat diakses melalui [akses yang tersedia]. Ruangan digunakan khusus untuk sesi selama [waktu], tetapi [batas privasi yang memang berlaku]. Tidak ada foto atau rekaman selama sesi [jika benar demikian].",
  "EX-C05-4": "Kalau di tengah sesi kamu ingin berhenti bicara, melewati pertanyaan, atau keluar sebentar, bilang saja atau lakukan sesuai yang terasa nyaman. Kamu nggak perlu menjelaskan alasannya.",
  "EX-C06-3": "Di [nama fasilitas], langkah pertama yang sudah kami verifikasi adalah [alur pertama]. Siapkan [dokumen yang memang dibutuhkan]. Untuk jadwal dan biaya terbaru, konfirmasi melalui [kontak resmi] sebelum datang.",
  "EX-C06-4": "Kalau pergi sendiri terasa berat, kamu bisa minta bantuan yang spesifik: “Besok gue mau ke puskesmas buat konsultasi. Bisa temenin gue ke sana?”",
  "EX-C07-3": "Kalau kamu berisiko menyakiti diri sekarang, pindah ke tempat bersama orang lain dan minta seseorang tetap bersamamu. Jika ada benda atau sesuatu di sekitar yang bisa kamu gunakan untuk menyakiti diri, minta orang tersebut membantu menjauhkannya. Setelah itu, cari bantuan darurat atau pergi ke IGD terdekat.",
  "EX-C07-4": "Kalau temanmu bilang ia ingin menyakiti diri atau mengakhiri hidup, tanggapi dengan serius. Jika ada risiko segera, tetap bersamanya jika aman bagi kamu, bantu menjauhkan benda yang dapat digunakan untuk menyakiti diri, lalu hubungi bantuan darurat atau dampingi ia ke IGD terdekat.",
  "EX-C08-3": "Nggak ingin menambah beban keluarga bisa jadi salah satu alasan seseorang memilih mengurus masalahnya sendiri. Tapi kalau ada bagian yang memang bisa dibantu, meminta bantuan yang spesifik juga bisa menjadi pilihan.",
  "EX-C08-4": "Kita sering menghargai orang yang terlihat tahu harus berbuat apa. Tapi ada situasi yang memang belum punya jawaban yang jelas. Belum tahu langkah berikutnya tidak otomatis berarti kamu gagal menghadapinya.",
  "EX-C09-3": "Seseorang bisa membayar kebutuhan orang tua, biaya anak, cicilan, dan kebutuhan rumah tangga dari penghasilan yang sama. Dalam situasi seperti ini, membuat anggaran tetap penting, tetapi tidak semua tekanan finansial bisa diselesaikan hanya dengan menjadi lebih disiplin mengatur uang.",
  "EX-C09-4": "Pesan kerja yang terus masuk sampai malam membuat batas antara waktu kerja dan waktu pribadi semakin sulit dibaca. Karena itu, aturan tentang kapan pekerja perlu merespons sebaiknya tidak hanya bergantung pada keberanian masing-masing orang untuk mengabaikan pesan.",
  "EX-C10-3": "Menurut [sumber, tahun], terdapat [angka] [jenis tenaga profesional] yang tercatat untuk melayani [populasi/wilayah yang sesuai dengan sumber]. Angka ini setara dengan sekitar [rasio, hanya jika dapat dihitung dengan data yang kompatibel]. Berdasarkan temuan tersebut, kami mengusulkan [langkah konkret yang relevan].",
  "EX-C10-4": "Dalam [jenis pemantauan] yang dilakukan pada [periode], kami mencatat [temuan] dari [jumlah/cakupan observasi]. Temuan ini menggambarkan [batas cakupan yang tepat] dan tidak dimaksudkan mewakili seluruh [populasi yang lebih luas, jika memang tidak representatif]. Berdasarkan temuan tersebut, kami mengusulkan [perbaikan spesifik].",
  "EX-C11-3": "Kami mulai rapat dengan target menyelesaikan satu panduan dalam setengah jam. Dua puluh menit pertama habis untuk menentukan apakah kopi sachet tertentu masih bisa disebut kopi.",
  "EX-C11-4": "Sepatu olahraga sudah dibeli. Playlist gym sudah dibuat. Dua minggu kemudian, pencapaian terbesarnya masih perjalanan ke warung beli telur.",
  "EX-C12-3": "Minggu lalu, Reza bisa bangun dan mandi pagi hampir setiap hari. Minggu ini, dua hari ia kembali lebih banyak berada di tempat tidur. Perubahan yang sempat terjadi tidak otomatis hilang hanya karena minggu berikutnya terasa lebih berat.",
  "EX-C12-4": "Bayu mulai mengisi daya ponselnya di ruang tengah sebelum tidur. Beberapa malam ia masih mengambilnya lagi dan membawa ponsel ke kamar. Tapi kebiasaan baru itu sekarang lebih sering berhasil ia pertahankan dibanding beberapa minggu sebelumnya.",
  "EX-C13-3": "Kehilangan pekerjaan bukan cuma soal penghasilan yang berhenti masuk. Rutinitas harian, hubungan dengan rekan kerja, rencana ke depan, bahkan cara seseorang melihat perannya di rumah bisa ikut berubah. Nggak semuanya harus langsung dibereskan dalam minggu pertama.",
  "EX-C13-4": "Setahun setelah seseorang pergi, satu lagu, aroma masakan, atau tempat tertentu masih bisa membawa ingatan kembali kepadanya. Munculnya rindu lagi tidak berarti kamu gagal melanjutkan hidup.",
  "EX-C14-3": "Setelah seharian duduk di depan layar, sore ini kami jalan satu putaran taman. Nggak jauh dan nggak cepat. Cukup bergerak sebentar sambil ngobrol kalau ada yang ingin dibicarakan.",
  "EX-C14-4": "Gowes akhir pekan ini sekitar [jarak/durasi] dengan tempo santai. Kita akan berhenti di [titik istirahat], dan kalau ada yang tertinggal, kelompok menunggu di titik yang sudah disepakati."
};


const CHANNELS_LIST = [
  { id: 'all', label: 'Semua Format', icon: SlidersHorizontal },
  { id: 'social', label: '📱 Feed & Medsos', match: ['Social', 'Feed', 'Carousel', 'Reflection', 'Snippet', 'Anecdote', 'Slide'] },
  { id: 'chat', label: '💬 WhatsApp & Komunitas', match: ['WhatsApp', 'Broadcast', 'Community', 'Note', 'Email', 'Notice', 'Gathering', 'Onboarding'] },
  { id: 'campaign', label: '📢 Kampanye & Advokasi', match: ['Campaign', 'Poster', 'Announcement', 'Ad', 'Advocacy', 'Statement', 'Release'] },
  { id: 'guide', label: '🏥 Panduan & Faskes', match: ['Guide', 'Clinical', 'Health', 'Debrief', 'Navigation', 'Bulletin', 'Logistics', 'Slide', 'Vignette', 'Feature'] },
  { id: 'crisis', label: '🚨 Krisis & Keamanan', match: ['Crisis', 'Support', 'First-Person', 'Safety', 'Bereavement', 'De-escalation'] },
];

export const WritingStudioView: React.FC = () => {
  const [selectedChannel, setSelectedChannel] = useState<string>('all');
  const [selectedContext, setSelectedContext] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [layoutMode, setLayoutMode] = useState<'two-column' | 'single-column'>('two-column');

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      playSound('pop');
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      setCopiedId(null);
    }
  };

  const contextCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    toneExemplars.forEach((ex) => {
      counts[ex.contextId] = (counts[ex.contextId] || 0) + 1;
    });
    return counts;
  }, []);

  const filteredExemplars = useMemo(() => {
    return toneExemplars.filter((ex) => {
      // Channel filter
      if (selectedChannel !== 'all') {
        const activeFilter = CHANNELS_LIST.find((c) => c.id === selectedChannel);
        if (activeFilter?.match) {
          const matched = activeFilter.match.some((m) => 
            ex.channel.toLowerCase().includes(m.toLowerCase())
          );
          if (!matched) return false;
        }
      }

      // Context filter
      if (selectedContext !== 'all' && ex.contextId !== selectedContext) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const workedText = WORKED_COPY_ID_MAP[ex.id] ?? ex.worked.copy;
        const inCopy = workedText.toLowerCase().includes(q) || ex.weak.copy.toLowerCase().includes(q);
        const indonesianRationale = RATIONALE_ID_MAP[ex.id] ?? ex.rationale;
        const inRationale = indonesianRationale.toLowerCase().includes(q);
        const indonesianChannel = CHANNEL_ID_MAP[ex.channel] ?? ex.channel;
        const inChannel = indonesianChannel.toLowerCase().includes(q);
        if (!inCopy && !inRationale && !inChannel) return false;
      }

      return true;
    });
  }, [selectedChannel, selectedContext, searchQuery]);

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="space-y-3">
        <div className="kicker flex items-center gap-1.5">
          <Sparkles size={12} className="text-amber-500" />
          <span>PUSTAKA CONTOH TULISAN NYATA ({toneExemplars.length} CONTOH)</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-serif font-semibold tracking-tight text-stone-100 leading-tight">
          Voice Menungsa dalam Praktik
        </h1>
        <p className="text-sm md:text-base text-stone-300 max-w-[74ch] leading-relaxed font-sans">
          Lihat bagaimana Voice Menungsa diterapkan dalam berbagai situasi, lengkap dengan alasan di balik pilihan katanya. Gunakan contoh-contoh ini sebagai acuan. Sesuaikan kembali fakta, konteks, informasi layanan, dan ketentuan privasi sebelum digunakan.
        </p>
      </div>

      {/* Control Bar: Format Filters, Situasi Naskah Dropdown, Search, and Layout Toggle */}
      {/* Both filters were laid out as `label: control` on one line, which reads
          as a sentence the eye skims rather than as a set of options. Each label
          now sits above the control it names, so the bar announces two choices
          before the reader has to parse either one. */}
      <div className="ctl-sticky ctl-sticky-raised space-y-4 rounded-xl border border-stone-800 p-4 sm:p-5">
        {/* Row 1: Channel Chips & Layout Switcher */}
        <div className="space-y-2 border-b border-stone-800 pb-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[11px] font-sans font-bold uppercase tracking-[0.14em] text-stone-500">
              Kanal:
            </span>

            {/* Layout Mode Switcher (Icons only) */}
            <div
              className="flex items-center gap-0.5 bg-stone-950 border border-stone-800 rounded-[10px] p-1 shrink-0"
              role="group"
              aria-label="Susunan kartu contoh"
            >
              <button
                type="button"
                onClick={() => setLayoutMode('two-column')}
                aria-pressed={layoutMode === 'two-column'}
                aria-label="Tampilkan kartu dalam dua kolom"
                className={`p-1.5 rounded-[6px] cursor-pointer transition ${
                  layoutMode === 'two-column'
                    ? 'bg-amber-500 text-stone-950'
                    : 'text-stone-500 hover:text-stone-200'
                }`}
                title="Dua kolom"
              >
                <LayoutGrid size={15} />
              </button>
              <button
                type="button"
                onClick={() => setLayoutMode('single-column')}
                aria-pressed={layoutMode === 'single-column'}
                aria-label="Tampilkan kartu dalam satu kolom"
                className={`p-1.5 rounded-[6px] cursor-pointer transition ${
                  layoutMode === 'single-column'
                    ? 'bg-amber-500 text-stone-950'
                    : 'text-stone-500 hover:text-stone-200'
                }`}
                title="Satu kolom"
              >
                <StretchHorizontal size={15} />
              </button>
            </div>
          </div>

          <SegmentedTabs
            items={CHANNELS_LIST}
            value={selectedChannel}
            onChange={setSelectedChannel}
            ariaLabel="Pilihan format kanal"
          />
        </div>

        {/* Row 2: Situasi Naskah Dropdown & Search Input */}
        <div className="flex flex-col md:flex-row md:items-end gap-3">
          <div className="space-y-2 flex-1 min-w-0">
            <label
              htmlFor="context-select"
              className="text-[11px] font-sans font-bold uppercase tracking-[0.14em] text-stone-500 block"
            >
              Situasi:
            </label>
            <div className="relative w-full">
              <select
                id="context-select"
                value={selectedContext}
                onChange={(e) => setSelectedContext(e.target.value)}
                aria-label="Pilih situasi"
                className="w-full appearance-none rounded-[10px] border border-stone-800 bg-stone-950 pl-3.5 pr-9 py-3 text-[13px] font-sans text-stone-200 focus:outline-2 focus:outline-amber-500 focus:outline-offset-1 cursor-pointer hover:border-stone-700 transition"
              >
                <option value="all">Semua Situasi Naskah ({toneExemplars.length} contoh)</option>
                {toneContexts.map((ctx) => {
                  const label = CONTEXT_ID_MAP[ctx.context_id] ?? ctx.context;
                  const count = contextCounts[ctx.context_id] || 0;
                  return (
                    <option key={ctx.context_id} value={ctx.context_id}>
                      {label} ({count} contoh)
                    </option>
                  );
                })}
              </select>
              <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-stone-500" />
            </div>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80 shrink-0">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kata atau topik dalam contoh…"
              aria-label="Cari contoh naskah"
              className="w-full rounded-[10px] border border-stone-800 bg-stone-950 pl-10 pr-3.5 py-3 text-[13px] text-stone-200 placeholder-stone-500 focus:outline-2 focus:outline-amber-500 focus:outline-offset-1 hover:border-stone-700 transition font-sans"
            />
          </div>
        </div>

        {/* Counter and Active Filter Notification */}
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-t border-stone-800 pt-3 text-[13px] text-stone-500 font-sans">
          {/* Changing a filter changes only this number. Announcing it is the
              only feedback a screen-reader user gets that the filter did
              anything at all. */}
          <span aria-live="polite" className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
            <span>
              Menampilkan <strong className="text-amber-500 font-bold text-base">{filteredExemplars.length}</strong> dari {toneExemplars.length} contoh naskah terkalibrasi
            </span>
            {selectedContext !== 'all' && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-stone-800 bg-stone-950 px-2.5 py-1 text-[11px] text-stone-400">
                · Menyaring: <strong className="text-stone-200 font-semibold">{CONTEXT_ID_MAP[selectedContext]}</strong>
              </span>
            )}
          </span>
          {(selectedContext !== 'all' || selectedChannel !== 'all' || searchQuery.trim() !== '') && (
            <button
              onClick={() => {
                setSelectedContext('all');
                setSelectedChannel('all');
                setSearchQuery('');
              }}
              className="text-amber-500 text-xs font-medium cursor-pointer underline underline-offset-2 hover:no-underline transition"
            >
              Hapus semua filter
            </button>
          )}
        </div>
      </div>

      {/* Exemplar Cards Grid */}
      <div className={layoutMode === 'two-column' ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' : 'grid grid-cols-1 gap-6 max-w-5xl mx-auto'}>
        {filteredExemplars.length === 0 ? (
          <div className="col-span-full rounded-xl border border-dashed border-stone-800 p-12 text-center text-stone-400 text-xs">
            Belum ada contoh yang cocok. Coba kata lain atau hapus filter.
          </div>
        ) : (
          filteredExemplars.map((ex) => {
            const isCopied = copiedId === ex.id;
            const contextLabel = CONTEXT_ID_MAP[ex.contextId] ?? ex.contextId;
            const channelLabel = CHANNEL_ID_MAP[ex.channel] ?? ex.channel;
            const rationaleText = RATIONALE_ID_MAP[ex.id] ?? ex.rationale;
            const workedCopy = WORKED_COPY_ID_MAP[ex.id] ?? ex.worked.copy;

            if (layoutMode === 'two-column') {
              // 2-Column Responsive Card: Stacked internally for ideal line-length readability
              return (
                <div
                  key={ex.id}
                  className="rounded-[9px] border border-stone-800 bg-stone-900/50 p-5 space-y-4 hover:border-stone-700/80 transition shadow-raised flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Meta Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-800/80 pb-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-[6px] bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-sans font-bold text-amber-500 border border-amber-500/25 uppercase tracking-wider">
                          {channelLabel}
                        </span>
                        <span className="text-[11px] font-sans text-stone-400 font-medium">
                          {contextLabel}
                        </span>
                      </div>
                    </div>

                    {/* Comparison Table */}
                    <ComparisonTable
                      measure="long"
                      positiveLabel={
                        <>
                          <CheckCircle2 size={14} className="shrink-0 text-emerald-400" />
                          <span>Contoh sesuai panduan</span>
                        </>
                      }
                      positiveHeaderAction={
                        <button
                          onClick={() => handleCopy(workedCopy, ex.id)}
                          className="btn-secondary px-2 py-0.5 text-[11px] gap-1 font-sans cursor-pointer shrink-0"
                          title="Salin naskah"
                          aria-label={isCopied ? "Teks naskah berhasil disalin ke clipboard" : "Salin naskah ke clipboard"}
                        >
                          <span className="sr-only" aria-live="polite">
                            {isCopied ? "Teks berhasil disalin" : ""}
                          </span>
                          {isCopied ? (
                            <>
                              <Check size={11} className="text-emerald-500" />
                              <span className="text-emerald-700 dark:text-emerald-400 font-medium">Disalin</span>
                            </>
                          ) : (
                            <>
                              <Copy size={11} />
                              <span>Salin</span>
                            </>
                          )}
                        </button>
                      }
                      negativeLabel={
                        <>
                          <AlertTriangle size={14} className="shrink-0 text-rose-500 dark:text-rose-400" />
                          <span>Contoh yang perlu ditinjau</span>
                        </>
                      }
                      rows={[
                        {
                          id: ex.id,
                          positive: (
                            <blockquote className="font-serif italic leading-relaxed text-stone-100">
                              "{workedCopy}"
                            </blockquote>
                          ),
                          negative: (
                            <blockquote className="font-serif italic leading-relaxed text-stone-200">
                              "{ex.weak.copy}"
                            </blockquote>
                          ),
                        },
                      ]}
                    />
                  </div>

                  {/* Linguistic Rationale at bottom */}
                  <div className="rounded-[6px] bg-stone-950/60 p-3.5 border border-stone-800/80 text-xs text-stone-300 space-y-1 font-sans mt-3">
                    <div className="kicker">
                      Alasan pilihan kata
                    </div>
                    <p className="leading-relaxed text-stone-200">
                      {rationaleText}
                    </p>
                  </div>
                </div>
              );
            }

            // 1-Column Layout: Side-by-side comparison across wide screen
            return (
              <div
                key={ex.id}
                className="rounded-[9px] border border-stone-800 bg-stone-900/50 p-5 md:p-6 space-y-4 hover:border-stone-700/80 transition shadow-raised"
              >
                {/* Meta Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="rounded-[6px] bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-sans font-bold text-amber-500 border border-amber-500/25 uppercase tracking-wider">
                      {channelLabel}
                    </span>
                    <span className="text-[11px] font-sans text-stone-400 font-medium">
                      {contextLabel}
                    </span>
                  </div>
                </div>

                {/* Comparison Table */}
                <ComparisonTable
                  measure="long"
                  positiveLabel={
                    <>
                      <CheckCircle2 size={14} className="shrink-0 text-emerald-400" />
                      <span>Contoh sesuai panduan</span>
                    </>
                  }
                  positiveHeaderAction={
                    <button
                      onClick={() => handleCopy(workedCopy, ex.id)}
                      className="btn-secondary px-2.5 py-1 text-xs gap-1.5 font-sans cursor-pointer"
                      title="Salin naskah"
                      aria-label={isCopied ? "Teks naskah berhasil disalin ke clipboard" : "Salin naskah ke clipboard"}
                    >
                      <span className="sr-only" aria-live="polite">
                        {isCopied ? "Teks berhasil disalin" : ""}
                      </span>
                      {isCopied ? (
                        <>
                          <Check size={13} className="text-emerald-500" />
                          <span className="text-emerald-700 dark:text-emerald-400 font-medium">Teks disalin</span>
                        </>
                      ) : (
                        <>
                          <Copy size={13} />
                          <span>Salin naskah</span>
                        </>
                      )}
                    </button>
                  }
                  negativeLabel={
                    <>
                      <AlertTriangle size={14} className="shrink-0 text-rose-500 dark:text-rose-400" />
                      <span>Contoh yang perlu ditinjau</span>
                    </>
                  }
                  rows={[
                    {
                      id: ex.id,
                      positive: (
                        <blockquote className="font-serif italic leading-relaxed text-stone-100 max-w-[74ch]">
                          "{workedCopy}"
                        </blockquote>
                      ),
                      negative: (
                        <blockquote className="font-serif italic leading-relaxed text-stone-200 max-w-[74ch]">
                          "{ex.weak.copy}"
                        </blockquote>
                      ),
                    },
                  ]}
                />

                {/* Linguistic Rationale */}
                <div className="rounded-[6px] bg-stone-950/60 p-4 border border-stone-800/80 text-xs text-stone-300 space-y-1.5 font-sans">
                  <div className="kicker">
                    Alasan pilihan kata
                  </div>
                  <p className="leading-relaxed text-stone-200">
                    {rationaleText}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};


