import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Search, Sparkles, BookOpen, PenTool, Sliders, MapPin } from 'lucide-react';
import type { FigureInfo } from '../common/FigureModal';
import { ThemeToggle } from './ThemeToggle';
import { SoundToggle } from './SoundToggle';
import { scrollItemIntoView } from '../../utils/overlay';
import type { ViewType } from '../../types';


interface Props {
  currentView: ViewType;
  onSelectView: (view: ViewType) => void;
  onOpenSearch: () => void;
  onOpenFigure?: (fig: FigureInfo) => void;
}

const PRIMARY_TABS: {
  id: ViewType;
  label: string;
  icon: React.ComponentType<{ size: number; className?: string }>;
}[] = [
  { id: 'foundations', label: 'Menungsa Voice', icon: Sparkles },
  { id: 'studio', label: 'Contoh Penulisan', icon: PenTool },
  { id: 'lexicon', label: 'Pemilihan Kata', icon: BookOpen },
  { id: 'sandbox', label: 'Cek Tulisan', icon: Sliders },
  { id: 'indonesia', label: 'Konteks Lokal', icon: MapPin },
];

export const Header: React.FC<Props> = ({ currentView, onSelectView, onOpenSearch }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const railRef = useRef<HTMLElement | null>(null);
  const activeRailItemRef = useRef<HTMLButtonElement | null>(null);
  const [railAtEnd, setRailAtEnd] = useState(false);

  // A scroll listener that calls setState on every frame of a fling is wasted
  // work; rAF collapses a burst of events into one read per paint.
  useEffect(() => {
    let frame = 0;
    const handleScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        setIsScrolled(window.scrollY > 12);
      });
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // The rail is wider than a phone, so the current view can sit off-screen after
  // a navigation. Centring it is what makes the rail readable as "where am I".
  useEffect(() => {
    scrollItemIntoView(activeRailItemRef.current);
  }, [currentView]);

  const syncRailEdge = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    setRailAtEnd(rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 2);
  }, []);

  useEffect(() => {
    syncRailEdge();
    window.addEventListener('resize', syncRailEdge);
    return () => window.removeEventListener('resize', syncRailEdge);
  }, [syncRailEdge]);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-[background-color,border-color,box-shadow,color] duration-300 ${
        isScrolled
          ? 'border-b border-transparent bg-transparent'
          : 'border-b border-stone-800/80 bg-stone-950/95 backdrop-blur-md'
      }`}
    >
      {/* Scrolled Gradient Backdrop: solid at the top to transparent at the bottom */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 pointer-events-none transition-opacity duration-300 -z-10 ${
          isScrolled ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background:
            'linear-gradient(to bottom, var(--color-stone-950) 0%, color-mix(in srgb, var(--color-stone-950) 88%, transparent) 45%, color-mix(in srgb, var(--color-stone-950) 25%, transparent) 80%, transparent 100%)',
          backdropFilter: isScrolled ? 'blur(10px)' : 'none',
          WebkitBackdropFilter: isScrolled ? 'blur(10px)' : 'none',
          WebkitMaskImage:
            'linear-gradient(to bottom, black 0%, black 55%, rgba(0, 0, 0, 0.3) 85%, transparent 100%)',
          maskImage:
            'linear-gradient(to bottom, black 0%, black 55%, rgba(0, 0, 0, 0.3) 85%, transparent 100%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left Branding */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectView('foundations')}
            className="flex items-center text-left cursor-pointer group focus:outline-none"
            aria-label="Home"
            title="Menungsa Writing Guideline"
          >
            <img
              src="/brand/menungsa-mark.png"
              alt="Menungsa"
              width={40}
              height={40}
              className={`w-10 h-10 rounded-[10px] border object-cover select-none group-hover:scale-105 group-hover:border-amber-500/50 transition-[scale,border-color,box-shadow] duration-300 ${
                isScrolled
                  ? 'border-stone-700/80 shadow-raised ring-1 ring-white/10 dark:ring-white/5'
                  : 'border-stone-800/90 shadow-xs'
              }`}
            />
          </button>
        </div>

        {/* Center Desktop Navigation Tabs with Apple-style Floating Pill */}
        <nav
          aria-label="Navigasi utama"
          className={`hidden md:flex items-center gap-1 p-1 rounded-xl transition-[background-color,border-color,box-shadow,color] duration-300 ${
            isScrolled
              ? 'bg-stone-900/90 dark:bg-stone-900/90 border border-stone-700/70 dark:border-stone-800/90 shadow-overlay backdrop-blur-md ring-1 ring-white/5'
              : 'bg-stone-900/70 border border-stone-800/80 shadow-none'
          }`}
        >
          {PRIMARY_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentView === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectView(tab.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-[background-color,color,box-shadow] duration-200 cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-amber-500 text-stone-950 font-semibold shadow-raised'
                    : isScrolled
                      ? 'text-stone-400 hover:text-stone-100 hover:bg-stone-800/70'
                      : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
                }`}
              >
                <Icon size={13} className={isActive ? 'text-stone-950' : 'text-amber-500 dark:text-amber-400/80'} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Utility Actions */}
        <div className="flex items-center gap-2">
          {/* Quick Search */}
          <button
            onClick={onOpenSearch}
            className={`flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg text-stone-300 text-xs font-sans transition-[background-color,border-color,box-shadow,color] duration-300 cursor-pointer ${
              isScrolled
                ? 'bg-stone-900/90 hover:bg-stone-850 border border-stone-700/70 dark:border-stone-800/90 shadow-overlay backdrop-blur-md'
                : 'bg-stone-900 hover:bg-stone-800 border border-stone-800'
            }`}
            aria-label="Cari"
            title="Cari (Cmd+K)"
          >
            <Search size={14} className="text-stone-400" />
            <span className="hidden lg:inline text-stone-400">Cari</span>
          </button>

          {/* Sound Interaction Toggle */}
          <SoundToggle isScrolled={isScrolled} />

          {/* Color Theme Toggle */}
          <ThemeToggle isScrolled={isScrolled} />
        </div>
      </div>

      {/* Mobile navigation rail.
          Five destinations behind a hamburger cost two taps and hid the reader's
          own location. A rail shows all five, marks the current one, and keeps
          every destination one tap away. The trailing fade is the cue that the
          row continues past the edge; it is dropped once the rail is scrolled
          to its end so a finished row does not pretend to have more. */}
      <nav
        aria-label="Navigasi utama"
        ref={railRef}
        onScroll={syncRailEdge}
        data-at-end={railAtEnd}
        className={`md:hidden flex items-center gap-1.5 overflow-x-auto no-scrollbar px-4 pb-2.5 pt-0.5 ${
          isScrolled ? '' : 'border-t border-stone-800/60'
        }`}
      >
        {PRIMARY_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentView === tab.id;
          return (
            <button
              key={tab.id}
              ref={isActive ? activeRailItemRef : undefined}
              onClick={() => onSelectView(tab.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`shrink-0 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer flex items-center gap-1.5 border ${
                isActive
                  ? 'bg-amber-500 text-stone-950 font-semibold border-amber-500 shadow-raised'
                  : 'bg-stone-900/80 text-stone-300 border-stone-800 backdrop-blur-md'
              }`}
            >
              <Icon size={13} className={isActive ? 'text-stone-950' : 'text-amber-500 dark:text-amber-400/80'} />
              <span className="whitespace-nowrap">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
};
