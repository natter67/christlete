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
    title: 'Christlete: Faith for the Athlete',
    description: 'Daily devotionals, pregame prayer, and team groups built for Christian athletes.',
    siteName: 'Christlete',
    url: 'https://christlete.love',
    type: 'website',
    images: [
      {
        url: 'https://christlete.love/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Christlete: Faith for the Athlete',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Christlete: Faith for the Athlete',
    description: 'Daily devotionals, pregame prayer, and team groups built for Christian athletes.',
    images: ['https://christlete.love/og-image.png'],
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
