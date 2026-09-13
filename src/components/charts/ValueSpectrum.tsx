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
  icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
  iconBgLight: string;
  iconBgDark: string;
  title: string;
  description: string;
  left: string;
  right: string;
  positionPercent: number;
}

const SPECTRUM_CONFIG: Record<string, ValueConfig> = {
  V1: {
    icon: Users,
    iconBgLight: 'bg-[#FCEFEA] text-[#AF4D28] border border-[#FADCD1]',
    iconBgDark: 'dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800/50',
    title: 'Teman Pembaca yang Baik',
    description: 'Nada sapaan dan cara kami membangun kedekatan dengan pembaca.',
    left: 'Menilai pembaca',
    right: 'Menyapa setara',
    positionPercent: 100
  },
  V2: {
    icon: MessageCircle,
    iconBgLight: 'bg-[#EDF3FA] text-[#17243D] border border-[#D5E3F5]',
    iconBgDark: 'dark:bg-sky-950/50 dark:text-sky-300 dark:border-sky-800/50',
    title: 'Mudah untuk Dimulai',
    description: 'Seberapa ringan usaha yang dibutuhkan pembaca untuk mulai terlibat.',
    left: 'Berat untuk dimulai',
    right: 'Mudah untuk dimulai',
    positionPercent: 100
  },
  V3: {
    icon: Lightbulb,
    iconBgLight: 'bg-[#FDF9ED] text-[#8C6A18] border border-[#F7EAC4]',
    iconBgDark: 'dark:bg-yellow-950/50 dark:text-yellow-300 dark:border-yellow-800/50',
    title: 'Ajakan yang Konkret',
    description: 'Seberapa konkret dan praktis ajakan atau saran yang kami berikan.',
    left: 'Dorongan yang umum',
    right: 'Langkah yang nyata',
    positionPercent: 75
  },
  V4: {
    icon: Heart,
    iconBgLight: 'bg-[#FDF0ED] text-[#AF4D28] border border-[#FAD7CE]',
    iconBgDark: 'dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800/50',
    title: 'Urutan Penyampaian Emosi',
    description: 'Urutan penyampaian antara label/emosi dan situasi yang mendasarinya.',
    left: 'Label/perasaan dulu',
    right: 'Situasi nyata dulu',
    positionPercent: 75
  },
  V5: {
    icon: ShieldCheck,
    iconBgLight: 'bg-[#EDF4EF] text-[#2E4034] border border-[#D3E3D7]',
    iconBgDark: 'dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/50',
    title: 'Tingkat Kepastian Informasi',
    description: 'Seberapa tegas kami menyampaikan batasan dan tingkat kepastian informasi.',
    left: 'Kepastian mutlak',
    right: 'Kepastian sesuai bukti',
    positionPercent: 75
  },
  V6: {
    icon: Target,
    iconBgLight: 'bg-[#F2EFFC] text-[#4A3575] border border-[#DDD6FE]',
    iconBgDark: 'dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800/50',
    title: 'Arah Tindakan',
    description: 'Bagaimana kami mendorong perubahan pada pembaca.',
    left: 'Menuntut berubah',
    right: 'Tindakan & bukti nyata',
    positionPercent: 75
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
      {/* Header matching the latest design mockup */}
      <div className="border-b border-stone-200/80 dark:border-stone-800/80 pb-6">
        <div className="space-y-1.5 max-w-2xl">
          <span className="text-[11px] font-sans font-bold tracking-[0.2em] text-stone-500 dark:text-stone-400 uppercase block">
            MENUNGSA
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-stone-900 dark:text-stone-100 tracking-tight leading-tight">
            Spektrum Voice Menungsa
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 font-sans leading-relaxed">
            Atur posisi yang paling sesuai dengan voice Menungsa untuk setiap aspek.
          </p>
        </div>
      </div>

      {/* 6 Value Cards List */}
      <div className="space-y-4">
        {values.map((v) => {
          const cfg = SPECTRUM_CONFIG[v.id] ?? {
            icon: Users,
            iconBgLight: 'bg-[#FCEFEA] text-[#AF4D28] border border-[#FADCD1]',
            iconBgDark: 'dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800/50',
            title: rowTitles?.[v.id] ?? v.value,
            description: v.voiceTrait,
            left: v.spectrum.leftPole,
            right: v.spectrum.rightPole,
            positionPercent: ((v.spectrum.position - 1) / 4) * 100
          };

          const IconComponent = cfg.icon;
          const isOpen = selectedId === v.id;

          return (
            <div
              key={v.id}
              className={`rounded-2xl border transition-all duration-200 p-4 sm:p-5 lg:p-6 shadow-2xs ${
                isOpen
                  ? 'border-amber-400/80 dark:border-amber-500/50 bg-[#FCFBF8] dark:bg-stone-900/90 shadow-raised'
                  : 'border-stone-200/90 dark:border-stone-800/80 bg-white/95 dark:bg-stone-900/50 hover:border-stone-300 dark:hover:border-stone-700/80'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                {/* Left Block: Icon and Title & Description */}
                <div className="flex items-start gap-3.5 sm:gap-4 flex-1 min-w-0">
                  {/* Icon Circle with individual wash background */}
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 shadow-2xs transition-colors ${cfg.iconBgLight} ${cfg.iconBgDark}`}
                  >
                    <IconComponent size={20} strokeWidth={1.85} />
                  </div>

                  {/* Title and descriptions */}
                  <div className="space-y-1 min-w-0 flex-1 pt-0.5">
                    <h3
                      onClick={() => onSelect(v.id)}
                      className="font-serif font-bold text-base sm:text-lg lg:text-xl text-stone-900 dark:text-stone-100 leading-snug cursor-pointer hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
                    >
                      {rowTitles?.[v.id] ?? cfg.title}
                    </h3>
                    <p className="text-xs sm:text-[13px] text-stone-600 dark:text-stone-300 font-sans leading-relaxed">
                      {cfg.description}
                    </p>
                  </div>
                </div>

                {/* Right Block: Spectrum Rail directly followed by Chevron */}
                <div className="flex items-center gap-4 sm:gap-6 shrink-0 w-full lg:w-auto pt-2 lg:pt-0 border-t lg:border-t-0 border-stone-100 dark:border-stone-800/60 justify-between lg:justify-end">
                  {/* Spectrum Rail Container */}
                  <div
                    className="w-full sm:w-[300px] md:w-[360px] lg:w-[380px] xl:w-[440px] select-none pointer-events-none cursor-default"
                    role="img"
                    aria-label={`Spektrum ${cfg.title}: dari ${cfg.left} ke ${cfg.right}`}
                  >
                    <div className="relative py-2 flex flex-col justify-center">
                      {/* Rail Track */}
                      <div className="relative h-2.5 sm:h-3 w-full rounded-full bg-stone-200/90 dark:bg-stone-800 overflow-hidden shadow-inner">
                        {/* Gradient Fill */}
                        <div
                          className="absolute inset-0 rounded-full"
                          style={{
                            background:
                              'linear-gradient(90deg, #AF4D28 0%, #D47B53 25%, #D9B44F 50%, #688C68 75%, #2E4034 100%)',
                            clipPath: `inset(0 ${100 - cfg.positionPercent}% 0 0)`,
                          }}
                        />

                        {/* Segment separators at 25%, 50%, 75% */}
                        {[25, 50, 75].map((sep) => (
                          <div
                            key={sep}
                            className="absolute top-0 bottom-0 w-[1.5px] bg-white/70 dark:bg-stone-900/60 pointer-events-none -translate-x-1/2"
                            style={{ left: `${sep}%` }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Poles Left and Right */}
                    <div className="flex items-center justify-between gap-2 mt-0.5 text-[11px] sm:text-xs">
                      <span className="text-stone-500 dark:text-stone-400 font-sans text-left">
                        {cfg.left}
                      </span>
                      <span className="text-stone-700 dark:text-stone-200 font-medium font-sans text-right">
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
                    className="p-2 rounded-lg text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800/60 transition cursor-pointer shrink-0 ml-1"
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
