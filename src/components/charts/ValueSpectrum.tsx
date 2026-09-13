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
    iconBgLight: 'bg-amber-950 text-amber-500 border border-amber-900',
    iconBgDark: 'dark:bg-amber-950 dark:text-amber-500 dark:border-amber-900',
    title: 'Setara, Bukan Menghakimi',
    description: 'Seberapa setara dan tidak menghakimi cara kami berbicara kepada pembaca.',
    left: 'Menilai pembaca',
    right: 'Menyapa setara',
    positionPercent: 100
  },
  V2: {
    icon: MessageCircle,
    iconBgLight: 'bg-sky-950 text-sky-700 border border-sky-900',
    iconBgDark: 'dark:text-sky-400 dark:border-sky-800',
    title: 'Mudah untuk Dimulai',
    description: 'Seberapa ringan langkah pertama yang dibutuhkan pembaca untuk mulai terlibat.',
    left: 'Berat untuk dimulai',
    right: 'Mudah untuk dimulai',
    positionPercent: 100
  },
  V3: {
    icon: Lightbulb,
    iconBgLight: 'bg-mn-gold-soft text-mn-blue border border-mn-gold-mid',
    iconBgDark: 'dark:bg-mn-gold-mid/15 dark:text-mn-gold dark:border-mn-gold-mid/45',
    title: 'Satu Langkah Nyata',
    description: 'Seberapa jelas dan realistis tindakan pertama yang kami tawarkan.',
    left: 'Dorongan yang umum',
    right: 'Langkah yang nyata',
    positionPercent: 75
  },
  V4: {
    icon: Heart,
    iconBgLight: 'bg-amber-950 text-amber-500 border border-amber-900',
    iconBgDark: 'dark:bg-amber-950 dark:text-amber-500 dark:border-amber-900',
    title: 'Mulai dari yang Terlihat',
    description: 'Seberapa jauh kami memulai dari situasi yang bisa dikenali sebelum menafsirkan pengalaman pembaca.',
    left: 'Label/perasaan dulu',
    right: 'Situasi nyata dulu',
    positionPercent: 75
  },
  V5: {
    icon: ShieldCheck,
    iconBgLight: 'bg-emerald-950 text-emerald-700 border border-emerald-900',
    iconBgDark: 'dark:text-emerald-400 dark:border-emerald-800',
    title: 'Jelas soal Batasan',
    description: 'Seberapa jelas kami membedakan apa yang diketahui, belum diketahui, dan belum bisa dilakukan.',
    left: 'Kepastian mutlak',
    right: 'Kepastian sesuai bukti',
    positionPercent: 75
  },
  V6: {
    icon: Target,
    iconBgLight: 'bg-sky-950 text-sky-700 border border-sky-900',
    iconBgDark: 'dark:text-sky-400 dark:border-sky-800',
    title: 'Tindakan, Bukan Tuntutan',
    description: 'Seberapa konkret kami menunjukkan tindakan Menungsa tanpa menentukan apa yang orang lain seharusnya lakukan.',
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
      className={`rounded-3xl border border-stone-800 bg-stone-900 p-5 sm:p-7 md:p-9 space-y-6 sm:space-y-8 ${
        className ?? ''
      }`}
    >
      {/* Header matching DESIGN.md typography tokens */}
      <div className="border-b border-stone-800 pb-6">
        <div className="space-y-1.5 max-w-2xl">
          <span className="text-[11px] font-sans font-bold tracking-[0.2em] text-amber-500 uppercase block">
            MENUNGSA
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-stone-100 tracking-tight leading-tight">
            Spektrum Voice Menungsa
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 font-sans leading-relaxed">
            Atur posisi yang paling sesuai dengan voice Menungsa untuk setiap aspek.
          </p>
        </div>
      </div>

      {/* 6 Value Cards List */}
      <div className="space-y-4">
        {values.map((v) => {
          const cfg = SPECTRUM_CONFIG[v.id] ?? {
            icon: Users,
            iconBgLight: 'bg-amber-950 text-amber-500 border border-amber-900',
            iconBgDark: 'dark:bg-amber-950 dark:text-amber-500 dark:border-amber-900',
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
              className={`rounded-2xl border transition-colors duration-200 p-4 sm:p-5 lg:p-6 ${
                isOpen
                  ? 'border-amber-500 bg-stone-900'
                  : 'border-stone-800 bg-stone-950 hover:border-stone-700'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                {/* Left Block: Icon and Title & Description */}
                <div className="flex items-start gap-3.5 sm:gap-4 flex-1 min-w-0">
                  {/* Icon Circle with individual wash background */}
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-colors ${cfg.iconBgLight} ${cfg.iconBgDark}`}
                  >
                    <IconComponent size={20} strokeWidth={1.85} />
                  </div>

                  {/* Title and descriptions */}
                  <div className="space-y-1 min-w-0 flex-1 pt-0.5">
                    <h3
                      onClick={() => onSelect(v.id)}
                      className="font-serif font-bold text-base sm:text-lg lg:text-xl text-stone-100 hover:text-amber-600 dark:hover:text-amber-400 leading-snug cursor-pointer transition-colors"
                    >
                      {rowTitles?.[v.id] ?? cfg.title}
                    </h3>
                    <p className="text-xs sm:text-[13px] text-stone-500 dark:text-stone-300 font-sans leading-relaxed">
                      {cfg.description}
                    </p>
                  </div>
                </div>

                {/* Right Block: Spectrum Rail directly followed by Chevron */}
                <div className="flex items-center gap-4 sm:gap-6 shrink-0 w-full lg:w-auto pt-2 lg:pt-0 border-t lg:border-t-0 border-stone-800 justify-between lg:justify-end">
                  {/* Spectrum Rail Container */}
                  <div
                    className="w-full sm:w-[300px] md:w-[360px] lg:w-[380px] xl:w-[440px] select-none pointer-events-none cursor-default"
                    role="img"
                    aria-label={`Spektrum ${cfg.title}: dari ${cfg.left} ke ${cfg.right}`}
                  >
                    <div className="relative py-2 flex flex-col justify-center">
                      {/* Rail Track: soft warm bone in light mode, dark stone in dark mode */}
                      <div className="relative h-2.5 sm:h-3 w-full rounded-full bg-bone-shade dark:bg-stone-800 overflow-hidden">
                        {/* Gradient fill, anchored to the whole rail and clipped */}
                        <div
                          className="absolute inset-0 rounded-full"
                          style={{
                            background: 'linear-gradient(90deg, #AF4D28 0%, #2E4034 100%)',
                            clipPath: `inset(0 ${100 - cfg.positionPercent}% 0 0)`,
                          }}
                        >
                          {/* Segment separators, drawn only over the filled part */}
                          {[25, 50, 75]
                            .filter((sep) => sep < cfg.positionPercent)
                            .map((sep) => (
                              <div
                                key={sep}
                                className="absolute top-0 bottom-0 w-[1.5px] bg-bone/55 pointer-events-none -translate-x-1/2"
                                style={{ left: `${sep}%` }}
                              />
                            ))}
                        </div>
                      </div>
                    </div>

                    {/* Poles Left and Right */}
                    <div className="flex items-center justify-between gap-2 mt-0.5 text-[11px] sm:text-xs">
                      <span className="text-stone-500 dark:text-stone-400 font-sans text-left">
                        {cfg.left}
                      </span>
                      <span className="text-stone-300 dark:text-stone-200 font-medium font-sans text-right">
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
                    className="p-2 rounded-lg text-stone-500 dark:text-stone-400 hover:text-stone-100 hover:bg-stone-800/40 dark:hover:bg-stone-800/60 transition cursor-pointer shrink-0 ml-1"
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
                  className="mt-5 pt-5 border-t border-stone-800 animate-fadeIn"
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
