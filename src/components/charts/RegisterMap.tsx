import React, { useState } from 'react';
import type { LanguageRegister } from '../../types';
import { scaleLinear, jitter } from './chartUtils';

interface Props {
  registers: LanguageRegister[];
  selectedId: string;
  onSelect: (id: string) => void;
  /** Optionally dim registers a given speaker is not licensed to use. */
  licensedIds?: string[];
}

const W = 560;
const H = 340;
const M = { top: 36, right: 26, bottom: 42, left: 42 };

const TYPE_SHAPES: Record<string, { label: string; shape: 'circle' | 'square' | 'triangle' | 'diamond' }> = {
  '1st_person_singular': { label: 'orang ke-1 tunggal', shape: 'circle' },
  '2nd_person_singular': { label: 'orang ke-2 tunggal', shape: 'square' },
  '1st_person_plural': { label: 'orang ke-1 jamak', shape: 'diamond' },
  gender_term: { label: 'istilah gender', shape: 'triangle' },
  vocative: { label: 'sapaan/panggilan', shape: 'diamond' },
};

function shapePath(shape: string, cx: number, cy: number, r: number): string {
  switch (shape) {
    case 'square':
      return `M${cx - r},${cy - r} h${r * 2} v${r * 2} h${-r * 2} Z`;
    case 'triangle':
      return `M${cx},${cy - r * 1.15} L${cx + r * 1.1},${cy + r * 0.85} L${cx - r * 1.1},${cy + r * 0.85} Z`;
    case 'diamond':
      return `M${cx},${cy - r * 1.2} L${cx + r * 1.2},${cy} L${cx},${cy + r * 1.2} L${cx - r * 1.2},${cy} Z`;
    default:
      return `M${cx},${cy} m${-r},0 a${r},${r} 0 1,0 ${r * 2},0 a${r},${r} 0 1,0 ${-r * 2},0`;
  }
}

export const MoonPhase: React.FC<{
  level: number;
  max?: number;
  size?: number;
  className?: string;
}> = ({ level, max = 5, size = 14, className = '' }) => {
  const clamped = Math.max(0, Math.min(max, Math.round((level / max) * 5)));

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      className={`shrink-0 inline-block align-middle ${className}`}
      aria-hidden="true"
    >
      <circle
        cx="8"
        cy="8"
        r="6"
        fill="currentColor"
        fillOpacity="0.12"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeOpacity="0.35"
      />
      {clamped === 1 && (
        <path
          d="M 8 2 A 6 6 0 0 1 8 14 A 4.2 6 0 0 0 8 2 Z"
          fill="currentColor"
        />
      )}
      {clamped === 2 && (
        <path
          d="M 8 2 A 6 6 0 0 1 8 14 A 2 6 0 0 0 8 2 Z"
          fill="currentColor"
        />
      )}
      {clamped === 3 && (
        <path
          d="M 8 2 A 6 6 0 0 1 8 14 L 8 2 Z"
          fill="currentColor"
        />
      )}
      {clamped === 4 && (
        <path
          d="M 8 2 A 6 6 0 0 1 8 14 A 3.5 6 0 0 1 8 2 Z"
          fill="currentColor"
        />
      )}
      {clamped >= 5 && (
        <circle
          cx="8"
          cy="8"
          r="6"
          fill="currentColor"
        />
      )}
    </svg>
  );
};

export const LunarPips: React.FC<{
  level: number;
  max?: number;
  label: string;
  activeColor?: string;
}> = ({
  level,
  max = 5,
  label,
  activeColor = 'bg-amber-400 dark:bg-amber-300 shadow-[0_0_5px_rgba(245,158,11,0.5)]',
}) => {
  return (
    <span
      className="inline-flex items-center gap-1.5 align-middle"
      title={`${label}: ${level}/${max}`}
      aria-label={`${label} ${level} dari ${max}`}
    >
      <span className="text-stone-400 text-[10.5px] font-mono">{label}</span>
      <span className="inline-flex items-center gap-1" aria-hidden="true">
        {Array.from({ length: max }, (_, i) => {
          const isFilled = i < level;
          return (
            <span
              key={i}
              className={`inline-block w-2 h-2 rounded-full transition-all duration-200 ${
                isFilled
                  ? activeColor
                  : 'border border-stone-600/70 dark:border-stone-700/80 bg-stone-800/30'
              }`}
            />
          );
        })}
      </span>
      <span className="sr-only">({level}/{max})</span>
    </span>
  );
};


