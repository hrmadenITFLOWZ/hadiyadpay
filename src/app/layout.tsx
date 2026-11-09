import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HadiyadPay | Personalized Digital Greetings",
  description: "Create and send thoughtful, customized digital greeting cards and celebratory moments to your loved ones.",
  metadataBase: new URL('https://www.hadiyadpay.com'),
  openGraph: {
    title: 'HadiyadPay | Personalized Digital Greetings & E-Cards',
    description: 'Create and send thoughtful, customized digital greeting cards and celebratory moments to your loved ones.',
    url: 'https://www.hadiyadpay.com',
    siteName: 'HadiyadPay',
    images: [
      {
        url: '/images/logo.jpg',
        width: 1200,
        height: 630,
        alt: 'HadiyadPay Logo Preview',
      },
    ],
    locale: 'so_SO',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HadiyadPay | Personalized Digital Greetings',
    description: 'Create and send thoughtful, customized digital greeting cards and celebratory moments to your loved ones.',
    images: ['https://www.hadiyadpay.com/images/logo.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="so">
      <head>
        <meta property="og:image" content="https://www.hadiyadpay.com/images/logo.jpg" />
        <meta property="og:image:secure_url" content="https://www.hadiyadpay.com/images/logo.jpg" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
      </head>
      <body 
        style={{ 
          backgroundColor: '#e4e4e7', 
          backgroundImage: 'radial-gradient(circle at 50% 10%, #f4f4f5 0%, #d4d4d8 60%, #a1a1aa 100%)' 
        }}
        className={`${inter.className} text-gray-900 min-h-screen antialiased selection:bg-emerald-600 selection:text-white`}
      >
        {children}
      </body>
    </html>
  );
}