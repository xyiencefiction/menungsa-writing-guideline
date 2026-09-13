import React from 'react';

/**
 * The DO / DON'T pair is the guideline's core content pattern, and it is a real
 * two-column comparison — but only for as long as two columns actually fit.
 *
 * The width that decides this is the *card's*, not the viewport's. The writing
 * studio's two-column mode drops these tables into ~250px cards on a 1280px
 * desktop, so a viewport breakpoint keeps them side by side and squeezes each
 * example down to a twenty-character measure. The container query in
 * `.cmp` asks the only question that matters: is there room here?
 *
 * Below the threshold the halves stack and each one repeats its own label. The
 * header row is the wrong place for that meaning once the cells no longer sit
 * beside each other, and a stacked "DO" block with no marker is just a quote.
 */

export interface ComparisonRow {
  id: string;
  /** Rendered in the DO half. Omit to leave the half empty. */
  positive?: React.ReactNode;
  /** Rendered in the DON'T half. Omit to leave the half empty. */
  negative?: React.ReactNode;
}

interface Props {
  /** Label node for the DO half. Rendered twice: header row, and per-row when stacked. */
  positiveLabel: React.ReactNode;
  negativeLabel: React.ReactNode;
  rows: ComparisonRow[];
  /** Slot rendered at the trailing edge of the DO header cell, e.g. a copy button. */
  positiveHeaderAction?: React.ReactNode;
  /** Placeholder for a half with no content. */
  emptySlot?: React.ReactNode;
  className?: string;
  /** Tighter padding for cards that are already dense. */
  dense?: boolean;
  /**
   * Which width the halves split at.
   *
   * `short` (34rem) suits examples of roughly a hundred characters — the value
   * pillars, the playbook, the context check. `long` (54rem) is for the writing
   * studio, whose exemplars run to a 210-character median and a 307-character
   * 90th percentile; those need about 400px a side before two columns read as a
   * comparison instead of two narrow ribbons.
   */
  measure?: 'short' | 'long';
}

const HEAD_CELL =
  'p-3 font-semibold uppercase tracking-wider font-mono text-[11px] flex items-center gap-1.5';

export const ComparisonTable: React.FC<Props> = ({
  positiveLabel,
  negativeLabel,
  rows,
  positiveHeaderAction,
  emptySlot,
  className = '',
  dense = false,
  measure = 'short',
}) => {
  // The example is the content; its size is declared here rather than left to
  // whatever each call site inherited. Both halves get the same size on purpose:
  // the DON'T is not a footnote, it is half the lesson, and shrinking it tells
  // the reader it matters less than the thing it is there to contrast with.
  const pad = dense ? 'p-3' : 'p-3.5';
  const cell = dense ? 'text-sm' : 'text-base';

  return (
    <div
      className={`cmp ${measure === 'long' ? 'cmp-wide' : ''} overflow-hidden rounded-lg border border-stone-800 bg-stone-950 ${className}`}
    >
      {/* Header. Hidden by the container query as soon as the halves stack. */}
      <div className="cmp-head border-b border-stone-800">
        <div
          className={`${HEAD_CELL} justify-between border-r border-stone-800 bg-emerald-950 text-emerald-700 dark:text-emerald-400`}
        >
          <span className="flex items-center gap-1.5">{positiveLabel}</span>
          {positiveHeaderAction}
        </div>
        <div className={`${HEAD_CELL} bg-rose-950 text-rose-700 dark:text-rose-400`}>{negativeLabel}</div>
      </div>

      <div>
        {rows.map((row) => (
          <div key={row.id} className="cmp-row">
            <div
              className={`cmp-cell-do ${pad} ${cell} align-top bg-emerald-950 dark:bg-emerald-950/20 space-y-1.5`}
            >
              <div className="cmp-stack-label items-center justify-between gap-2 pb-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                <span className="flex items-center gap-1.5">{positiveLabel}</span>
                {positiveHeaderAction}
              </div>
              {row.positive ?? emptySlot}
            </div>

            <div className={`${pad} ${cell} align-top bg-rose-950 dark:bg-rose-950/20 space-y-1.5`}>
              <div className="cmp-stack-label items-center gap-1.5 pb-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-rose-700 dark:text-rose-400">
                {negativeLabel}
              </div>
              {row.negative ?? emptySlot}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
