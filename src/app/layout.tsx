import type {
  Metadata,
} from 'next';

import {
  Inter,
} from 'next/font/google';

import {
  getSiteUrl,
} from '../lib/seo';

import './globals.css';

const inter = Inter({
  subsets: ['latin'],
});

const metadataBase =
  getSiteUrl();

export const metadata: Metadata = {
  title: {
    default:
      'HadiyadPay | Digitale kaarten voor bijzondere momenten',

    template:
      '%s | HadiyadPay',
  },

  description:
    'Maak en deel een persoonlijke digitale kaart voor een bijzonder moment.',

  metadataBase,

  alternates: {
    canonical: '/',
  },

  openGraph: {
    title:
      'HadiyadPay | Digitale kaarten voor bijzondere momenten',

    description:
      'Maak en deel een persoonlijke digitale kaart voor een bijzonder moment.',

    url: '/',

    siteName:
      'HadiyadPay',

    images: [
      {
        url:
          '/images/logo.jpg?v=4',

        width:
          455,

        height:
          452,

        type:
          'image/jpeg',

        alt:
          'HadiyadPay',
      },
    ],

    locale:
      'nl_NL',

    type:
      'website',
  },

  robots: {
    index: true,
    follow: true,
  },

  icons: {
    icon: [
      {
        url:
          '/images/logo.jpg?v=4',

        type:
          'image/jpeg',

        sizes:
          '455x452',
      },
    ],

    shortcut:
      '/images/logo.jpg?v=4',

    apple:
      '/images/logo.jpg?v=4',
  },

  twitter: {
    card:
      'summary',

    title:
      'HadiyadPay | Digitale kaarten voor bijzondere momenten',

    description:
      'Maak en deel een persoonlijke digitale kaart voor een bijzonder moment.',

    images: [
      '/images/logo.jpg?v=4',
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children:
    React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body
        className={`${inter.className} min-h-screen bg-background text-foreground antialiased selection:bg-amber-200 selection:text-[#203b32]`}
      >
        {children}
      </body>
    </html>
  );
}