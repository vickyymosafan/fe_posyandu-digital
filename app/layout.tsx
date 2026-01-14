import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/contexts';
import { NotificationProvider } from '@/components/ui';
import { QueryProvider } from '@/lib/providers/QueryProvider';

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Posyandu Lansia',
  description: 'Aplikasi Posyandu untuk manajemen data lansia dan pemeriksaan kesehatan',
  metadataBase: new URL('https://posyandu-digital.vercel.app'),
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Posyandu Lansia',
    description: 'Aplikasi Posyandu untuk manajemen data lansia dan pemeriksaan kesehatan',
    type: 'website',
    locale: 'id_ID',
  },
  twitter: {
    card: 'summary',
    title: 'Posyandu Lansia',
    description: 'Aplikasi Posyandu untuk manajemen data lansia dan pemeriksaan kesehatan',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${montserrat.variable} font-sans antialiased`}>
        <QueryProvider>
          <AuthProvider>
            <NotificationProvider position="top-right" defaultDuration={5000}>
              {children}
            </NotificationProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

