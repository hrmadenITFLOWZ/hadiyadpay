import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HadiyadPay",
  description: "Send celebratory digital greetings paired with instant financial remittances home.",
  metadataBase: new URL('https://hadiyadpay.com'),
  openGraph: {
    title: 'HadiyadPay | Dir Hadiyad & E-Card Degdeg ah',
    description: 'Send celebratory digital greetings paired with instant financial remittances home.',
    url: 'https://hadiyadpay.com',
    siteName: 'HadiyadPay',
    images: [
      {
        url: '/images/og-cover.png',
        width: 1200,
        height: 630,
        alt: 'HadiyadPay Preview',
      },
    ],
    locale: 'so_SO',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HadiyadPay',
    description: 'Send celebratory digital greetings paired with instant financial remittances home.',
    images: ['/images/og-cover.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body 
        style={{ 
          backgroundColor: '#d4d4d8', 
          backgroundImage: 'radial-gradient(circle at 50% 20%, #e4e4e7 0%, #a1a1aa 100%)' 
        }}
        className={`${inter.className} text-gray-900 min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}