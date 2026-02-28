import React from 'react';

export function Segmented<T extends string | number>({
  value,
  options,
  onChange,
  className,
}: {
  value: T;
  options: Array<{ value: T; label: string }>;
  onChange: (v: T) => void;
  className?: string;
}) {
  return (
    <div
      className={['bureau-panel', 'p-1 flex gap-1 rounded-[var(--radius)]', className]
        .filter(Boolean)
        .join(' ')}
      role="tablist"
      aria-label="Segmented control"
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={String(opt.value)}
            type="button"
            onClick={() => onChange(opt.value)}
            className={[
              'bureau-focus flex-1 min-w-0 px-2 py-1 text-xs rounded-[calc(var(--radius)-6px)] transition',
              active
                ? 'bg-[var(--bureau-green)] text-white'
                : 'bg-transparent text-[var(--foreground)] hover:bg-white/5',
            ].join(' ')}
            role="tab"
            aria-selected={active}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}