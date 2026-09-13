import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Sliders, 
  Sparkles, 
  CheckCircle2, 
  ShieldAlert,
  FileText,
  Search,
  BookOpen,
  Info,
  Copy,
  Check,
  RotateCcw,
  Gauge,
  Activity
} from 'lucide-react';
import { playSound } from '../../utils/sound';
import cheatsheetRaw from '../../data/copyCheatsheet.json';

interface CheatsheetEntry {
  term: string;
  category: 'moral' | 'cringe' | 'clinical' | 'imperative' | 'recommended';
  categoryLabel: string;
  severity: 'critical' | 'warning' | 'positive';
  impact: string;
  replacement: string;
}

const cheatsheet: CheatsheetEntry[] = cheatsheetRaw as CheatsheetEntry[];

// Pre-sort multi-word phrases by length descending to prioritize longer phrases
const MULTI_WORD_ENTRIES = cheatsheet
  .filter((e) => e.term.includes(' '))
  .sort((a, b) => b.term.length - a.term.length);

// Map single words for fast lookup
const SINGLE_WORD_MAP = new Map<string, CheatsheetEntry>();
cheatsheet
  .filter((e) => !e.term.includes(' '))
  .forEach((e) => {
    SINGLE_WORD_MAP.set(e.term.toLowerCase(), e);
  });

const PRESETS = [
  {
    id: 'scolding',
    label: 'Menghakimi',
    text: 'Kalau kamu benar-benar ingin membaik, kamu harus mulai berani cerita. Terus memilih diam hanya membuatmu semakin jauh dari perubahan, jadi jangan terus lari dari masalah.'
  },
  {
    id: 'cringe',
    label: 'Tuntutan Maskulinitas',
    text: 'Laki-laki kuat bukan yang terus mengeluh, tapi yang tetap jalan meski keadaan berat. Ambil kendali, disiplinkan diri, dan buktikan bahwa masalah tidak lebih kuat dari kamu.'
  },
  {
    id: 'clinical',
    label: 'Diagnosis Berlebihan',
    text: 'Kalau belakangan kamu susah tidur, sulit fokus, dan mulai menjauh dari orang lain, berarti kamu sedang mengalami burnout atau depresi. Ceritakan semuanya di sini supaya kami bisa tahu apa yang sebenarnya terjadi dan menentukan bantuan yang kamu butuhkan.'
  },
  {
    id: 'calibrated',
    label: 'Memberi Pilihan',
    text: 'Kalau mau mulai dari hal kecil, coba catat satu perubahan yang paling mudah kamu kenali dari beberapa hari terakhir. Kamu nggak harus langsung tahu penyebabnya.'
  }
];

const CATEGORY_TABS = [
  { id: 'all', label: 'Semua Kosakata', count: cheatsheet.length, color: 'text-stone-200' },
  { id: 'moral', label: '🔴 Penilaian & Tuntutan', count: cheatsheet.filter(c => c.category === 'moral').length, color: 'text-rose-200 font-semibold' },
  { id: 'cringe', label: '🟠 Tuntutan Maskulinitas', count: cheatsheet.filter(c => c.category === 'cringe').length, color: 'text-amber-200 font-semibold' },
  { id: 'clinical', label: '🟣 Istilah Kesehatan Mental', count: cheatsheet.filter(c => c.category === 'clinical').length, color: 'text-purple-200 font-semibold' },
  { id: 'imperative', label: '🟡 Ajakan & Desakan', count: cheatsheet.filter(c => c.category === 'imperative').length, color: 'text-yellow-200 font-semibold' },
  { id: 'recommended', label: '🟢 Contoh Bahasa Konkret', count: cheatsheet.filter(c => c.category === 'recommended').length, color: 'text-emerald-200 font-semibold' },
];

