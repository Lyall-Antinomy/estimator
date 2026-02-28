import React from 'react';

type Variant = 'primary' | 'ghost' | 'danger';

export function Button({
  className,
  variant = 'primary',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  const base =
    'bureau-focus inline-flex items-center justify-center gap-2 rounded-[var(--radius)] px-3 py-2 text-sm font-medium transition';

  const variants: Record<Variant, string> = {
    primary: 'bg-[var(--bureau-green)] text-white hover:opacity-90 active:opacity-85',
    ghost: 'bg-transparent text-[var(--foreground)] border border-[var(--border)] hover:bg-white/5',
    danger: 'bg-transparent text-red-500 border border-red-500/50 hover:bg-red-500/10',
  };

  return (
    <button className={[base, variants[variant], className].filter(Boolean).join(' ')} {...props} />
  );
}