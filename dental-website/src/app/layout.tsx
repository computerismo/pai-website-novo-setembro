import type { Metadata } from 'next';
import { Inter, Crimson_Pro } from 'next/font/google';
import './globals.css';
import { siteConfig } from '@/lib/constants/site';
import UmamiAnalytics from '@/components/UmamiAnalytics';
// 1. Importamos o componente do Google aqui
import { GoogleAnalytics } from '@next/third-parties/google';

const inter = Inter({ subsets: ['latin'] });
const crimsonPro = Crimson_Pro({
  subsets: ['latin'],
  variable: '--font-crimson-pro',
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ['dentista', 'bruxismo', 'placa dental', 'tratamento', 'odontologia'],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} ${crimsonPro.variable}`} suppressHydrationWarning>
        <UmamiAnalytics />
        {children}
        
        <GoogleAnalytics gaId="G-GS7RKWN2ML" />
      </body>
    </html>
  );
}