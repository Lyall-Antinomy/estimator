import React from 'react';

export function Panel({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={['bureau-panel', 'p-4', className].filter(Boolean).join(' ')} {...props}>
      {children}
    </div>
  );
}