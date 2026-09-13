import React from 'react';
import { handleTablistKeys } from '../../utils/overlay';

/**
 * One filter row, one shape.
 *
 * The playbook, the writing studio and the cultural compass each grew their own
 * pill row, so the same choice looked like three different controls depending on
 * which view the reader had landed in. A segmented track states the set — the
 * options are bounded and mutually exclusive — while the underline states the
 * position inside it, and neither needs a filled chip shouting at full contrast
 * for every unselected option.
 *
 * Styling lives in `index.css` under `.seg-tabs`: the active state needs an
 * `::after` rule for the underline and an `::before` rule for the hairline
 * between segments, and neither is expressible as a utility class.
 */

export interface SegmentedTabItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
  /**
   * Id put on the button, for a panel's `aria-labelledby`, and the id of the
   * panel it controls. Pass both where the tabs drive a `role="tabpanel"`;
   * a filter row that only narrows a list below it needs neither.
   */
  tabId?: string;
  panelId?: string;
}

interface Props {
  items: SegmentedTabItem[];
  value: string;
  onChange: (id: string) => void;
  /** Names the group for assistive tech. Pass the heading the control sits under. */
  ariaLabel: string;
  /**
   * Stretch the segments to fill the track, each the same width.
   *
   * Use it when the control IS the page's primary choice and the reader has to
   * notice it: a row of content-width chips under a paragraph reads as three
   * loose buttons, while one full-width bar with equal thirds reads as "pick
   * one of these three". Leave it off for filters, where the row is secondary
   * and the labels vary wildly in length.
   */
  fill?: boolean;
  /** `lg` raises the segments to a primary control's size. */
  size?: 'md' | 'lg';
  className?: string;
}

export const SegmentedTabs: React.FC<Props> = ({
  items,
  value,
  onChange,
  ariaLabel,
  fill = false,
  size = 'md',
  className = '',
}) => (
  <div
    role="tablist"
    aria-label={ariaLabel}
    onKeyDown={(e) => handleTablistKeys(e, (i) => onChange(items[i].id))}
    onScroll={(e) => {
      const el = e.currentTarget;
      el.dataset.atEnd = String(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);
    }}
    className={`seg-tabs no-scrollbar scroll-hint-x ${fill ? 'seg-tabs-fill' : ''} ${
      size === 'lg' ? 'seg-tabs-lg' : ''
    } ${className}`}
  >
    {items.map((item) => {
      const isActive = item.id === value;
      const Icon = item.icon;
      return (
        <button
          key={item.id}
          type="button"
          role="tab"
          id={item.tabId}
          aria-controls={item.panelId}
          aria-selected={isActive}
          tabIndex={isActive ? 0 : -1}
          onClick={() => onChange(item.id)}
          data-press="none"
          className={`seg-tab ${isActive ? 'seg-tab-active' : ''}`}
        >
          {Icon && <Icon size={size === 'lg' ? 16 : 14} strokeWidth={1.9} className="shrink-0" />}
          <span>{item.label}</span>
        </button>
      );
    })}
  </div>
);
