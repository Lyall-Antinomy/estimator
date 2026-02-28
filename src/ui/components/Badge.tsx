import React from 'react';

type Tone = 'core' | 'utility' | 'optional' | 'truth' | 'spec' | 'derived';

export function Badge({
  tone,
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone: Tone }) {
  const base =
    'inline-flex items-center rounded-full px-2 py-1 text-[11px] leading-none border';

  const tones: Record<Tone, string> = {
    core: 'border-[var(--border)] text-[var(--foreground)] bg-white/5',
    utility: 'border-[var(--border)] text-[var(--muted)] bg-white/5',
    optional: 'border-[var(--border)] text-[var(--muted)] bg-transparent',
    truth: 'border-[var(--bureau-green)] text-[var(--bureau-green)] bg-[var(--bureau-green-10)]',
    spec: 'border-[var(--border)] text-[var(--foreground)] bg-transparent',
    derived: 'border-[var(--border)] text-[var(--muted)] bg-white/5 italic',
  };

  return (
    <span className={[base, tones[tone], className].filter(Boolean).join(' ')} {...props}>
      {children}
    </span>
  );
}