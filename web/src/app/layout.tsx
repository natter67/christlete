import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Christlete: Faith for the Athlete',
  description:
    'A faith-centered platform for Christian athletes. Daily devotionals, pregame prayer check-ins, and team prayer groups built around the real moments of competition.',
  icons: { icon: '/favicon.svg' },
  openGraph: {
    title: 'Christlete',
    description: 'Where faith meets the field.',
    siteName: 'Christlete',
    url: 'https://christlete.love',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Christlete: Faith for the Athlete',
    description: 'Where faith meets the field.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#0F172A] text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}