export const RegisterMap: React.FC<Props> = ({ registers, selectedId, onSelect, licensedIds }) => {
  const [hover, setHover] = useState<string | null>(null);

  const x = scaleLinear(0.5, 5.5, M.left, W - M.right);
  const y = scaleLinear(0.5, 5.5, H - M.bottom, M.top);

  // Deterministic circular offset using jitter so coincident points spread out
  const countPerCoord = new Map<string, number>();
  registers.forEach((r) => {
    const key = `${r.authorityLevel}:${r.intimacyLevel}`;
    countPerCoord.set(key, (countPerCoord.get(key) ?? 0) + 1);
  });
  const seen = new Map<string, number>();
  const placed = registers.map((r) => {
    const key = `${r.authorityLevel}:${r.intimacyLevel}`;
    const total = countPerCoord.get(key) ?? 1;
    const n = seen.get(key) ?? 0;
    seen.set(key, n + 1);

    let dx = 0;
    let dy = 0;
    let labelDy = -9;

    if (total > 1) {
      const j = jitter(n, total, 16);
      dx = j.dx;
      dy = j.dy;
      labelDy = dy >= 0 ? 14 : -9;
    }

    return { ...r, dx, dy, labelDy };
  });

  const active = hover ?? selectedId;
  const activeReg = placed.find((r) => r.id === active);
  const shapes = Array.from(new Set(registers.map((r) => TYPE_SHAPES[r.type]?.shape ?? 'circle')));

  return (
    <div className="rounded-xl border border-stone-800 bg-stone-950/90 overflow-hidden shadow-2xl">
      {/* Sleek Compact Header */}
      <header className="px-4 py-2.5 border-b border-stone-800 flex flex-wrap items-center justify-between gap-2 bg-stone-900/40">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-serif font-semibold text-stone-100 text-sm md:text-base">
              Peta Koordinat Ragam Bahasa &amp; Kata Ganti
            </h3>
            <span className="px-1.5 py-0.5 rounded font-mono text-[9.5px] uppercase tracking-wider bg-stone-800 text-stone-300 border border-stone-700">
              Otoritas × Keakraban
            </span>
          </div>
          <p className="text-stone-400 text-[11px] font-sans">
            Titik tengah (3/5, 3/5) adalah jangkar kesetaraan Menungsa ("kamu")
          </p>
        </div>

        {/* Legend Pills */}
        <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-stone-400">
          {shapes.map((s) => {
            const entry = Object.values(TYPE_SHAPES).find((t) => t.shape === s);
            return (
              <span key={s} className="inline-flex items-center gap-1 bg-stone-900/80 px-1.5 py-0.5 rounded border border-stone-800">
                <svg width={10} height={10} viewBox="0 0 10 10" aria-hidden className="shrink-0">
                  <path d={shapePath(s, 5, 5, 3.5)} fill="#af4d28" />
                </svg>
                <span className="whitespace-nowrap">{entry?.label}</span>
              </span>
            );
          })}
        </div>
      </header>

      {/* SVG Canvas */}
      {/* `role="img"` hid the eight nodes that are `role="button"` and keyboard
          reachable; a group keeps the label without flattening the controls. */}
      <div
        className="p-3 overflow-x-auto relative scroll-hint-x"
        onScroll={(e) => {
          const el = e.currentTarget;
          el.dataset.atEnd = String(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);
        }}
      >
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-auto block min-w-[520px]"
          role="group"
          aria-label="Peta ragam bahasa dan kata ganti berdasarkan tingkat otoritas dan kedekatan hubungan"
        >
          <title>Peta Koordinat Ragam Bahasa dan Kata Ganti</title>

          <defs>
            {/* Ambient Glow for Active Nodes */}
            <filter id="regGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Dynamic Radial Glow Halo for Active Selected Node */}
            <radialGradient id="nodeHaloGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#af4d28" stopOpacity="0.35" />
              <stop offset="55%" stopColor="#af4d28" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#af4d28" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Precision Grid Lines */}
          <g className="chart-grid">
            {[1, 2, 3, 4, 5].map((v) => (
              <React.Fragment key={v}>
                <line
                  x1={x(v)}
                  y1={M.top}
                  x2={x(v)}
                  y2={H - M.bottom}
                  stroke={v === 3 ? 'rgba(175, 77, 40, 0.35)' : 'var(--chart-grid)'}
                  strokeWidth={v === 3 ? 1.2 : 0.8}
                  strokeDasharray={v === 3 ? '3 3' : '2 3'}
                />
                <line
                  x1={M.left}
                  y1={y(v)}
                  x2={W - M.right}
                  y2={y(v)}
                  stroke={v === 3 ? 'rgba(175, 77, 40, 0.35)' : 'var(--chart-grid)'}
                  strokeWidth={v === 3 ? 1.2 : 0.8}
                  strokeDasharray={v === 3 ? '3 3' : '2 3'}
                />
              </React.Fragment>
            ))}
          </g>

          {/* Ticks Numbers */}
          {[1, 2, 3, 4, 5].map((v) => (
            <React.Fragment key={`t${v}`}>
              <text x={x(v)} y={H - M.bottom + 14} textAnchor="middle" className="font-mono text-[10px] fill-stone-500">
                {v}
              </text>
              <text x={M.left - 8} y={y(v) + 3} textAnchor="end" className="font-mono text-[10px] fill-stone-500">
                {v}
              </text>
            </React.Fragment>
          ))}

          {/* Outer Border */}
          <rect
            x={M.left}
            y={M.top}
            width={W - M.left - M.right}
            height={H - M.top - M.bottom}
            fill="none"
            stroke="var(--chart-grid)"
            strokeWidth={1}
            rx={4}
          />

          {/* Axis Labels */}
          <text
            x={(M.left + W - M.right) / 2}
            y={H - 10}
            textAnchor="middle"
            className="font-mono text-[9.5px] uppercase tracking-wider fill-stone-500"
          >
            ← Rendah · Otoritas &amp; Jarak Institusional · Tinggi →
          </text>
          <text
            x={12}
            y={(M.top + H - M.bottom) / 2}
            textAnchor="middle"
            className="font-mono text-[9.5px] uppercase tracking-wider fill-stone-500"
            transform={`rotate(-90 12 ${(M.top + H - M.bottom) / 2})`}
          >
            ← Rendah · Kedekatan Hubungan (Intimacy) · Tinggi →
          </text>

          {/* Data Points */}
          {placed.map((r) => {
            const cx = x(r.authorityLevel) + r.dx;
            const cy = y(r.intimacyLevel) + r.dy;
            const isActive = active === r.id;
            const dimmed = licensedIds ? !licensedIds.includes(r.id) : false;
            const shape = TYPE_SHAPES[r.type]?.shape ?? 'circle';

            return (
              <g key={r.id} opacity={dimmed ? 0.25 : 1} className="cursor-pointer">
                {/* Hit Area */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={20}
                  fill="transparent"
                  className="chart-mark-interactive chart-focusable"
                  tabIndex={0}
                  role="button"
                  aria-label={`${r.label}, otoritas ${r.authorityLevel}, kedekatan ${r.intimacyLevel}`}
                  onMouseEnter={() => setHover(r.id)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(r.id)}
                  onBlur={() => setHover(null)}
                  onClick={() => onSelect(r.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelect(r.id);
                    }
                  }}
                />

                {/* Dynamic Multi-layered Halo Effect for Active Selected Node */}
                {isActive && (
                  <>
                    {/* 1. Ambient Radial Halo Glow */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={28}
                      fill="url(#nodeHaloGlow)"
                      pointerEvents="none"
                    />

                    {/* 2. Concentric Dashed Orbit Ring */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={18}
                      fill="none"
                      stroke="#af4d28"
                      strokeOpacity={0.65}
                      strokeWidth={1.2}
                      strokeDasharray="3 3"
                      pointerEvents="none"
                      className="animate-spin-slow"
                    />

                    {/* 3. Inner Focus Ring */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={11}
                      fill="none"
                      stroke="#af4d28"
                      strokeWidth={1.5}
                      filter="url(#regGlow)"
                      pointerEvents="none"
                    />
                  </>
                )}

                {/* Shape Glyph */}
                <path
                  d={shapePath(shape, cx, cy, isActive ? 6.5 : 5)}
                  fill={isActive ? '#af4d28' : 'var(--chart-axis)'}
                  stroke="var(--chart-surface)"
                  strokeWidth={1.5}
                  pointerEvents="none"
                />

                {/* Text Label - Smaller, Refined Typography */}
                <text
                  x={cx}
                  y={cy + r.labelDy}
                  textAnchor="middle"
                  className={`font-sans text-[10px] select-none pointer-events-none tracking-tight ${
                    isActive
                      ? 'fill-stone-100 font-bold'
                      : 'fill-stone-400 font-medium'
                  }`}
                  style={{
                    textShadow: isActive ? '0 1px 3px rgba(0,0,0,0.4)' : 'none',
                  }}
                >
                  {r.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Integrated Non-Obstructing Status Bar */}
      {activeReg && (
        <div className="px-4 py-2.5 border-t border-stone-800 bg-stone-900/50 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 text-xs font-sans">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <span className="font-serif font-semibold text-stone-100 text-sm">
              "{activeReg.term}"
            </span>
            {activeReg.id === 'kamu' && (
              <span className="px-1.5 py-0.5 rounded font-mono text-[9.5px] uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                ★ Titik Seimbang Menungsa
              </span>
            )}
            <div className="inline-flex items-center gap-2">
              <LunarPips level={activeReg.authorityLevel} label="Otoritas" />
              <span className="text-stone-500 select-none text-[10px]">·</span>
              <LunarPips level={activeReg.intimacyLevel} label="Kedekatan" />
            </div>
          </div>
          <p className="text-stone-300 text-[11.5px] leading-relaxed max-w-xl">
            {activeReg.socialRelationship}
          </p>
        </div>
      )}

      {/* Footer */}
      <footer className="px-4 py-1.5 border-t border-stone-800 text-stone-500 text-[10px] font-mono flex items-center justify-between">
        <span>SINTESIS SOSIOLINGUISTIK MENUNGSA</span>
        <span className="text-stone-400 hidden sm:inline">SKALA KOORDINAT 1–5</span>
      </footer>
    </div>
  );
};
