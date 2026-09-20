import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Shańyraq Word Builder',
  description: '4-сынып оқушыларына арналған prefix және suffix ойыны.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="kk">
      <body>{children}</body>
    </html>
  );
}
