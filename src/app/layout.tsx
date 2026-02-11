import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google"; 
import "./globals.css";
import QueryProvider from "@/components/providers/QueryProvider";

const serif = Playfair_Display({ 
  subsets: ["latin"], 
  variable: "--font-serif",
  display: "swap",
});

const sans = Inter({ 
  subsets: ["latin"], 
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LifeLedger",
  description: "Your Digital Sanctuary",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${serif.variable} ${sans.variable} font-sans antialiased bg-[#E5E5E5]`}>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}