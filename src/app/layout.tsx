// src/app/layout.tsx
import './globals.css';

export const metadata = {
  title: 'Estimator',
  description: 'The Bureau — Estimator',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}