import React from 'react';
import {
  ChevronDown,
  Users,
  MessageCircle,
  Lightbulb,
  Heart,
  ShieldCheck,
  Target
} from 'lucide-react';
import type { BrandValue } from '../../types';

interface ValueConfig {
  number: string;
  icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
  title: string;
  dimension: string;
  description: string;
  left: string;
  right: string;
  defaultPosition: number;
  positionNote: string;
}

const SPECTRUM_CONFIG: Record<string, ValueConfig> = {
  V1: {
    number: '01',
    icon: Users,
    title: 'Teman Pembaca yang Baik',
    dimension: 'BAGAIMANA PEMBACA DISAPA',
    description: 'Nada sapaan dan cara kami membangun kedekatan dengan pembaca.',
    left: 'Menilai pembaca',
    right: 'Menyapa setara',
    defaultPosition: 5,
    positionNote: 'Satu-satunya nilai mutlak tanpa kompromi. Menukarnya demi interaksi sesaat merusak rasa aman pembaca.'
  },
  V2: {
    number: '02',
    icon: MessageCircle,
    title: 'Mudah untuk Dimulai',
    dimension: 'BIAYA MERESPONS KOMUNIKASI',
    description: 'Seberapa ringan usaha yang dibutuhkan pembaca untuk mulai terlibat.',
    left: 'Berat untuk dimulai',
    right: 'Mudah untuk dimulai',
    defaultPosition: 5,
    positionNote: 'Pria menghindari rasa malu dan sorotan publik. Turunkan biaya memulai sekecil mungkin.'
  },
  V3: {
    number: '03',
    icon: Lightbulb,
    title: 'Satu Langkah Nyata',
    dimension: 'BENTUK AJAKAN BERTINDAK',
    description: 'Seberapa konkret dan praktis ajakan atau saran yang kami berikan.',
    left: 'Dorongan yang umum',
    right: 'Langkah yang nyata',
    defaultPosition: 4,
    positionNote: 'Tawarkan tindakan nyata yang terjangkau untuk memulihkan kedaulatan diri (agency).'
  },
  V4: {
    number: '04',
    icon: Heart,
    title: 'Mulai dari yang Terlihat',
    dimension: 'URUTAN PENYAMPAIAN EMOSI',
    description: 'Urutan penyampaian antara label/emosi dan situasi yang mendasarinya.',
    left: 'Label/perasaan dulu',
    right: 'Situasi nyata dulu',
    defaultPosition: 4,
    positionNote: 'Deskripsi situasi fisik memungkinkan emosi hadir secara alami tanpa merasa dihakimi.'
  },
  V5: {
    number: '05',
    icon: ShieldCheck,
    title: 'Jelas Soal Keterbatasan',
    dimension: 'DERAJAT KEPASTIAN KLAIM',
    description: 'Seberapa tegas kami menyampaikan batasan dan tingkat kepastian informasi.',
    left: 'Kepastian mutlak',
    right: 'Kepastian sesuai bukti',
    defaultPosition: 4,
    positionNote: 'Jujur terhadap ketidakpastian ilmiah; batasi klaim pada bukti yang dapat diverifikasi.'
  },
  V6: {
    number: '06',
    icon: Target,
    title: 'Tunjukkan Tindakan, Bukan Tuntutan',
    dimension: 'ARAH TUNTUTAN PERUBAHAN',
    description: 'Bagaimana kami mendorong perubahan pada pembaca.',
    left: 'Menuntut berubah',
    right: 'Tindakan & bukti nyata',
    defaultPosition: 4,
    positionNote: 'Fokus pada pembenahan sistem dan kondisi lingkungan, bukan menuduh karakter pembaca.'
  }
};

interface Props {
  values: BrandValue[];
  /** Reader-facing name per value, supplied by the view that owns them. */
  rowTitles?: Record<string, string>;
  selectedId?: string;
  onSelect: (id: string) => void;
  renderDetail?: (id: string) => React.ReactNode;
  className?: string;
}