export const CopySandboxView: React.FC = () => {
  const [inputText, setInputText] = useState<string>(PRESETS[0].text);
  // Every keystroke re-scanned 4,772 multi-word phrases against the whole draft.
  // On a short preset that is a few milliseconds; on a long draft it is tens of
  // them, on the same thread that has to paint the character just typed. The
  // textarea stays bound to `inputText` so typing is never held up; only the
  // scan waits for a pause.
  const [analysisText, setAnalysisText] = useState<string>(PRESETS[0].text);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [selectedWord, setSelectedWord] = useState<CheatsheetEntry | null>(null);

  // Cheatsheet Browser State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [visibleCount, setVisibleCount] = useState<number>(36);
  const [copiedTerm, setCopiedTerm] = useState<string | null>(null);

  // Left Column Keyword Category Filter
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  // Stateful pre-publication checklist
  const [checkedItems, setCheckedItems] = useState<boolean[]>([false, false, false, false]);

  const toggleCheck = (index: number) => {
    setCheckedItems((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const allChecked = checkedItems.every(Boolean);

  useEffect(() => {
    const timer = setTimeout(() => setAnalysisText(inputText), 120);
    return () => clearTimeout(timer);
  }, [inputText]);

  // Debounce search query to keep UI 60fps on mobile with 10.9k+ entries
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 150);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Analysis Engine
  const analysis = useMemo(() => {
    const rawText = analysisText.trim();
    if (!rawText) {
      return {
        total: 0,
        moralCount: 0,
        cringeCount: 0,
        clinicalCount: 0,
        imperativeCount: 0,
        recommendedCount: 0,
        density: 0,
        moralDensity: 0,
        cringeDensity: 0,
        clinicalDensity: 0,
        imperativeDensity: 0,
        recommendedDensity: 0,
        calibrationScore: 100,
        matches: [] as { entry: CheatsheetEntry; matchText: string }[],
        matchedCategories: { moral: 0, cringe: 0, clinical: 0, imperative: 0, recommended: 0 }
      };
    }

    const rawTokens = rawText.split(/\s+/).filter(Boolean);
    const total = rawTokens.length;

    const lower = rawText.toLowerCase();
    const matches: { entry: CheatsheetEntry; matchText: string }[] = [];
    const coveredIntervals: [number, number][] = [];
    const seenMatchTerms = new Set<string>();

    const isOverlapping = (start: number, end: number) => {
      return coveredIntervals.some(([s, e]) => Math.max(s, start) < Math.min(e, end));
    };

    // 1. First pass: detect multi-word phrases with word boundaries
    MULTI_WORD_ENTRIES.forEach((entry) => {
      const phrase = entry.term.toLowerCase();
      let idx = 0;
      while ((idx = lower.indexOf(phrase, idx)) !== -1) {
        const end = idx + phrase.length;
        const isStartWord = idx === 0 || /[^a-z0-9]/i.test(lower[idx - 1]);
        const isEndWord = end === lower.length || /[^a-z0-9]/i.test(lower[end]);
        if (isStartWord && isEndWord && !isOverlapping(idx, end) && !seenMatchTerms.has(phrase)) {
          seenMatchTerms.add(phrase);
          coveredIntervals.push([idx, end]);
          matches.push({ entry, matchText: rawText.slice(idx, end) });
        }
        idx = end;
      }
    });

    // 2. Second pass: detect single-word tokens with negation check
    let charPos = 0;
    const negationWords = new Set(['tidak', 'nggak', 'tak', 'bukan', 'belum', 'jangan']);

    rawTokens.forEach((token, tokenIdx) => {
      const tokenStart = lower.indexOf(token.toLowerCase(), charPos);
      const tokenEnd = tokenStart !== -1 ? tokenStart + token.length : -1;
      if (tokenStart !== -1) {
        charPos = tokenEnd;
      }

      const clean = token.toLowerCase().replace(/[^a-z0-9-]/gi, '');
      if (!clean) return;

      if (tokenStart !== -1 && isOverlapping(tokenStart, tokenEnd)) {
        return; // already covered by a multi-word phrase
      }

      if (SINGLE_WORD_MAP.has(clean) && !seenMatchTerms.has(clean)) {
        const entry = SINGLE_WORD_MAP.get(clean)!;

        // Check negation for moral/imperative words (e.g. 'nggak harus', 'tidak wajib')
        if (tokenIdx > 0) {
          const prevClean = rawTokens[tokenIdx - 1].toLowerCase().replace(/[^a-z0-9-]/gi, '');
          if (negationWords.has(prevClean) && (entry.category === 'moral' || entry.category === 'imperative')) {
            return;
          }
        }

        // Avoid bare 'jalan' as recommended false positive
        if (clean === 'jalan' && entry.category === 'recommended') {
          return;
        }

        seenMatchTerms.add(clean);
        if (tokenStart !== -1) {
          coveredIntervals.push([tokenStart, tokenEnd]);
        }
        matches.push({ entry, matchText: token });
      }
    });

    // Aggregate category counts
    const matchedCategories = {
      moral: 0,
      cringe: 0,
      clinical: 0,
      imperative: 0,
      recommended: 0
    };

    matches.forEach((m) => {
      if (m.entry.category in matchedCategories) {
        matchedCategories[m.entry.category as keyof typeof matchedCategories]++;
      }
    });

    const moralDensity = Math.min(100, Math.round((matchedCategories.moral / Math.max(1, total)) * 100));
    const cringeDensity = Math.min(100, Math.round((matchedCategories.cringe / Math.max(1, total)) * 100));
    const clinicalDensity = Math.min(100, Math.round((matchedCategories.clinical / Math.max(1, total)) * 100));
    const imperativeDensity = Math.min(100, Math.round((matchedCategories.imperative / Math.max(1, total)) * 100));
    const recommendedDensity = Math.min(100, Math.round((matchedCategories.recommended / Math.max(1, total)) * 100));

    // Menungsa Voice Calibration Score (0 to 100)
    let calibrationScore = 100;
    if (total > 0) {
      const penalties = (moralDensity * 2.2) + (cringeDensity * 1.8) + (clinicalDensity * 1.5) + (imperativeDensity * 1.2);
      const bonus = recommendedDensity * 0.4;
      calibrationScore = Math.max(0, Math.min(100, Math.round(100 - penalties + (penalties === 0 ? 0 : bonus))));
    }

    return {
      total,
      moralCount: matchedCategories.moral,
      cringeCount: matchedCategories.cringe,
      clinicalCount: matchedCategories.clinical,
      imperativeCount: matchedCategories.imperative,
      recommendedCount: matchedCategories.recommended,
      density: moralDensity,
      moralDensity,
      cringeDensity,
      clinicalDensity,
      imperativeDensity,
      recommendedDensity,
      calibrationScore,
      matches,
      matchedCategories
    };
  }, [analysisText]);

  // Overall Tone Evaluation
  const evaluation = useMemo(() => {
    const { moralCount, cringeCount, clinicalCount, imperativeCount, recommendedCount, total } = analysis;

    if (total === 0) {
      return {
        status: 'EMPTY',
        title: 'Coba tulis drafmu di sini dan cek hasilnya',
        description: 'Tulis atau tempel draf di kotak naskah. Kamu juga bisa memilih salah satu contoh untuk mencoba fitur ini.',
        color: 'text-stone-400',
        bg: 'bg-stone-900/40 border-stone-800',
        advice: 'Belum punya draf? Mulai dari salah satu contoh yang telah disediakan.'
      };
    }

    if (moralCount > 0 && (moralCount >= cringeCount && moralCount >= clinicalCount && moralCount >= imperativeCount)) {
      return {
        status: 'HIGH_MORAL',
        title: 'Periksa nada menghakimi',
        description: 'Ada kata atau frasa yang dapat terdengar seperti kewajiban moral, penilaian, atau tuntutan terhadap pembaca. Maknanya tetap bergantung pada konteks.',
        color: 'text-rose-500 dark:text-rose-400',
        bg: 'bg-rose-950/20 border-rose-500/30',
        advice: 'Baca ulang bagian yang ditandai. Jika tidak benar-benar diperlukan, ubah tuntutan menjadi pilihan atau jelaskan alasan di balik arahan tersebut.'
      };
    }

    if (cringeCount > 0 && (cringeCount >= clinicalCount && cringeCount >= imperativeCount)) {
      return {
        status: 'CRINGE_ALERT',
        title: 'Periksa standar maskulinitas',
        description: 'Ada istilah yang dapat menjadikan kekuatan, status, penampilan, atau pencapaian sebagai ukuran seperti apa laki-laki seharusnya.',
        color: 'text-amber-500 dark:text-amber-400',
        bg: 'bg-amber-950/20 border-amber-500/30',
        advice: 'Pastikan nilai seseorang tidak ditentukan oleh ketangguhan, penghasilan, penampilan, dominasi, atau label seperti “pria sejati”.'
      };
    }

    if (clinicalCount > 0 && clinicalCount >= imperativeCount) {
      return {
        status: 'CLINICAL_ALERT',
        title: 'Periksa penggunaan istilah klinis',
        description: 'Ada istilah kesehatan mental atau diagnosis yang membutuhkan konteks dan tingkat kepastian yang tepat.',
        color: 'text-purple-500 dark:text-purple-400',
        bg: 'bg-purple-950/20 border-purple-500/30',
        advice: 'Pastikan istilah tidak digunakan untuk mendiagnosis pembaca. Jelaskan artinya jika membantu, dan bedakan tanda yang mungkin muncul dari diagnosis yang membutuhkan penilaian profesional.'
      };
    }

    if (imperativeCount > 0) {
      return {
        status: 'IMPERATIVE_ALERT',
        title: 'Periksa desakan untuk membuka diri',
        description: 'Ada ajakan yang dapat terdengar menekan pembaca untuk bercerita, mengakui sesuatu, atau membagikan pengalaman pribadi.',
        color: 'text-yellow-200 font-semibold',
        bg: 'bg-yellow-950/20 border-yellow-500/30',
        advice: 'Beri pembaca pilihan tentang apakah, kapan, dan seberapa jauh mereka ingin berbagi. Hindari menjadikan keterbukaan sebagai syarat untuk mendapat dukungan.'
      };
    }

    if (recommendedCount > 0 || (moralCount === 0 && cringeCount === 0 && clinicalCount === 0 && imperativeCount === 0)) {
      return {
        status: 'CALIBRATED',
        title: 'Ada pola bahasa yang sesuai panduan',
        description: 'Beberapa kata atau frasa cocok dengan contoh bahasa yang lebih konkret, proporsional, atau memberi pilihan. Ini belum berarti seluruh naskah sudah sesuai.',
        color: 'text-emerald-400',
        bg: 'bg-emerald-950/20 border-emerald-500/30',
        advice: 'Tetap periksa konteks, fakta, tingkat kepastian klaim, dan ajakan yang diberikan kepada pembaca.'
      };
    }

    return {
      status: 'NEUTRAL',
      title: 'Tidak ada pola utama yang terdeteksi',
      description: 'Tidak banyak kata atau frasa dalam draf ini yang cocok dengan pola pemeriksaan. Hasil ini belum menilai ketepatan isi atau keseluruhan nada tulisan.',
      color: 'text-stone-300',
      bg: 'bg-stone-900/50 border-stone-800',
      advice: 'Baca ulang naskah secara utuh dan periksa konteks, fakta, asumsi tentang pembaca, serta pilihan yang diberikan.'
    };
  }, [analysis]);

  // Filtered Cheatsheet Items (using debounced query for smooth typing)
  const filteredCheatsheet = useMemo(() => {
    const q = debouncedSearchQuery.toLowerCase().trim();
    return cheatsheet.filter((item) => {
      const matchCat = activeCategory === 'all' || item.category === activeCategory;
      if (!matchCat) return false;
      if (!q) return true;
      return (
        item.term.toLowerCase().includes(q) ||
        item.impact.toLowerCase().includes(q) ||
        item.replacement.toLowerCase().includes(q)
      );
    });
  }, [debouncedSearchQuery, activeCategory]);

  const displayedCheatsheet = useMemo(() => {
    return filteredCheatsheet.slice(0, visibleCount);
  }, [filteredCheatsheet, visibleCount]);

  const handleCopyReplacement = (text: string, term: string) => {
    navigator.clipboard.writeText(text);
    playSound('pop');
    setCopiedTerm(term);
    setTimeout(() => setCopiedTerm(null), 2000);
  };

  const handleAppendToSandbox = (term: string) => {
    setInputText((prev) => (prev ? `${prev} ${term}` : term));
    // The dictionary sits far below the draft box, so the append it triggers used
    // to happen entirely off-screen. Returning to the box — and to the caret at
    // the end of the text — is what makes the action legible as an edit.
    requestAnimationFrame(() => {
      const el = textareaRef.current;
      if (!el) return;
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.focus({ preventScroll: true });
      el.setSelectionRange(el.value.length, el.value.length);
    });
  };

  return (
    <div className="space-y-12 pb-20">
      {/* Header */}
      <div className="space-y-3">
        <div className="kicker flex items-center gap-1.5">
          <Sliders size={12} className="text-amber-500" />
          <span>Cek Draf Tulisan</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-serif font-semibold tracking-tight text-stone-100 leading-tight">
          Periksa Draf sebelum Dipublikasikan
        </h1>
        <p className="text-sm md:text-base text-stone-300 max-w-[74ch] leading-relaxed font-sans">
          Tempel draf tulisan untuk melihat kata atau frasa yang mungkin perlu ditinjau kembali. Pemeriksaan akan menandai bahasa yang berpotensi menghakimi, terlalu memaksa, terlalu klinis, atau kurang sesuai dengan Voice Menungsa; lalu menunjukkan alternatif yang bisa dipertimbangkan.
        </p>
      </div>

      {/* SECTION 1: MAIN WORKSPACE (LIVE TESTER) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Text Input & Presets */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-stone-300 flex items-center gap-1.5 font-semibold">
              <FileText size={14} className="text-amber-500 dark:text-amber-400" />
              Draf yang ingin diperiksa
            </span>
            {/* Status Pill Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono border bg-stone-900/90 border-stone-800 shadow-xs">
              <span className={`w-1.5 h-1.5 rounded-full ${
                analysis.matches.length === 0
                  ? 'bg-emerald-400'
                  : analysis.calibrationScore >= 70
                  ? 'bg-emerald-400'
                  : analysis.calibrationScore >= 40
                  ? 'bg-amber-500'
                  : 'bg-rose-400'
              }`} />
              <span className="text-stone-300 font-medium">{analysis.total} Kata</span>
              <span className="text-stone-500">•</span>
              <span className="text-stone-400">
                Terdeteksi <strong className={analysis.matches.length > 0 ? 'text-stone-200 font-semibold' : 'text-stone-400'}>{analysis.matches.length} Istilah</strong>
              </span>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  playSound('tab');
                  setInputText(p.text);
                  setSelectedWord(null);
                }}
                className={`text-left px-3 py-2 rounded-[6px] border text-xs font-sans transition cursor-pointer flex flex-col gap-0.5 ${
                  inputText === p.text
                    ? 'bg-amber-500/20 border-amber-500 text-amber-500 dark:text-amber-200 font-semibold shadow-raised'
                    : 'bg-stone-900/70 border-stone-800 text-stone-300 hover:border-stone-700 hover:text-stone-100'
                }`}
              >
                <span className="font-semibold text-[11px] truncate">{p.label}</span>
                <span className="text-[10px] text-stone-400 line-clamp-1">
                  {p.text}
                </span>
              </button>
            ))}
          </div>

          {/* Textarea */}
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                setSelectedWord(null);
              }}
              rows={8}
              placeholder={`Ketik atau tempel draf naskah Anda di sini untuk diuji dengan ${cheatsheet.length.toLocaleString('id-ID')}+ kata cheatsheet...`}
              aria-label="Draf yang ingin diperiksa"
              className="w-full rounded-[9px] border border-stone-800 bg-stone-900/60 p-4 font-sans text-sm md:text-base leading-relaxed text-stone-100 placeholder-stone-500 focus:outline-2 focus:outline-amber-500 focus:outline-offset-1 shadow-raised"
            />
            {inputText && (
              <button
                onClick={() => {
                  playSound('paper');
                  setInputText('');
                  setSelectedWord(null);
                }}
                className="absolute bottom-3 right-3 text-stone-400 hover:text-stone-200 text-xs font-sans px-2.5 py-1 rounded-[6px] bg-stone-950/80 border border-stone-800 cursor-pointer flex items-center gap-1 shadow-xs"
                aria-label="Kosongkan draf kotak uji naskah"
              >
                <RotateCcw size={12} />
                <span>Bersihkan</span>
              </button>
            )}
          </div>

          {/* Real-time Category Counter Pills (Click to filter detected keywords) */}
          <div className="space-y-1.5 pt-1">
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono">
              <span className="text-stone-400 font-sans text-xs">Tampilkan kategori:</span>
              <button
                onClick={() => setFilterCategory(filterCategory === 'moral' ? null : 'moral')}
                aria-pressed={filterCategory === 'moral'}
                className={`px-2 py-0.5 rounded border transition cursor-pointer ${
                  filterCategory === 'moral'
                    ? 'bg-rose-500/30 border-rose-500 text-rose-200 ring-1 ring-rose-400 font-bold'
                    : analysis.moralCount > 0
                    ? 'bg-rose-500/15 border-rose-500/40 text-rose-200 font-semibold hover:bg-rose-500/25'
                    : 'bg-stone-900 border-stone-800 text-stone-500'
                }`}
              >
                Penilaian: {analysis.moralCount}
              </button>
              <button
                onClick={() => setFilterCategory(filterCategory === 'cringe' ? null : 'cringe')}
                aria-pressed={filterCategory === 'cringe'}
                className={`px-2 py-0.5 rounded border transition cursor-pointer ${
                  filterCategory === 'cringe'
                    ? 'bg-amber-500/30 border-amber-500 text-amber-200 ring-1 ring-amber-400 font-bold'
                    : analysis.cringeCount > 0
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-200 font-semibold hover:bg-amber-500/25'
                    : 'bg-stone-900 border-stone-800 text-stone-500'
                }`}
              >
                Maskulinitas: {analysis.cringeCount}
              </button>
              <button
                onClick={() => setFilterCategory(filterCategory === 'clinical' ? null : 'clinical')}
                aria-pressed={filterCategory === 'clinical'}
                className={`px-2 py-0.5 rounded border transition cursor-pointer ${
                  filterCategory === 'clinical'
                    ? 'bg-purple-500/30 border-purple-500 text-purple-200 ring-1 ring-purple-400 font-bold'
                    : analysis.clinicalCount > 0
                    ? 'bg-purple-500/15 border-purple-500/40 text-purple-200 font-semibold hover:bg-purple-500/25'
                    : 'bg-stone-900 border-stone-800 text-stone-500'
                }`}
              >
                Klinis: {analysis.clinicalCount}
              </button>
              <button
                onClick={() => setFilterCategory(filterCategory === 'imperative' ? null : 'imperative')}
                aria-pressed={filterCategory === 'imperative'}
                className={`px-2 py-0.5 rounded border transition cursor-pointer ${
                  filterCategory === 'imperative'
                    ? 'bg-yellow-500/30 border-yellow-500 text-yellow-200 ring-1 ring-yellow-400 font-bold'
                    : analysis.imperativeCount > 0
                    ? 'bg-yellow-500/15 border-yellow-500/40 text-yellow-200 font-semibold hover:bg-yellow-500/25'
                    : 'bg-stone-900 border-stone-800 text-stone-500'
                }`}
              >
                Desakan: {analysis.imperativeCount}
              </button>
              <button
                onClick={() => setFilterCategory(filterCategory === 'recommended' ? null : 'recommended')}
                aria-pressed={filterCategory === 'recommended'}
                className={`px-2 py-0.5 rounded border transition cursor-pointer ${
                  filterCategory === 'recommended'
                    ? 'bg-emerald-500/30 border-emerald-500 text-emerald-200 ring-1 ring-emerald-400 font-bold'
                    : analysis.recommendedCount > 0
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200 font-semibold hover:bg-emerald-500/25'
                    : 'bg-stone-900 border-stone-800 text-stone-500'
                }`}
              >
                Konkret: {analysis.recommendedCount}
              </button>
              {filterCategory && (
                <button
                  onClick={() => setFilterCategory(null)}
                  className="text-[10px] text-stone-400 hover:text-stone-200 underline ml-1 cursor-pointer font-sans"
                >
                  Tampilkan semua kategori
                </button>
              )}
            </div>
          </div>

          {/* Detected Keywords Interactive Badges */}
          {analysis.matches.length > 0 && (
            <div className="rounded-xl border border-stone-800 bg-stone-900/40 p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-stone-300 font-semibold flex items-center gap-1.5">
                  <Sparkles size={13} className="text-amber-500 dark:text-amber-400" />
                  Kata Kunci yang Terdeteksi {filterCategory ? `(${filterCategory})` : ''}:
                </span>
                <span className="text-[10px] text-stone-400 font-mono">
                  {(filterCategory ? analysis.matches.filter(m => m.entry.category === filterCategory).length : analysis.matches.length)} kata
                </span>
              </div>

              <div
                className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-1 scroll-hint-y"
                onScroll={(e) => {
                  const el = e.currentTarget;
                  el.dataset.atEnd = String(el.scrollTop + el.clientHeight >= el.scrollHeight - 2);
                }}
              >
                {(filterCategory ? analysis.matches.filter(m => m.entry.category === filterCategory) : analysis.matches).map((m, idx) => {
                  const cat = m.entry.category;
                  const isSelected = selectedWord?.term === m.entry.term;
                  const badgeClasses = 
                    cat === 'moral' ? 'bg-rose-500/15 border-rose-500/40 text-rose-200 font-semibold hover:bg-rose-500/25' :
                    cat === 'cringe' ? 'bg-amber-500/15 border-amber-500/40 text-amber-200 font-semibold hover:bg-amber-500/25' :
                    cat === 'clinical' ? 'bg-purple-500/15 border-purple-500/40 text-purple-200 font-semibold hover:bg-purple-500/25' :
                    cat === 'imperative' ? 'bg-yellow-500/15 border-yellow-500/40 text-yellow-200 font-semibold hover:bg-yellow-500/25' :
                    'bg-emerald-500/15 border-emerald-500/40 text-emerald-200 font-semibold hover:bg-emerald-500/25';

                  return (
                    <button
                      key={`${m.entry.term}-${idx}`}
                      onClick={() => setSelectedWord(m.entry)}
                      className={`px-2 py-1 rounded-md border text-[11px] font-mono transition cursor-pointer ${badgeClasses} ${
                        isSelected ? 'ring-2 ring-amber-400 font-bold' : ''
                      }`}
                    >
                      {cat === 'recommended' ? '✓' : '!'} "{m.entry.term}"
                    </button>
                  );
                })}
              </div>

              {/* Word Detail Inspector Panel */}
              {selectedWord && (
                <div className="mt-3 p-3.5 rounded-lg border border-stone-700 bg-stone-950 space-y-2 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-amber-300">
                        "{selectedWord.term}"
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-stone-900 border border-stone-700 text-stone-300 font-sans">
                        {selectedWord.categoryLabel}
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedWord(null)}
                      className="text-stone-400 hover:text-stone-200 text-xs cursor-pointer"
                    >
                      Tutup
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-rose-500 dark:text-rose-400 block font-semibold">
                        Hal yang perlu diperhatikan
                      </span>
                      <p className="text-stone-300 mt-0.5 leading-relaxed">
                        {selectedWord.impact}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase text-emerald-400 block font-semibold">
                        Saran penulisan
                      </span>
                      <p className="text-stone-300 mt-0.5 leading-relaxed">
                        {selectedWord.replacement}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Real-time Diagnostics */}
        <div className="lg:col-span-5 space-y-5">
          {/* 1. Skor pencocokan kata Menungsa (Composite Calibration Score) */}
          {/* Pinned on wide screens: editing happens in the left column, and a
              score that scrolls away is a score nobody watches while they edit. */}
          <div className="rounded-[9px] border border-stone-800 bg-stone-900 p-5 space-y-4 shadow-raised lg:sticky lg:top-20 lg:z-20 lg:shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-[6px] bg-amber-500/10 border border-amber-500/25 text-amber-500">
                  <Gauge size={18} />
                </div>
                <div>
                  <span className="text-xs font-sans uppercase tracking-wider text-stone-200 font-bold block">
                    Indeks Kalibrasi Nada
                  </span>
                  <span className="text-[10px] text-stone-400 font-sans">
                    Perhitungan internal; belum divalidasi
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-baseline gap-1 justify-end">
                  <span className={`text-3xl font-serif font-bold ${
                    analysis.total === 0 ? 'text-stone-500' :
                    analysis.calibrationScore >= 85 ? 'text-emerald-500 dark:text-emerald-400' :
                    analysis.calibrationScore >= 60 ? 'text-amber-500 dark:text-amber-400' :
                    'text-rose-500 dark:text-rose-400'
                  }`}>
                    {analysis.total === 0 ? '--' : analysis.calibrationScore}
                  </span>
                  <span className="text-xs font-mono text-stone-500">/100</span>
                </div>
              </div>
            </div>

            {/* Composite Progress Bar - Solid Brand Fills (§2.5) */}
            <div className="space-y-1.5">
              <div className="h-2.5 w-full rounded-full bg-stone-950 overflow-hidden border border-stone-800 flex">
                <div
                  style={{ width: `${analysis.total === 0 ? 0 : analysis.calibrationScore}%` }}
                  className={`h-full transition-[width,background-color] duration-300 ease-out ${
                    analysis.calibrationScore >= 85
                      ? 'bg-emerald-500'
                      : analysis.calibrationScore >= 60
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                />
              </div>

              <p className="text-[11px] text-stone-400 leading-relaxed font-sans border-t border-stone-800/80 pt-3">
              Pemeriksaan ini mencocokkan kata dan frasa dengan daftar editorial. Sistem belum memahami konteks, negasi, kutipan, atau ketepatan fakta. Hasilnya membantu meninjau draf, bukan menentukan apakah naskah aman atau siap terbit.
            </p>
            <div className="flex items-center justify-between text-[11px] font-sans">
                <span className={`${
                  analysis.total === 0 ? 'text-stone-500' :
                  analysis.calibrationScore >= 85 ? 'text-emerald-500 dark:text-emerald-400 font-semibold' :
                  analysis.calibrationScore >= 60 ? 'text-amber-500 dark:text-amber-400 font-semibold' :
                  'text-rose-500 dark:text-rose-400 font-semibold'
                }`}>
                  {analysis.total === 0 ? 'Belum ada draf' :
                   analysis.calibrationScore >= 85 ? '● Skor tinggi pada pencocokan kata' :
                   analysis.calibrationScore >= 60 ? '▲ Skor menengah pada pencocokan kata' :
                   '✕ Skor rendah pada pencocokan kata'}
                </span>
                <span className="text-stone-500 font-mono">Bukan penilaian kelayakan terbit</span>
              </div>
            </div>
          </div>

          {/* 2. 5-Dimension Density Multi-Meter */}
          <div className="rounded-xl border border-stone-800 bg-stone-900/40 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-2.5">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-stone-200 font-semibold">
                <Activity size={15} className="text-amber-500 dark:text-amber-400" />
                <span>Ringkasan kecocokan per kategori</span>
              </div>
              <span className="text-[10px] font-mono text-stone-400">
                {analysis.total} kata dianalisis
              </span>
            </div>

            <div className="space-y-3.5">
              {/* Dimensi 1: Moral */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-300 font-medium flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-rose-500" />
                    <span>Kecocokan kategori penghakiman</span>
                  </span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-[11px] text-stone-500">({analysis.moralCount} kata)</span>
                    <span className={`font-semibold ${analysis.moralDensity > 10 ? 'text-rose-500 dark:text-rose-400' : 'text-stone-300'}`}>
                      {analysis.moralDensity}%
                    </span>
                  </div>
                </div>
                <div className="h-1.5 w-full rounded-full bg-stone-950 overflow-hidden border border-stone-800/80">
                  <div
                    style={{ width: `${Math.min(analysis.moralDensity, 100)}%` }}
                    className={`h-full transition-[width,background-color] duration-300 ease-out ${analysis.moralDensity > 10 ? 'bg-rose-500' : 'bg-rose-500/60'}`}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-stone-400">
                  <span>Periksa apakah kalimat menilai atau menekan pembaca</span>
                  <span className="font-mono text-stone-500">Bukan ambang keamanan</span>
                </div>
              </div>

              {/* Dimensi 2: Klise */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-300 font-medium flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                    <span>Kecocokan kategori maskulinitas</span>
                  </span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-[11px] text-stone-500">({analysis.cringeCount} kata)</span>
                    <span className={`font-semibold ${analysis.cringeDensity > 5 ? 'text-amber-500 dark:text-amber-400' : 'text-stone-300'}`}>
                      {analysis.cringeDensity}%
                    </span>
                  </div>
                </div>
                <div className="h-1.5 w-full rounded-full bg-stone-950 overflow-hidden border border-stone-800/80">
                  <div
                    style={{ width: `${Math.min(analysis.cringeDensity, 100)}%` }}
                    className={`h-full transition-[width,background-color] duration-300 ease-out ${analysis.cringeDensity > 5 ? 'bg-amber-500' : 'bg-amber-500/60'}`}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-stone-400">
                  <span>Periksa tuntutan tentang “laki-laki yang seharusnya”</span>
                  <span className="font-mono text-stone-500">Bukan ambang keamanan</span>
                </div>
              </div>

              {/* Dimensi 3: Klinis */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-300 font-medium flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-purple-500" />
                    <span>Kecocokan istilah kesehatan mental</span>
                  </span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-[11px] text-stone-500">({analysis.clinicalCount} kata)</span>
                    <span className={`font-semibold ${analysis.clinicalDensity > 10 ? 'text-purple-500 dark:text-purple-400' : 'text-stone-300'}`}>
                      {analysis.clinicalDensity}%
                    </span>
                  </div>
                </div>
                <div className="h-1.5 w-full rounded-full bg-stone-950 overflow-hidden border border-stone-800/80">
                  <div
                    style={{ width: `${Math.min(analysis.clinicalDensity, 100)}%` }}
                    className={`h-full transition-[width,background-color] duration-300 ease-out ${analysis.clinicalDensity > 10 ? 'bg-purple-500' : 'bg-purple-500/60'}`}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-stone-400">
                  <span>Periksa ketepatan istilah dan konteks penggunaannya</span>
                  <span className="font-mono text-stone-500">Bukan ambang keamanan</span>
                </div>
              </div>

              {/* Dimensi 4: Tuntutan */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-300 font-medium flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-yellow-500" />
                    <span>Kecocokan kategori ajakan</span>
                  </span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-[11px] text-stone-500">({analysis.imperativeCount} kata)</span>
                    <span className={`font-semibold ${analysis.imperativeDensity > 10 ? 'text-yellow-300 dark:text-yellow-400' : 'text-stone-300'}`}>
                      {analysis.imperativeDensity}%
                    </span>
                  </div>
                </div>
                <div className="h-1.5 w-full rounded-full bg-stone-950 overflow-hidden border border-stone-800/80">
                  <div
                    style={{ width: `${Math.min(analysis.imperativeDensity, 100)}%` }}
                    className={`h-full transition-[width,background-color] duration-300 ease-out ${analysis.imperativeDensity > 10 ? 'bg-yellow-500' : 'bg-yellow-500/60'}`}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-stone-400">
                  <span>Periksa desakan dan pilihan pembaca</span>
                  <span className="font-mono text-stone-500">Bukan ambang keamanan</span>
                </div>
              </div>

              {/* Dimensi 5: Membumi (Grounded / Somatic - POSITIVE) */}
              <div className="space-y-1 pt-1 border-t border-stone-800/60">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-emerald-300 font-medium flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    <span>Kecocokan contoh bahasa konkret</span>
                  </span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-[11px] text-stone-500">({analysis.recommendedCount} kata)</span>
                    <span className="font-semibold text-emerald-400">
                      {analysis.recommendedDensity}%
                    </span>
                  </div>
                </div>
                <div className="h-1.5 w-full rounded-full bg-stone-950 overflow-hidden border border-emerald-950">
                  <div
                    style={{ width: `${Math.min(analysis.recommendedDensity, 100)}%` }}
                    className="h-full bg-emerald-500 transition-[width,background-color] duration-300 ease-out"
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-stone-400">
                  <span>Kata tentang kegiatan sehari-hari dan informasi praktis</span>
                  <span className="font-mono text-emerald-400/90 font-medium">Tidak ada proporsi ideal yang diuji</span>
                </div>
              </div>
            </div>
          </div>

          {/* Diagnosis Card */}
          <div className={`rounded-xl border p-5 space-y-3.5 ${evaluation.bg}`}>
            <div className="flex items-start gap-2.5">
              {evaluation.status === 'CALIBRATED' ? (
                <CheckCircle2 size={18} className={`${evaluation.color} shrink-0 mt-0.5`} />
              ) : evaluation.status === 'EMPTY' ? (
                <Info size={18} className={`${evaluation.color} shrink-0 mt-0.5`} />
              ) : (
                <ShieldAlert size={18} className={`${evaluation.color} shrink-0 mt-0.5`} />
              )}
              <div className="space-y-1">
                <h3 className={`text-sm font-serif font-semibold ${evaluation.color} leading-snug`}>
                  {evaluation.title}
                </h3>
                <p className="text-xs text-stone-300 leading-relaxed">
                  {evaluation.description}
                </p>
              </div>
            </div>

            <div className="pt-2.5 border-t border-stone-800/80 text-xs text-stone-300 space-y-1">
              <span className="text-[10px] font-mono text-amber-500 dark:text-amber-400 uppercase tracking-wider block font-semibold">
                Saran untuk ditinjau
              </span>
              <p className="leading-relaxed text-stone-200">
                {evaluation.advice}
              </p>
            </div>
          </div>

          {/* Golden Writing Checklist */}
          <div className="rounded-xl border border-stone-800 bg-stone-900/30 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-stone-400 font-semibold block">
                Periksa sebelum menerbitkan
              </span>
              <span className="text-[11px] font-mono text-stone-400">
                {checkedItems.filter(Boolean).length}/4 Selesai
              </span>
            </div>

            {allChecked && (
              <div className="rounded-lg bg-emerald-500/15 border border-emerald-500/30 p-2.5 flex items-center gap-2 text-xs text-emerald-300 animate-fadeIn">
                <CheckCircle2 size={15} className="shrink-0 text-emerald-400" />
                <span className="font-medium">Empat poin sudah kamu tandai. Tetap periksa fakta dan konteks naskah.</span>
              </div>
            )}

            <div className="space-y-2 text-xs text-stone-300">
              <label className="flex items-start gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={checkedItems[0]}
                  onChange={() => toggleCheck(0)}
                  className="mt-0.5 rounded border-stone-700 bg-stone-800 text-amber-500 cursor-pointer"
                />
                <span className={checkedItems[0] ? 'text-stone-100 line-through opacity-80' : ''}>
                  Kalimat tidak mempermalukan atau memaksa pembaca. Nilai kata seperti “harus” sesuai konteksnya.
                </span>
              </label>
              <label className="flex items-start gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={checkedItems[1]}
                  onChange={() => toggleCheck(1)}
                  className="mt-0.5 rounded border-stone-700 bg-stone-800 text-amber-500 cursor-pointer"
                />
                <span className={checkedItems[1] ? 'text-stone-100 line-through opacity-80' : ''}>
                  Harga diri pembaca tidak dibuat bergantung pada standar maskulinitas tertentu.
                </span>
              </label>
              <label className="flex items-start gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={checkedItems[2]}
                  onChange={() => toggleCheck(2)}
                  className="mt-0.5 rounded border-stone-700 bg-stone-800 text-amber-500 cursor-pointer"
                />
                <span className={checkedItems[2] ? 'text-stone-100 line-through opacity-80' : ''}>
                  Istilah kesehatan mental digunakan dengan tepat; pembaca tidak didiagnosis atau dipaksa bercerita.
                </span>
              </label>
              <label className="flex items-start gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={checkedItems[3]}
                  onChange={() => toggleCheck(3)}
                  className="mt-0.5 rounded border-stone-700 bg-stone-800 text-amber-500 cursor-pointer"
                />
                <span className={checkedItems[3] ? 'text-stone-100 line-through opacity-80' : ''}>
                  Ajakan memberi pilihan yang nyata; instruksi darurat tetap jelas dan langsung.
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: MASTER CHEATSHEET EXPLORER (10,946+ WORDS) */}
      <div className="border-t border-stone-800 pt-10 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-amber-500 dark:text-amber-400 uppercase tracking-wider">
              <BookOpen size={14} />
              <span>KAMUS BESAR KATA & FRASA NASKAH ({cheatsheet.length.toLocaleString('id-ID')}+ ENTRI)</span>
            </div>
            <h2 className="text-xl md:text-2xl font-serif text-stone-100">
              Daftar kata dan frasa
            </h2>
            <p className="text-xs md:text-sm text-stone-400 max-w-2xl">
              Telusuri kata dan frasa untuk membantu meninjau naskah. Kategori dalam daftar ini adalah panduan editorial. Makna dan dampak suatu kata bergantung pada kalimatnya.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-stone-400 bg-stone-900 border border-stone-800 px-3 py-1.5 rounded-lg">
              Total Database: <strong className="text-amber-300 font-mono">{cheatsheet.length.toLocaleString('id-ID')}</strong> Kata/Frasa
            </span>
          </div>
        </div>

        {/* Search Bar & Category Filters */}
        <div className="ctl-sticky space-y-3 py-2">
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setVisibleCount(36);
              }}
              placeholder="Cari kata, frasa, atau penjelasan…"
              aria-label="Cari dalam daftar kata dan frasa"
              className="w-full rounded-xl border border-stone-800 bg-stone-900/80 pl-10 pr-4 py-2.5 text-xs md:text-sm text-stone-100 placeholder-stone-500 hover:border-stone-700 font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                aria-label="Hapus pencarian kata kunci"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-stone-400 hover:text-stone-200"
              >
                Hapus
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div role="group" aria-label="Cari kata, frasa, atau penjelasan…" className="ctl-row no-scrollbar scroll-hint-x">
            {CATEGORY_TABS.map((tab) => {
              const isActive = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveCategory(tab.id);
                    setVisibleCount(36);
                  }}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-sans whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-stone-800 border-stone-600 text-stone-100 font-medium'
                      : 'bg-stone-900/50 border-stone-800 text-stone-400 hover:border-stone-700 hover:text-stone-200'
                  }`}
                >
                  <span className={tab.color}>{tab.label}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-stone-950 text-stone-400">
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between text-xs text-stone-400 font-mono">
          <span>
            Menemukan <strong className="text-stone-200">{filteredCheatsheet.length}</strong> kosakata
            {searchQuery ? ` untuk "${searchQuery}"` : ''}
          </span>
          <span>
            Menampilkan {Math.min(displayedCheatsheet.length, filteredCheatsheet.length)} dari {filteredCheatsheet.length}
          </span>
        </div>

        {/* Cheatsheet Grid Cards */}
        {filteredCheatsheet.length === 0 ? (
          <div className="rounded-xl border border-stone-800 bg-stone-900/30 p-12 text-center space-y-2">
            <p className="text-sm font-serif text-stone-300">
              Tidak ada kata yang cocok dengan kata pencarian "{searchQuery}".
            </p>
            <p className="text-xs text-stone-500">
              Coba gunakan kata dasar atau pilih kategori lain di atas.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {displayedCheatsheet.map((item, idx) => {
              const isRecommended = item.category === 'recommended';
              const borderClass = 
                item.category === 'moral' ? 'hover:border-rose-500/40' :
                item.category === 'cringe' ? 'hover:border-amber-500/40' :
                item.category === 'clinical' ? 'hover:border-purple-500/40' :
                item.category === 'imperative' ? 'hover:border-yellow-500/40' :
                'hover:border-emerald-500/40';

              const tagBg = 
                item.category === 'moral' ? 'bg-rose-500/15 text-rose-200 border-rose-500/30 font-semibold' :
                item.category === 'cringe' ? 'bg-amber-500/15 text-amber-200 border-amber-500/30 font-semibold' :
                item.category === 'clinical' ? 'bg-purple-500/15 text-purple-200 border-purple-500/30 font-semibold' :
                item.category === 'imperative' ? 'bg-yellow-500/15 text-yellow-200 border-yellow-500/30 font-semibold' :
                'bg-emerald-500/15 text-emerald-200 border-emerald-500/30 font-semibold';

              return (
                <div
                  key={`${item.term}-${idx}`}
                  className={`rounded-xl border border-stone-800/80 bg-stone-900/40 p-4 space-y-3 transition duration-150 flex flex-col justify-between ${borderClass}`}
                >
                  <div className="space-y-2">
                    {/* Header: Term and Category */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <span className="text-sm font-serif font-semibold text-stone-100 block">
                          "{item.term}"
                        </span>
                        <span className={`inline-block text-[10px] font-mono px-2 py-0.5 rounded border ${tagBg}`}>
                          {item.categoryLabel}
                        </span>
                      </div>

                      <button
                        onClick={() => handleAppendToSandbox(item.term)}
                        title="Tambahkan kata ini ke draf"
                        className="text-[10px] font-mono px-2 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-stone-100 transition cursor-pointer border border-stone-700"
                      >
                        Tambahkan ke draf
                      </button>
                    </div>

                    {/* Impact / Reason */}
                    <div className="text-xs text-stone-400 leading-relaxed">
                      <span className="text-[10px] font-mono uppercase text-stone-500 block font-semibold">
                        {isRecommended ? 'Alasan Direkomendasikan:' : 'Dampak Penolakan / Risiko:'}
                      </span>
                      <p className="text-stone-300 text-[11px] mt-0.5">
                        {item.impact}
                      </p>
                    </div>
                  </div>

                  {/* Recommendation / Alternative */}
                  <div className="pt-2 border-t border-stone-800/80 flex items-start justify-between gap-2 text-xs">
                    <div className="space-y-0.5 flex-1">
                      <span className="text-[10px] font-mono uppercase text-amber-500 dark:text-amber-400 block font-semibold">
                        {isRecommended ? 'Karakter Kalimat:' : 'Saran Solusi:'}
                      </span>
                      <p className="text-[11px] text-stone-300 leading-snug">
                        {item.replacement}
                      </p>
                    </div>

                    <button
                      onClick={() => handleCopyReplacement(item.replacement, item.term)}
                      title="Salin saran"
                      className="p-1 rounded text-stone-400 hover:text-stone-200 transition shrink-0 cursor-pointer"
                    >
                      {copiedTerm === item.term ? (
                        <Check size={13} className="text-emerald-400" />
                      ) : (
                        <Copy size={13} />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Load More Button */}
        {displayedCheatsheet.length < filteredCheatsheet.length && (
          <div className="pt-4 text-center">
            <button
              onClick={() => setVisibleCount((prev) => prev + 36)}
              className="px-6 py-2.5 rounded-xl bg-stone-900 border border-stone-700 hover:border-amber-500/50 text-stone-200 hover:text-amber-300 font-mono text-xs transition cursor-pointer"
            >
              Tampilkan 36 Kata Berikutnya ({filteredCheatsheet.length - displayedCheatsheet.length} tersisa)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
