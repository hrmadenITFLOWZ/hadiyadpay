import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HadiyadPay",
  description: "Send celebratory digital greetings paired with instant financial remittances home.",
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