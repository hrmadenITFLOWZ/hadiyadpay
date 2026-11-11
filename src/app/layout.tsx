import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cardOptions } from "./data/cardOptions";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const metadataBase = new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.hadiyadpay.com');
const cardCatalogJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "HadiyadPay digital greeting cards",
  numberOfItems: cardOptions.length,
  itemListOrder: "https://schema.org/ItemListOrderAscending",
  itemListElement: cardOptions.map((card, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: card.title.en,
  })),
}).replace(/</g, "\\u003c");

export const metadata: Metadata = {
  title: {
    default: 'HadiyadPay | Digitale kaarten voor bijzondere momenten',
    template: '%s | HadiyadPay',
  },
  description: 'Maak en deel een persoonlijke digitale kaart voor een bijzonder moment.',
  metadataBase,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'HadiyadPay | Digitale kaarten voor bijzondere momenten',
    description: 'Maak en deel een persoonlijke digitale kaart voor een bijzonder moment.',
    url: '/',
    siteName: 'HadiyadPay',
    images: [
      {
        url: '/images/logo.jpg',
        width: 1200,
        height: 630,
        alt: 'HadiyadPay Logo Preview',
      },
    ],
    locale: 'nl_NL',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HadiyadPay | Digitale kaarten voor bijzondere momenten',
    description: 'Maak en deel een persoonlijke digitale kaart voor een bijzonder moment.',
    images: ['/images/logo.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="so">
      <body className={`${inter.className} min-h-screen bg-background text-foreground antialiased selection:bg-amber-200 selection:text-[#203b32]`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: cardCatalogJsonLd }}
        />
        {children}
      </body>
    </html>
  );
}