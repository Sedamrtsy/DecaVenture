import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/hooks/useAuth';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Kitle Fonlama Platformu',
  description: 'Girişimciler ve yatırımcıları buluşturan kitle fonlama platformu',
  keywords: ['kitle fonlama', 'yatırım', 'girişim', 'startup', 'angel yatırım'],
  authors: [{ name: 'Kitle Fonlama Platformu' }],
  creator: 'Kitle Fonlama Platformu',
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://example.com',
    title: 'Kitle Fonlama Platformu',
    description: 'Girişimciler ve yatırımcıları buluşturan kitle fonlama platformu',
    siteName: 'Kitle Fonlama Platformu',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kitle Fonlama Platformu',
    description: 'Girişimciler ve yatırımcıları buluşturan kitle fonlama platformu',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#3b82f6',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
} 