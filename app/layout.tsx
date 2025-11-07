import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/contexts';
import { NotificationProvider } from '@/components/ui';

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Posyandu Lansia',
  description: 'Aplikasi Posyandu untuk Lansia',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
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
        <AuthProvider>
          <NotificationProvider position="top-right" defaultDuration={5000}>
            {children}
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