const SCALE = [1, 2, 3, 4, 5];

/** Position 1-5 as a percentage along the rail (0% to 100%). */
const pct = (position: number) => ((position - 1) / 4) * 100;

export const ValueSpectrum: React.FC<Props> = ({
  values,
  rowTitles,
  selectedId,
  onSelect,
  renderDetail,
  className,
}) => {
  return (
    <div
      className={`rounded-3xl border border-stone-200 dark:border-stone-800 bg-[#FDFDFC] dark:bg-stone-950/80 p-5 sm:p-7 md:p-9 shadow-raised space-y-6 sm:space-y-8 ${
        className ?? ''
      }`}
    >
      {/* Header */}
      <div className="border-b border-stone-200/80 dark:border-stone-800/80 pb-6">
        <div className="space-y-1.5 max-w-2xl">
          <span className="text-[11px] font-sans font-bold tracking-[0.2em] text-stone-500 dark:text-stone-400 uppercase block">
            MENUNGSA
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-stone-900 dark:text-stone-100 tracking-tight leading-tight">
            Spektrum Voice Menungsa
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 font-sans leading-relaxed">
            Posisi spektrum yang terkalibrasi sesuai karakter voice Menungsa pada setiap aspek.
          </p>
        </div>
      </div>

      {/* 6 Value Cards List */}
      <div className="space-y-4">
        {values.map((v) => {
          const cfg = SPECTRUM_CONFIG[v.id] ?? {
            number: v.id.replace('V', '').padStart(2, '0'),
            icon: Users,
            title: rowTitles?.[v.id] ?? v.value,
            dimension: v.spectrum.dimension,
            description: v.voiceTrait,
            left: v.spectrum.leftPole,
            right: v.spectrum.rightPole,
            defaultPosition: v.spectrum.position,
            positionNote: v.spectrum.positionNote
          };

          const IconComponent = cfg.icon;
          const isOpen = selectedId === v.id;
          const currentPos = cfg.defaultPosition;
          const positionPercent = pct(currentPos);

          return (
            <div
              key={v.id}
              className={`rounded-2xl border transition-all duration-200 p-4 sm:p-6 shadow-2xs ${
                isOpen
                  ? 'border-amber-400/80 dark:border-amber-500/50 bg-[#FCFBF8] dark:bg-stone-900/90 shadow-raised'
                  : 'border-stone-200/90 dark:border-stone-800/80 bg-white/90 dark:bg-stone-900/50 hover:border-stone-300 dark:hover:border-stone-700/80'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                {/* Left Block: Number Badge, Icon, Title, Dimension, Description */}
                <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                  {/* Number Badge */}
                  <div className="w-8 h-8 rounded-full bg-[#FAECE7] dark:bg-amber-950/60 text-[#AF4D28] dark:text-amber-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 border border-[#F4D3C9] dark:border-amber-900/50 mt-0.5">
                    {cfg.number}
                  </div>

                  {/* Icon Circle */}
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-stone-100 dark:bg-stone-800/90 text-stone-700 dark:text-stone-200 flex items-center justify-center shrink-0 border border-stone-200/70 dark:border-stone-700/60 shadow-2xs">
                    <IconComponent size={20} strokeWidth={1.9} />
                  </div>

                  {/* Title and descriptions */}
                  <div className="space-y-1 min-w-0 flex-1">
                    <h3
                      onClick={() => onSelect(v.id)}
                      className="font-serif font-bold text-base sm:text-lg lg:text-xl text-stone-900 dark:text-stone-100 leading-snug cursor-pointer hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                    >
                      {rowTitles?.[v.id] ?? cfg.title}
                    </h3>
                    <p className="text-[10px] sm:text-[11px] font-sans font-bold uppercase tracking-wider text-[#AF4D28] dark:text-amber-500">
                      {cfg.dimension}
                    </p>
                    <p className="text-xs sm:text-[13px] text-stone-600 dark:text-stone-400 font-sans leading-relaxed pt-0.5">
                      {cfg.description}
                    </p>
                  </div>
                </div>

                {/* Right Block: Static Spectrum Rail directly followed by Chevron */}
                <div className="flex items-center gap-4 sm:gap-6 shrink-0 w-full lg:w-auto pt-2 lg:pt-0 border-t lg:border-t-0 border-stone-100 dark:border-stone-800/60 justify-between lg:justify-end">
                  {/* Spectrum Rail (Static visual representation) */}
                  <div
                    className="w-full sm:w-[300px] md:w-[360px] lg:w-[380px] xl:w-[440px] select-none pointer-events-none cursor-default"
                    role="img"
                    aria-label={`Posisi ${cfg.title}: ${currentPos} dari 5`}
                  >
                    <div className="relative py-2 flex flex-col justify-center">
                      {/* Range Rail Container */}
                      <div className="relative h-2.5 sm:h-3 w-full rounded-full bg-stone-200/80 dark:bg-stone-800 overflow-hidden shadow-inner">
                        {/* Gradient Fill clipped to static calibrated position */}
                        <div
                          className="absolute inset-0 rounded-full"
                          style={{
                            background:
                              'linear-gradient(90deg, #AF4D28 0%, #CE7859 25%, #D9B44F 50%, #6A8E60 75%, #2E4034 100%)',
                            clipPath: `inset(0 ${100 - positionPercent}% 0 0)`,
                          }}
                        />

                        {/* Subtle tick markers inside the track */}
                        {SCALE.map((tick) => (
                          <div
                            key={tick}
                            className="absolute top-0 bottom-0 w-[1.5px] bg-white/50 dark:bg-stone-900/60 pointer-events-none -translate-x-1/2"
                            style={{ left: `${pct(tick)}%` }}
                          />
                        ))}
                      </div>

                      {/* Static Handle / Indicator Knob */}
                      <div
                        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-white dark:bg-stone-100 border-[2.5px] border-stone-300 dark:border-stone-600 shadow-sm pointer-events-none select-none z-10"
                        style={{ left: `${positionPercent}%` }}
                        aria-hidden="true"
                      />
                    </div>

                    {/* Numbers 1 - 5 directly below track */}
                    <div className="relative w-full h-4 mt-0.5" aria-hidden="true">
                      {SCALE.map((tick) => (
                        <span
                          key={tick}
                          className={`absolute -translate-x-1/2 font-mono text-[10px] sm:text-[11px] tabular-nums ${
                            currentPos === tick
                              ? 'text-stone-900 dark:text-stone-100 font-bold'
                              : 'text-stone-400 dark:text-stone-500'
                          }`}
                          style={{ left: `${pct(tick)}%` }}
                        >
                          {tick}
                        </span>
                      ))}
                    </div>

                    {/* Poles Left and Right */}
                    <div className="flex items-center justify-between gap-2 mt-1 text-[11px] sm:text-xs">
                      <span className="text-stone-500 dark:text-stone-400 font-sans text-left">
                        {cfg.left}
                      </span>
                      <span className="text-stone-800 dark:text-stone-200 font-medium font-sans text-right">
                        {cfg.right}
                      </span>
                    </div>
                  </div>

                  {/* Accordion Chevron Toggle */}
                  <button
                    type="button"
                    onClick={() => onSelect(v.id)}
                    aria-expanded={isOpen}
                    aria-label={`${isOpen ? 'Tutup' : 'Buka'} rincian ${cfg.title}`}
                    className="p-2 rounded-lg text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800/60 transition cursor-pointer shrink-0 ml-1"
                  >
                    <ChevronDown
                      size={20}
                      className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                </div>
              </div>

              {/* Accordion Content when Open */}
              {isOpen && renderDetail && (
                <div
                  role="region"
                  id={`vs-panel-${v.id}`}
                  className="mt-5 pt-5 border-t border-stone-200 dark:border-stone-800/80 animate-fadeIn"
                >
                  {renderDetail(v.id)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
